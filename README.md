# ECommerceGP


# Kafka docker init
- Create network:
`
    docker network create kafka-network
`

- Run docker
`
    docker run -d --name kafkaMQ --network kafka-network -p 9092:9092 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e ALLOW_PLAINTEXT_LISTENER=yes bitnam
`i/kafka:latest


# RebitMQ
`
    docker run -d --name rabbitMQ -p 5672:5672 -p 15672:15672 rabbitmq:3-management
`