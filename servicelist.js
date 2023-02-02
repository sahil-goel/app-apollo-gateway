const fs = require('fs');
const yaml = require('js-yaml');
module.exports = {
    getServiceList: function() {
    var serviceList;
    const jsonDirectory = path.join(process.cwd());

    const nodeEnv = process.env.DEPLOY_ENV;    
    let fileContents = fs.readFileSync(jsonDirectory + '/serviceList-default.yaml', 'utf8');
    let serviceListYaml = yaml.load(fileContents);
    serviceList = serviceListYaml;
    if (nodeEnv === "dev") {
        let fileContents = fs.readFileSync(jsonDirectory + '/serviceList-dev.yaml', 'utf8');
        let serviceListYaml = yaml.load(fileContents);
        serviceList = serviceListYaml;
    }
    else if (nodeEnv === "test") {
        let fileContents = fs.readFileSync(jsonDirectory + '/serviceList-test.yaml', 'utf8');
        let serviceListYaml = yaml.load(fileContents);
        serviceList = serviceListYaml;
    }
    else if (nodeEnv === "pre") {
        let fileContents = fs.readFileSync(jsonDirectory + '/serviceList-pre.yaml', 'utf8');
        let serviceListYaml = yaml.load(fileContents);
        serviceList = serviceListYaml;
    }
    else if (nodeEnv === "prod") {
        let fileContents = fs.readFileSync(jsonDirectory + '/serviceList-prod.yaml', 'utf8');
        let serviceListYaml = yaml.load(fileContents);
        serviceList = serviceListYaml;
    }
    else if (nodeEnv === "dr") {
            let fileContents = fs.readFileSync(jsonDirectory + '/serviceList-dr.yaml', 'utf8');
            let serviceListYaml = yaml.load(fileContents);
            serviceList = serviceListYaml;
        }
    return serviceList
    }
 }
