#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var conn = 'amqp://user:BGJLo2pmiyx5@rabbitmq-cluster-1-node-0';
var channel;

var exCount = parseInt(process.argv[2]);
console.log("Exchange Count: " + exCount);

var connectCount = parseInt(process.argv[3]);

function init(ch) {
    for(var i = 0; i < exCount; i++) {
        var ex = "ex-" + i;
        ch.assertExchange(ex, 'fanout', {durable: false});
    }



    ch.assertQueue('', {expires: 300000}, function(err, q) {
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
        ch.bindQueue(q.queue, ex, '');

        ch.consume(q.queue, function(msg) {
            console.log(" [x] %s", msg.content.toString());
        }, {noAck: true});
    });


    console.log("Finished asserting and binding.");
}




amqp.connect(conn, function(err, conn) {
    conn.createChannel(function(err, ch) {
        channel = ch;
        init(ch);

        var ex = 'logs';


    });
});