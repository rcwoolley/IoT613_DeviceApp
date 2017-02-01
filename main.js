/*
 *
 * Copyright (c) 2017 Wind River Systems, Inc.
 *
 */


// spec jslint and jshint lines for desired JavaScript linting
// see http://www.jslint.com/help.html and http://jshint.com/docs
/* jslint node:true */
/* jshint unused:true */

"use strict" ;

// Javascript docs: https://iotdk.intel.com/docs/master/mraa/node/modules/mraa.html
var mraa = require("mraa") ;

// If missing, run: npm install mqtt --save
var mqtt = require("mqtt") ;

// Change to your Edison's MAC Address
var MAC = "784b87aaea97" 

// Set your organization when using a registered device.
var ORG = 'quickstart';
var TYPE = 'iotquick-edison';
var ID = MAC;

// Set your authentication when using a registered device.
var AUTHTOKEN = '0123456789abcdefg';

var PROTOCOL = 'mqtt';
var BROKER = ORG + '.messaging.internetofthings.ibmcloud.com';
var PORT = 1883;
var DEBUG = 0;

//Create the url string
var URL = PROTOCOL + '://' + BROKER;
URL += ':' + PORT; 
// Default URL is 'mqtt://quickstart.messaging.internetofthings.ibmcloud.com:1883'

var CLIENTID= 'd:' + ORG;
CLIENTID += ':' + TYPE;
CLIENTID += ':' + ID;

var AUTHMETHOD = 'use-token-auth';
var TOPIC = 'iot-2/evt/status/fmt/json';

if (ORG == "quickstart") {
    var client  = mqtt.connect(URL, { clientId: CLIENTID });
    console.log("Go to https://quickstart.internetofthings.ibmcloud.com/#/device/"+ID+"/sensor/");   
} else {
    var client  = mqtt.connect(URL, { clientId: CLIENTID, username: AUTHMETHOD, password: AUTHTOKEN });
}
    
client.on('connect', function () {
  setInterval(function(){
    var MSG = '{"d":{"Light":' + light() + ',"Button": ' + button() + ',"Sound":'+ sound() + '}}';
    client.publish(TOPIC, MSG);//Payload is JSON
    if (DEBUG) console.log(MSG) ;     // prints mraa object to XDK IoT debug output panel
  }, 2000);//Keeps publishing every 2000 milliseconds.
});

// Grove Sound Sensor: http://wiki.seeed.cc/Grove-Sound_Sensor/
// Plug the Grove Sound Sensor into A0
var pin0 = new mraa.Aio(0);
var sound = function() {
    var sound_input = pin0.read();
    
    return parseFloat(sound_input).toFixed(4);
}

// Grove Light Sensor: http://wiki.seeed.cc/Grove-Light_Sensor/
// Plug the Grove Sound Sensor into A1
var pin1 = new mraa.Aio(1);
var light = function() {
    var light_input = pin1.read();
    
    return parseFloat(light_input).toFixed(4);
}

// Grove Button
// Plug the Grove Button into D2
// pin2.mode = mraa.MODE_PULLUP;
var pin2 = new mraa.Gpio(2);
pin2.dir = mraa.DIR_IN;

var button = function() {
    var button_input = pin2.read();
    
    return parseFloat(button_input).toFixed(4);
}