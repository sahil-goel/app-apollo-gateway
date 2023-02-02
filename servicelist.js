const fs = require('fs');
const yaml = require('js-yaml');
module.exports = {
    getServiceList: function() {
    var serviceList;
    const nodeEnv = process.env.DEPLOY_ENV;    
    let fileContents = fs.readFileSync('./serviceList-default.yaml', 'utf8');
    let serviceListYaml = yaml.load(fileContents);
    serviceList = serviceListYaml;
    if (nodeEnv === "dev") {
        let fileContents = fs.readFileSync('./serviceList-dev.yaml', 'utf8');
        let serviceListYaml = yaml.load(fileContents);
        serviceList = serviceListYaml;
    }
    else if (nodeEnv === "test") {
        let fileContents = fs.readFileSync('./serviceList-test.yaml', 'utf8');
        let serviceListYaml = yaml.load(fileContents);
        serviceList = serviceListYaml;
    }
    else if (nodeEnv === "pre") {
        let fileContents = fs.readFileSync('./serviceList-pre.yaml', 'utf8');
        let serviceListYaml = yaml.load(fileContents);
        serviceList = serviceListYaml;
    }
    else if (nodeEnv === "prod") {
        let fileContents = fs.readFileSync('./serviceList-prod.yaml', 'utf8');
        let serviceListYaml = yaml.load(fileContents);
        serviceList = serviceListYaml;
    }
    else if (nodeEnv === "dr") {
            let fileContents = fs.readFileSync('./serviceList-dr.yaml', 'utf8');
            let serviceListYaml = yaml.load(fileContents);
            serviceList = serviceListYaml;
        }
    return serviceList
    }
 }
