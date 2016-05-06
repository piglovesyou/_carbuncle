const FS = require('fs');
const OS = require('os');
const assert = require('assert');
const request = require('request');
const tar = require('tar-fs');
const Path = require('path');
const rimraf = require('rimraf').sync;
const ProgressBar = require('progress');
const zlib = require('zlib');
const DEST_DIR = 'executables';
const unzip = require('unzip');
const fstream = require('fstream');
const StdoutReplacer = require('./src/util/stdoutreplacer');

const TARGET_VERSION = 'v0.14.4';
const AvailableArch = {
  x64: true,
  ia32: true,
};
const ExtensionMap = {
  linux: '.tar.gz',
  osx: '.zip',
  win: '.zip',
};

main();

function main() {
  const arch = OS.arch();
  assert(AvailableArch[arch], `"${arch}" is not available architecture.`);
  const osType = normalizeOsType(OS.type());
  assert(ExtensionMap[osType]);
  const target = `nwjs-sdk-${TARGET_VERSION}-${osType}-${arch}`;
  const targetWithExt = target + ExtensionMap[osType];
  const url = `http://dl.nwjs.io/${TARGET_VERSION}/${target}${ExtensionMap[osType]}`;

  for (let d of [ DEST_DIR, target, targetWithExt ]) {
    d = Path.resolve(d);
    if (FS.existsSync(d)) {
      rimraf(d);
      console.log(`  Removed: ${d}`);
    }
  }

  const req = requestWithProgressBar(url);

  switch (ExtensionMap[osType]) {
  case '.tar.gz':
    req.pipe(zlib.createGunzip())
    .pipe(tar.extract(__dirname))
    .on('finish', finalize);
    break;
  case '.zip':
    const replacer = new StdoutReplacer();
    req.pipe(FS.createWriteStream(targetWithExt))
    .on('finish', () => {
      FS.createReadStream(targetWithExt)
      .pipe(unzip.Parse())
      .on('entry', entry => {
        const prefix = '  Extracting: ';
        replacer.out(prefix + StdoutReplacer.shortenPath(
            entry.path, process.stdout.columns - prefix.length));
      })
      .on('end', () => {
        replacer.clear();
        finalize();
        rimraf(targetWithExt);
      })
      .pipe(fstream.Writer(__dirname));
    });
    break;
  }

  function finalize() {
    assert(target);
    FS.renameSync(target, DEST_DIR);
    console.log(`  Fetched: ${Path.resolve(DEST_DIR)}`);
    console.log('  Done!');
  }
}

function requestWithProgressBar(url) {
  let bar;
  return request(url)
  .on('response', res => {
    const total = +res.headers['content-length'];
    bar = new ProgressBar('  Downloading: [:bar] :percent :etas', { total });
  })
  .on('data', data => bar.tick(data.length));
}

function normalizeOsType(osType) {
  switch (true) {
  case /^linux/i.test(osType):
    return 'linux';
  case /^windows/i.test(osType):
    return 'win';
  case /^darwin/i.test(osType):
    return 'osx';
  }
}
