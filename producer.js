#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var node = process.argv[5] || "0";
console.log("Connecting to node: " + node);

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

var maxRecipientCount = parseInt(process.argv[2]);
console.log("Max recipient count: " + maxRecipientCount);

var messageCount = parseInt(process.argv[3]);
console.log("Message Count: " + messageCount);

var maxTotalRecipients = parseInt(process.argv[4]);
console.log("Total recipient count: " + maxTotalRecipients);

<<<<<<< HEAD
 var conn = 'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-1';
=======


var conn = 'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-' + node;

>>>>>>> 987af41e234f73d9803fc31e551d5a2465618482
var channel;

/*
var conn = [
    'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-0',
    'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-1',
    'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-2'];
//    'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-3',
//    'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-4'];
*/

function send() {
    var msg = randomString(10000); // Trying to hit 24kb
    var ex = 'app';

    for(var i = 0; i < messageCount; i++) {

        // let's send to a random group, of a random size
        // Random size:
        var recipientSize = getRandomInt(0, maxRecipientCount);

        for(var c = 0; c < recipientSize; c++) {
            // random recipients
            var r = getRandomInt(0, maxTotalRecipients);
	    // console.log("[y] Sending message to " + r);
            channel.publish(ex, r.toString(), new Buffer(msg));
        }
    }
    
    console.log(" [x] Sent " + messageCount + " messages");
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
    ch.assertExchange('app', 'direct', {durable: false});


    setTimeout(function() {
        setInterval(send, 500);
    }, 100);


    console.log("Finished asserting exchanges.");
}

amqp.connect(conn, function(err, conn) {
    conn.createChannel(function(err, ch) {
        init(ch);
        channel = ch;
    });

    // setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
