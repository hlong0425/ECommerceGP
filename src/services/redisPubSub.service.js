import redis from 'redis';


class RedisPubSubService {
	_subscriber = redis.createClient()
	_publisher = redis.createClient()

	constructor() {
	}

	async publisher(channel, message) {
		await this._publisher.connect();

		return new Promise((resolve, reject) => {
			this._publisher.publish(channel, message)
				.then(ok => {
					console.log('ok', ok)
					resolve(ok)
				})
				.catch((err) => {
					reject(err)
					console.log('errr >>>>>>>>>>>>.', err)
				});
		});
	}

	async subscriber(channel, callback) {
		await this._subscriber.connect();

		this._subscriber.subscribe(channel, (message, channel) => {
			console.log('listening on:', channel)
			callback(message);
		});
	}
}

export default new RedisPubSubService