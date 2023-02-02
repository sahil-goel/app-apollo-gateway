const fs = require('fs');
const yaml = require('js-yaml');
var util = require('util');
var exec = require('child_process').exec;

/***********************************
 Get Env from Pipeline
 ***********************************/
const nodeEnv = process.argv.slice(2)[0];
//console.log("Environment is ----> ", nodeEnv)
/*******************************************
 Get Env File specific Service List file
 *******************************************/
const serviceListFile = './serviceList-'+nodeEnv+'.yaml';
let fileContents = fs.readFileSync(serviceListFile, 'utf8');
let serviceList = yaml.load(fileContents);

/*******************************************
 Check Service End Points Health
 *******************************************/
function checkEndpointHealth(endpointsList, callback){
for (const svc of serviceList) {
    var service = svc.url;
    var serviceURL = service.substring(service.lastIndexOf("//") + 2, service.lastIndexOf(":80"));
//    console.log("Service URL is ----> ", serviceURL)
    var ingressEndpoint = serviceURL + '.aks.' + nodeEnv + '.neobank-internal.ae/graphql'
//    console.log("Ingress End Point is ----> ", ingressEndpoint)
    var command = 'curl ' + ingressEndpoint
    child = exec(command, function(error, stdout, stderr) {
        if (stdout.includes('404 Not Found')){
             callback("Service which is not deployed :" + svc.url)
        }
    });
}
}

checkEndpointHealth(serviceList, function(result){
    console.log(result)
});