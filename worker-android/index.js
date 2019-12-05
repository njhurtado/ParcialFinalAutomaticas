const fs = require("fs");
const fsExtra = require('fs-extra');
let shell = require("shelljs");
const { exec} = require('child_process');
const cron = require("node-cron");
const express = require("express");
//let nodemailer = require("nodemailer");
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
var isExecution=false;
const rm = require('rimraf')
var _appGlobal={
  _pathAPK:"Mileage_v1.1.2_apkpure.com.apk",
  _pkgAPK:"com.evancharlton.mileage"
}

var _numMut=5;
var _sdkAndroidHome='/home/eanunezt/Android/Sdk';
var _EmulatorAvd='@Pixel_2_API_27';
var _dir=__dirname;
var _pathSript="features";
var _nomReport='result';
var _ExcecID='-1';
var _ExecGlobal={};
const STATE_REGISTER='REGISTER';
const STATE_EXECUTED='EXECUTED';
const STATE_PENDING='PENDING';



Execution = require('./models/execution.model.js');
Test = require('./models/test.model.js');
File = require('./models/file.model.js');
Result = require('./models/result.model.js');
TestMatrix= require('./models/testmatrix.model.js');

app = express();
var _execution;
var arrayLength=1;
var _test;
async function  getInfoMutants() {

  let rawdata = fs.readFileSync('infoMutants.json');
let dataJSON = JSON.parse(rawdata);
return new Promise((resolve, reject) => { 
    resolve(dataJSON);
  });
}

mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
}).then(() => {
    console.log("Successfully connected to the database"); 
}).catch(err => {
   
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


getInfoMutants().then(async data=>{
 await openEmulator(_sdkAndroidHome+'/tools/emulator '+_EmulatorAvd+' -port 5556 -no-boot-anim')
  .then( async func=>{     
    return await checkEmulatorRun();
   })
   .then( async func=>{
    
    while (arrayLength<=data.length) {
      console.log("whilewhilewhilewhilewhile--->"+func);
   var app=data[arrayLength-1]
          
      console.log("execShellCommand 1--->"+func);
      // await  process.chdir(_dir);   
      console.log("execShellCommand--->"+_sdkAndroidHome+'/platform-tools/adb -s emulator-5556 install -r '+app._pathAPK);
     
    await  execShellCommand(_sdkAndroidHome+'/platform-tools/adb -s emulator-5556 install -r '+app._pathAPK)
       .then( async func=>{
        //await sleep(9000)
        console.log("execShellCommand 2--->"+func);
        var events=app.events;
        var seed=app.seed;
        var nomReport  =app.nomReport; 

      //var c1=_sdkAndroidHome+'/platform-tools/adb shell \"'+ "monkey -p "+app._pkgAPK+" -c android.intent.category.MONKEY -c android.intent.category.LAUNCHER -c android.intent.category.DEFAULT --pct-majornav 20 --monitor-native-crashes --ignore-security-exceptions --ignore-crashes --ignore-timeouts --kill-process-after-error -s 220 -v -v -v 1000 \""+' > '+nomReport+'-logs.txt';
        //await execShellCommand(_sdkAndroidHome+'/platform-tools/adb logcat *:E');
       // await execShellCommand('echo \'\' >> /home/eanunezt/Documents/'+nomReport+'_DeviceLog.txt');
        //await execShellCommand(_sdkAndroidHome+'/platform-tools/adb logcat *:E >> /home/eanunezt/Documents/'+nomReport+'_DeviceLog.txt');
        
        //return await execShellCommand(c1); 
     
        return await execShellCommand(_sdkAndroidHome+'/platform-tools/adb shell monkey --monitor-native-crashes --ignore-security-exceptions --ignore-crashes --ignore-timeouts --kill-process-after-error -p '+app._pkgAPK+' -s '+seed+' -v '+events+' > '+nomReport+'-logs.txt'); 
       }) .then( async func=>{
        //await sleep(9000)
        console.log("execShellCommand 3--->"+func);
        arrayLength=arrayLength+1;    
        
       }) 
  }
})
  
}
)
./*then(async e=>{
  return await execShellCommand(_sdkAndroidHome+'/platform-tools/adb -s emulator-5556 emu kill');
  
 })
 .*/then(e=>{

  console.log("listooooooooooooooooooooooooooo"); 
 })
.catch(err => {

  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});




//task.start();
app.listen("3121");




 async function  removeFilesPath(pathFiles){

  await rm(pathFiles, (error) => {
    if (error) {
    console.error(`Error while removing existing files: ${error}`)
    process.exit(1)
    }
    console.log('Removing all existing files on '+pathFiles)
    })
}


 async function  removeFiles(){
 console.log('Removing removeFiles')
await  removeFilesPath('*.txt');
 }

 async function  openEmulator(emulatorPath){
    await exec(_sdkAndroidHome+'/platform-tools/adb -s emulator-5556 emu kill',(error, stdout, stderr) => {
    if (error) {
     console.warn("openEmulator:emulator-5556 not running");
    }
    //console.info(stdout);
   // return;
    //resolve(stdout? stdout : stderr);
   });

   execShellCommand(emulatorPath);  
 
 }
 
 async function checkEmulatorRun(){
  return new Promise((resolve, reject) => { 
    bootChecker = setInterval(function(){
    exec(_sdkAndroidHome+'/platform-tools/adb shell getprop init.svc.bootanim', function(error, stdout, stderr){

      if (stdout.toString().indexOf("stopped")>-1){
  
          clearInterval(bootChecker);
          console.log('emulator load ok');
          resolve(stdout? stdout : stderr);
          //return;
      } else {
          console.log('we are still loading');
      }
  })
  },1000);
});
 }


/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
   exec(cmd, (error, stdout, stderr) => {
    if (error) {
     console.warn(error);
    }
    console.info(stdout);
    resolve(stdout? stdout : stderr);
   });
  });
 }
//copyFolder('./features/', _pathMutApk+'/features/');
function copyFolder(source, target) {  

  
  return new Promise((resolve, reject) => {

    _pathSript="./features/"+_test._id+".feature";

  var contentFileBody=unescape(_test.script).replace(new RegExp('\\\\r\\\\n', 'g'),'\n');
  contentFileBody=contentFileBody.replace(new RegExp('\\\\\\n', 'g'),'\n');
  contentFileBody=contentFileBody.replace(new RegExp('\\\\', 'g'),'');
  fs.writeFile(_pathSript,contentFileBody, function(err) {
     if(err) {
        return console.log(err);
      }
    console.log('writed:'+_pathSript);
  }); 


    fsExtra.copy(source, target, (err) => {
      if (err) 
      throw err;
      console.log('features was copied to mutant'+_numMut);
      resolve('OK REMOVE FOLDERS');
    });
   });
  
}

function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}