const fs = require("fs");
const fsExtra = require('fs-extra');
let shell = require("shelljs");
const { exec,execSync } = require('child_process');
const cron = require("node-cron");
const express = require("express");
//let nodemailer = require("nodemailer");
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
var _pkgAPK="com.evancharlton.mileage";
var _numMut=5;
var _sdkAndroidHome='/home/eanunezt/Android/Sdk';
var _EmulatorAvd='@Nexus_5X_PLAY_64';
var _pathMutApk='./mutants/'+_pkgAPK+'-mutant5';
var _dir=__dirname;
var _pathSript="features";



Execution = require('./models/execution.model.js');
Test = require('./models/test.model.js');

app = express();

openEmulator(_sdkAndroidHome+'/tools/emulator '+_EmulatorAvd+' -port 5556 -no-boot-anim')
   .then( async func=>{     
     return await checkEmulatorRun();
    }).  then( async func=>{
     // await  process.chdir(_pathMutApk);   
       console.log("execShellCommand--1->"+_pathMutApk);
       return execShellCommand('calabash-android resign mutants/com.evancharlton.mileage-mutant50/*-aligned-debugSigned.apk'); 
      }).
      
      then( async func=>{
        // await  process.chdir(_pathMutApk);   
          console.log("execShellCommand--2->"+_pathMutApk);
          return execShellCommand(_sdkAndroidHome+'/platform-tools/adb -s emulator-5556 install -r mutants/com.evancharlton.mileage-mutant50/*-aligned-debugSigned.apk'); 
         }).
      then( async func=>{
       await sleep(9000) 
       //await  process.chdir(_pathMutApk);    
       console.log("execShellCommand--3->"+func);
       //return ;
       return execShellCommand('calabash-android run mutants/com.evancharlton.mileage-mutant50/*-aligned-debugSigned.apk'); 
      })
     .then( async func=>{
      console.log("execShellCommand ---4>"+func);
      await sleep(5000)
      return execShellCommand(_sdkAndroidHome+'/platform-tools/adb -s emulator-5556 emu kill');        
  
     })
     .then(async func=>{
      await sleep(3000)
      isExecution=false;
      _execution=null;
      console.log("okkkkk"); 
     })  
     .catch(err => {
     
      console.log('Could not close process. Exiting now...', err);
      process.exit();
  });
 

app.listen("3127");

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


function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}