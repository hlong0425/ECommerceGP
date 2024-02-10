import ampq from 'amqplib';

async function consumerOrderedMessage() {
    const connection = await ampq.connect('amqp://guest:guest@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queued-message';
    await channel.assertQueue(queueName, {
        durable: true
    });

    channel.prefetch(1);

    channel.consume(queueName, msg => {
        const message = msg.content.toString();

        setTimeout(() => {
            console.log('processed', message);
            channel.ack(msg);
        }, Math.random() * 1000);
    });
};

consumerOrderedMessage().catch(err => console.error(err));