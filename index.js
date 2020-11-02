// Example modified from https://github.com/mqttjs/MQTT.js#example
const mqtt = require('mqtt');

// Vehicle positioning for ongoing buses at Lauttasaari bridge
const myTopic = '/hfp/v2/journey/ongoing/vp/bus/+/+/+/+/+/+/+/+/60;24/18/69/27/#';

const hslClient = mqtt.connect('mqtts://mqtt.hsl.fi:8883');
const mosquittoClient = mqtt.connect('mqtt://test.mosquitto.org:1883');

hslClient.on('connect', function () {
    hslClient.subscribe(myTopic, function (err) {
        if (!err) {
            console.log('Connected!');
        } else {
            console.log(err);
        }
    })
});

hslClient.on('message', function (topic, message) {
    let json = JSON.parse(message.toString());
    let speed = json.VP.spd;
    let operator = json.VP.oper;
    let vehicle = json.VP.veh;
    let latitude = json.VP.lat;
    let longitude = json.VP.long;
    let vehicleinfo = ( 
    `
 oper: ${operator}
 veh: ${vehicle}
 lat: ${latitude}
 long: ${longitude}
 spd: ${speed}
`);
    if (speed > 10) {
        console.log('{' + vehicleinfo + " cause: Possible overspeed"+'\n }');
    } else if (speed < 5) {
        console.log('{' + vehicleinfo + " cause: Potential traffic jam"+'\n }');
    } else {
        console.log('All normal')
    };
    //};
    //console.log('{' + vehicleinfo + " cause: possible overspeed"+'\n }');

    //console.log('Speed: ' + speed);
    // todo: handle the traffic jam and speeding logic here
});