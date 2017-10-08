#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

var exCount = parseInt(process.argv[2]);
console.log("Exchange Count: " + exCount);

var queueCount = exCount * 3;

var sendCount = parseInt(process.argv[3]);

var conn = 'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-0';
var channel;

/*
var conn = [
    'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-0',
    'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-1',
    'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-2',
    'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-3',
    'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-4'];
*/

function send() {
    var val = randomString(10000); // Trying to 24kb
    for(var i = 0; i < sendCount; i++) {

        var exi = getRandomInt(0, exCount);
        var ex = "ex-" + exi;
        var msg = val;

        channel.publish(ex, '', new Buffer(msg));
    }

    console.log(" [x] Sent " + sendCount + " messages");
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function init(ch) {
    for(var i = 0; i < exCount; i++) {
        var ex = "ex-" + i;
        ch.assertExchange(ex, 'fanout', {durable: false});
    }

    console.log("Finished asserting " + exCount + " exchanges.");
}

amqp.connect(conn, function(err, conn) {
    conn.createChannel(function(err, ch) {
        init(ch);
        channel = ch;
        setInterval(send, 500);
    });

    // setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
