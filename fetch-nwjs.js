const FS = require('fs');
const OS = require('os');
const assert = require('assert');
const request = require('request');
const tar = require('tar-fs')
const VERSION = 'v0.13.1';
const Path = require('path');
const rimraf = require('rimraf').sync;
const gunzip = require('gunzip-maybe');
const ProgressBar = require('progress');
const DEST_DIR = Path.join(__dirname, 'executables');

main();

function main() {
  const arch = OS.arch();
  assert(arch === 'x64', 'You must use a x64 archtecture machine');
  const osIdentifier = getOsIdentifier();
  assert(osIdentifier);
  const target = `nwjs-sdk-${VERSION}-${osIdentifier}-${arch}`;
  const fetchedDir = Path.join(__dirname, target);

  for (let d of [DEST_DIR, fetchedDir]) {
    if (FS.existsSync(d)) {
      rimraf(d);
      console.log(`  Removed: ${d}`)
    }
  }

  let progress;
  request(`http://dl.nwjs.io/${VERSION}/${target}.tar.gz`)
  .on('response', res => {
    progress = new ProgressBar('  Downloading [:bar] :percent :etas', {
      total: +res.headers['content-length']
    });
  })
  .on('data', data => progress.tick(data.length))
  .pipe(gunzip())
  .pipe(tar.extract(__dirname))
  .on('finish', () => {
    assert(FS.existsSync(fetchedDir));
    FS.renameSync(fetchedDir, DEST_DIR);
    console.log(`  Fetched in ${DEST_DIR}`);
  })
}

function getOsIdentifier() {
  const osType = OS.type();
  return /^linux/i.test(osType) ? 'linux'
    : /^windows/i.test(osType) ? 'win'
    : /^darwin/i.test(osType) ? 'osx' : null;
}
