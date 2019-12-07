const fs = require("fs");
const fsExtra = require('fs-extra');
let shell = require("shelljs");
const vrt = require('./manejador-vrt.js');
const { exec,execSync } = require('child_process');
const cron = require("node-cron");
const express = require("express");
//let nodemailer = require("nodemailer");
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
var _pkgAPK="com.evancharlton.mileage";
var _numMut=5;
var _sdkAndroidHome='/home/njhurtado/Android/Sdk';
var _EmulatorAvd='@Pixel_2_API_27';
var _pathMutApk='./mutants/'+_pkgAPK+'-mutant5';
var _dir=__dirname;
var _pathSript="features";
const rm = require('rimraf');

var configVrt = [
  { "before": "../base/before1.png", "after": "screenshot_0.png", "result": "result1.png" },
  { "before": "../base/before2.png", "after": "screenshot_1.png", "result": "result2.png" },
  { "before": "../base/before3.png", "after": "screenshot_2.png", "result": "result3.png" }
]


Execution = require('./models/execution.model.js');
Test = require('./models/test.model.js');

app = express();

openEmulator(_sdkAndroidHome+'/tools/emulator '+_EmulatorAvd+' -port 5556 -no-boot-anim')
   .then( async func=>{     
     return await checkEmulatorRun();
    }). /* then( async func=>{
     // await  process.chdir(_pathMutApk);   
       console.log("execShellCommand--1->"+_pathMutApk);
       return execShellCommand('calabash-android resign com.evancharlton.mileage.apk'); 
      }).*/      
      then( async func=>{
       //await sleep(9000) 
       //await  process.chdir(_pathMutApk);    
       console.log("execShellCommand--3->"+func);     
        var range_init=5;
        var range_end=6;

       var mut=range_init;
       var mut_max=range_end;


       while (mut<=mut_max) {
        await execShellCommand('calabash-android resign ./mutants/com.evancharlton.mileage-mutant'+mut+'/*aligned-debugSigned.apk')
        //await execShellCommand('calabash-android run com.evancharlton.mileage.apk -p android')
        . then (r=>{         
          mut=mut+1;
        });
        console.log("resign mut->"+(mut-1));
       }

        mut=range_init;
        mut_max=range_end;

       while (mut<=mut_max) {
        await execShellCommand('calabash-android run ./mutants/com.evancharlton.mileage-mutant'+mut+'/*aligned-debugSigned.apk -p android')
        //await execShellCommand('calabash-android run com.evancharlton.mileage.apk -p android')
        . then ((r,stderr)=>{
         
          manageFiles(mut);
          mut=mut+1;
           
        });
        console.log("run mut->"+(mut-1));
       }

       mut=range_init;
        mut_max=range_end;

       while (mut<=mut_max) {
      var stderr;
        let rutaReportes = './';
        await process.chdir(__dirname);
       // await  removeFiles('report.html');
       // await  removeFiles('*.png');
        await process.chdir('./reports/mutant'+mut+'/');

        await  vrt.generarReporteVrt(configVrt, '../base/', rutaReportes, stderr).then(r=>{
          mut=mut+1;
          console.log("Genera reporte VRT" );         
        })       
        console.log("run vrt->"+(mut-1));      
       }


  
       return new Promise(resolve=>{
        resolve('ok');})

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
      execShellCommand(_sdkAndroidHome+'/platform-tools/adb -s emulator-5556 emu kill');   
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

async function  manageFiles(mut,stderr){
  console.log('manageFiles::::')
  fs.mkdirSync('./reports/mutant'+mut, { recursive: true });
  var pathCp='cp *_0.png *_1.png  *_2.png report.html ./reports/mutant'+mut+'/' ;//vrt.html 
  //var pathCp2='cp ./base/*.png ./reports/mutant'+mut+'/' ;
  console.log("pathCp ->" + pathCp);
  var code = await execSync(pathCp);
  //code = await execSync(pathCp2);

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


function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}

function  removeFiles(pathFiles){

  rm(pathFiles, (error) => {
    if (error) {
    console.error(`Error while removing existing files: ${error}`)
    process.exit(1)
    }
    console.log('Removing all existing files successfully!')
    })
}