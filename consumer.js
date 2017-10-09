#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var node = process.argv[4] || "0";
console.log("Connecting to node: " + node);

var conn = 'amqp://user:y5tfC5jiVawg@rabbitmq-cluster-2-node-' + node;
var channel;


var connectCount = parseInt(process.argv[2]);
console.log("Connection count: " + connectCount);

var maxTotalRecipients = parseInt(process.argv[3]);
console.log("Total recipient count: " + maxTotalRecipients);

function init(ch) {
    var ex = 'app';
    ch.assertExchange(ex, 'direct', {durable: false});

    for(var i = 0; i < connectCount; i++) {
        const whoami = getRandomInt(0, maxTotalRecipients).toString();

        ch.assertQueue(whoami, {expires: 60000}, function(err, q) {

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

            ch.bindQueue(q.queue, ex, whoami);

            ch.consume(q.queue, function(msg) {
//                console.log(" [x] %s", msg.content.toString());
            }, {noAck: true});
        });
    }

    console.log("Finished asserting and binding.");
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

amqp.connect(conn, function(err, conn) {
    conn.createChannel(function(err, ch) {
        channel = ch;
        init(ch);
    });
});
