class Bot {
	constructor (options) {
		this.prices = this.generatePriceList(options.midPrice, options.orders.distance, options.orders.amount)
		console.log(JSON.stringify(this.prices))
	}

	generatePriceList (price, distance, amount) {
		const sells = []
		const buys = []
		amount = amount - 1
		const offset = (price * distance)

		for (let i = 1; i <= (amount / 2); i++) {
			const iterOffset = offset * i
			sells.push(parseFloat((price + iterOffset).toFixed(2)))
		}

		for (let i = 1; i <= (amount / 2); i++) {
			const iterOffset = offset * i
			buys.push(parseFloat((price - iterOffset).toFixed(2)))
		}

		return [...sells, ...[price], ...buys].sort()
	}
}

new Bot({
	midPrice: 463.43,
	orders: {
		distance: 0.003,
		amount: 243
	}
})