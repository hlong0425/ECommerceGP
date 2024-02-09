import ampq from 'amqplib';

const runProducer = async () => {
    try {
        const connection = await ampq.connect('amqp://guest:guest@localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx';
        const notiQueue = 'notificationQueueProcess';
        const notificaionExchangeDLX = 'notificationExDLX';
        const notificationRoutingKeyDLX = 'notificationRoutingDLX'; // assert.;

        // 1. create Exchange.
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        });

        // 2. create Queue.
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // Cho phep cac ket noi khac truy cap vao cung hang doi.
            deadLetterExchange: notificaionExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        });

        //3. bind queue.
        await channel.bindQueue(queueResult.queue, notificationExchange);


        //4. Send message.
        const msg = 'a new product 03';
        console.log(`producer msg::`, msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: 10000
        });

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (err) {
        console.log(err)
    }
};

runProducer().then(rs => console.log(rs)).catch(console.error);