class RequestQueue {
	private queue: Array<() => Promise<unknown>> = [];
	private isProcessing = false;
	private intervalMs: number;

	constructor(intervalMs = 1000) {
		this.intervalMs = intervalMs;
	}

	async add<T>(request: () => Promise<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			this.queue.push(async () => {
				try {
					const result = await request();
					resolve(result);
				} catch (error) {
					reject(error);
				}
			});

			if (!this.isProcessing) {
				this.processQueue();
			}
		});
	}

	private async processQueue() {
		if (this.isProcessing) return;
		this.isProcessing = true;

		while (this.queue.length > 0) {
			const request = this.queue.shift();
			if (request) {
				await request();
				await new Promise((resolve) => setTimeout(resolve, this.intervalMs));
			}
		}

		this.isProcessing = false;
	}
}

export const highPriorityQueue = new RequestQueue(300);
export const normalQueue = new RequestQueue(1000);
