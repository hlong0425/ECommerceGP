import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});


const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
});

const runProducer = async () => {
    await producer.connect();

    await producer.on('producer.connect', (data) => {
        console.log(data.type)
    })
    await producer.send({
        topic: 'test-topic',
        messages: [
            { value: 'Ok test topic value................' }
        ]
    });
    await producer.disconnect();
}

runProducer(console.log('Run...')).catch(error => console.error(error));
