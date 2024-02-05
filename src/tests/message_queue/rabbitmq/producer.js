import ampq from 'amqplib';

const runProducer = async () => {
    try {
        const connection = await ampq.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true
        });

        // send message to consumber channel
        channel.sendToQueue(queueName, Buffer.from('This is message.'))
        console.log(`message sent:`, 'This is message.');

    } catch (err) {
        console.log(err)
    }
};

runProducer();