# ECommerceGP


### Kafka docker init
- Create network:
```bash
    docker network create kafka-network
```

- Run docker
```bash
    docker run -d --name kafkaMQ --network kafka-network -p 9092:9092 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e ALLOW_PLAINTEXT_LISTENER=yes bitnami/kafka:latest
```


### RebitMQ
```bash
    docker run -d --name rabbitMQ -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### Mysql
1.
```bash
    docker network create my_master_slave_mysql
```
2.
```bash
    docker run -d --name mysql18-master --network my_master_slave_mysql -p 8811:3306 -e MYSQL_ROOT_PASSWORD=admin mysql:8.0
```
3.
```bash
    docker run -d --name mysql18-slave --network my_master_slave_mysql -p 8822:3306 -e
    MYSQL_ROOT_PASSWORD=admin mysql:8.0
```
