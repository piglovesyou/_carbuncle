import Script from '../modified-selenium-builder/seleniumbuilder/content/html/builder/script';
import Selenium2 from '../modified-selenium-builder/seleniumbuilder/content/html/builder/selenium2/selenium2';

module.exports = {convertStepToJson, convertStepToInstance};

function convertStepToJson(step) {
  return step.toJSON();
}

function convertStepToInstance(step) {
  return Script.stepFromJSON(step, Selenium2);
}
