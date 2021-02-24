<template>
	<q-page padding>
		<div class="row q-mb-lg">
			<div class="col">
				<q-btn :icon="!paused ? 'pause': 'play_arrow'" @click="paused = !paused" color="primary" />
				<q-btn icon="refresh" @click="refreshData" color="primary" :label="updateTime" class="q-ml-md" />
			</div>
			<div class="col-10 text-center">
				Symbol: {{ symbol }}
				Last: {{ ticker.last }}
				Ask: {{ ticker.ask }}
				Bid: {{ ticker.bid }}
				Avg: {{ ticker.average }}
				Change: {{ ticker.change }} ({{ ticker.percentage }}%)
			</div>
		</div>
		<div class="row q-col-gutter-md">
			<div class="col-3 q-col-gutter-md">
				<div class="row q-gutter-md">
					<q-input v-model="price" label="Price" class="col-12" />
					<q-input v-model="amount" label="Amount" class="col-12" />
					<q-btn-toggle
						v-model="side"
						:options="[
							{ label: 'Buy', value: 'buy' },
							{ label: 'sell', value: 'sell' }
						]"
						toggle-color="primary"
					/>
					<q-btn-toggle
						v-model="quickAmount"
						:options="[
							{ label: '25%', value: 0.25 },
							{ label: '33%', value: 0.33333 },
							{ label: '50%', value: 0.5 },
							{ label: '100%', value: 1 }
						]"
						toggle-color="primary"
						@input="setAmountByPercent"
						:disabled="balance === undefined"
						:readonly="balance === undefined"
					/>
					<q-btn
						name="submit"
						label="Submit"
						@click="submitOrder"
						color="primary"
						class="col-12"
						:disabled="balance === undefined"
						:readonly="balance === undefined"
					/>
				</div>
				<p class="row" v-if="balance !== undefined">
					{{ base }}: {{ balance[base].free }}
					<br>
					{{ coin }}: {{ balance[coin].free }}
					<br>
					<!-- tb: {{ topBuy }}, bs: {{ botSell }} -->
				</p>
			</div>
			<div class="col-4 q-ml-md">
				<q-table
					dense
					title="Buy"
					:data="buyOrders"
					:columns="buyOrderColumns"
					:pagination="initialBuyPagination"
				/>
			</div>
			<div class="col-4">
				<q-table
					dense
					title="Sell"
					:data="sellOrders"
					:columns="sellOrderColumns"
					:pagination="initialSellPagination"
					virtual-scroll
				/>
			</div>
		</div>
	</q-page>
</template>

<script>
import ccxt from 'ccxt'
// const cors = require('cors-anywhere')

export default {
	name: 'PageIndex',
	data () {
		return {
			paused: false,
			// Pair symbol
			symbol: 'KCS/USDT',
			// Base currency
			base: 'USDT',
			// Quote currency
			coin: 'KCS',
			price: 0,
			amount: 0,
			side: '',
			quickAmount: '',
			ticker: {},
			balance: undefined,
			updateTime: 3,
			updateMax: 3,
			// List of order prices
			priceList: [
				7.716,
				7.685,
				7.654,
				7.624,
				7.593,
				7.563,
				7.533,
				7.503,
				7.473,
				7.443,
				7.414,
				7.384,
				7.355,
				7.325,
				7.296,
				7.267,
				7.238,
				7.209,
				7.181,
				7.152,
				7.124,
				7.095,
				7.067,
				7.039,
				7.011,
				6.983,
				6.955,
				6.927,
				6.900,
				6.872,
				6.845,
				6.818,
				6.790,
				6.763,
				6.736,
				6.710,
				6.683,
				6.656,
				6.630,
				6.603,
				6.577,
				6.551,
				6.525,
				6.499,
				6.473,
				6.447,
				6.421,
				6.396,
				6.370,
				6.345,
				6.320,
				6.294,
				6.269,
				6.244,
				6.219,
				6.195,
				6.170,
				6.145,
				6.121,
				6.097,
				6.072,
				6.048,
				6.024,
				6.000,
				5.976,
				5.952,
				5.928,
				5.905,
				5.881,
				5.857,
				5.834,
				5.811,
				5.787,
				5.764,
				5.741,
				5.718,
				5.695,
				5.673,
				5.650,
				5.627,
				5.605,
				5.582,
				5.560,
				5.538,
				5.516,
				5.494,
				5.472,
				5.450,
				5.428,
				5.406,
				5.385,
				5.363,
				5.342,
				5.320,
				5.299,
				5.278,
				5.257,
				5.236,
				5.215,
				5.194,
				5.173,
				5.152,
				5.132,
				5.111,
				5.091,
				5.070,
				5.050,
				5.030,
				5.010,
				4.990,
				4.970,
				4.950,
				4.930,
				4.910,
				4.891,
				4.871,
				4.852,
				4.832,
				4.813,
				4.794,
				4.775,
				4.755,
				4.736,
				4.717,
				4.699,
				4.680,
				4.661,
				4.642,
				4.624,
				4.605,
				4.587,
				4.569,
				4.550,
				4.532,
				4.514,
				4.496,
				4.478,
				4.460,
				4.442,
				4.424,
				4.407,
				4.389,
				4.372,
				4.354,
				4.337,
				4.319,
				4.302,
				4.285,
				4.268,
				4.251,
				4.234,
				4.217,
				4.200,
				4.183,
				4.166,
				4.150,
				4.133,
				4.117,
				4.100,
				4.084,
				4.067,
				4.051,
				4.035,
				4.019,
				4.003,
				3.987,
				3.971,
				3.955,
				3.939,
				3.923,
				3.908,
				3.892,
				3.876,
				3.861,
				3.845,
				3.830,
				3.815,
				3.799,
				3.784,
				3.769,
				3.754,
				3.739,
				3.724,
				3.709,
				3.694,
				3.680,
				3.665,
				3.650,
				3.636,
				3.621,
				3.607,
				3.592,
				3.578,
				3.563,
				3.549,
				3.535,
				3.521,
				3.507,
				3.493,
				3.479,
				3.465
			],
			// Amount of Quote currency to use in each order
			tradingAmount: 25,
			// Minimum Amount of Base currency required to place an order (to be removed)
			baseThreshold: 120,
			initialBuyPagination: {
				sortBy: 'price',
				descending: true,
				rowsPerPage: 10
			},
			buyOrders: [],
			buyOrderColumns: [
				{
					name: 'amount',
					label: 'Amount',
					field: 'amount',
					align: 'left'
				},
				{
					name: 'price',
					label: 'Price',
					field: row => parseFloat(row.price),
					align: 'left',
					sortable: true
				}
			],
			initialSellPagination: {
				sortBy: 'price',
				descending: false,
				rowsPerPage: 10
			},
			sellOrders: [],
			sellOrderColumns: [
				{
					name: 'amount',
					label: 'Amount',
					field: 'amount',
					align: 'left'
				},
				{
					name: 'price',
					label: 'Price',
					field: row => parseFloat(row.price),
					align: 'left',
					sortable: true
				}
			],
			// eslint-disable-next-line new-cap
			kucoin: new ccxt.kucoin({
				// Required if run locally
				proxy: 'http://localhost:8181/',
				// Api credentials
				apiKey: '',
				secret: '',
				password: ''
			}),
			topBuy: 0,
			botSell: 0,
			SuggestedPrice: 0
		}
	},
	async created () {
		await this.refreshData()

		setInterval(async () => {
			if (this.updating) {
				return
			}

			if (!this.paused) {
				this.updateTime = this.updateTime - 1
			}

			if (this.updateTime <= 0) {
				await this.refreshData()
			}
		}, 1000)
	},
	methods: {
		async refreshData () {
			if (this.paused || this.updating) {
				return
			}

			this.updating = true
			// Get our orders
			const orders = await this.kucoin.fetchOpenOrders(this.symbol, undefined, 500, { tradeType: 'MARGIN_TRADE' })
			// Separate buys from sells
			this.buyOrders = orders.filter(order => order.side === 'buy')
			this.sellOrders = orders.filter(order => order.side === 'sell')

			// Let's get ticker info
			this.ticker = await this.kucoin.fetchTicker(this.symbol)

			// Get our balances
			this.balance = await this.kucoin.fetchBalance({ type: 'margin' })

			// Determine our top buy and bottom sell numbers
			if (this.buyOrders.length > 0) {
				this.topBuy = this.buyOrders
					.map(order => order.price)
					.reduce((a, b) => (a === undefined || b > a) ? b : a)
			} else {
				this.topBuy = 0
			}

			if (this.sellOrders.length > 0) {
				this.botSell = this.sellOrders
					.map(order => order.price)
					.reduce((a, b) => (a === undefined || b < a) ? b : a)
			} else {
				this.botSell = 99999999
			}

			// reduce order list to what is between top/bot buy/sell
			this.suggestedPrice = this.priceList.filter(price => {
				return price > this.topBuy && price < this.botSell
			})

			// console.log([this.topBuy, this.botSell, this.suggestedPrice])

			// If we have more than one order in gap it means we can place a sell or buy.
			// Determine what price and which side
			// console.log([this.balance[this.base].free > 1, this.balance[this.coin].free > 1])
			// we need to buy
			// We don't know the price so leaves us kind of guessing
			// todo compare .free to spot price for threshold
			if (this.balance[this.base].free >= this.baseThreshold) {
				// console.log('GOT MONEY')
				// calculate lowest order
				if (this.suggestedPrice.length > 1) {
					// console.log('SETTING BUY')
					this.suggestedPrice = [this.suggestedPrice.reduce((a, b) => (a === undefined || b < a) ? b : a)]
					this.side = 'buy'
				}
				// this.suggestedPrice = this.suggestedPrice[0]
			}
			// console.log(this.balance)
			// we need to sell
			if (this.balance[this.coin].free >= this.tradingAmount && this.side !== 'buy') {
				// console.log('GOT COINS')
				// calulate highest
				if (this.suggestedPrice.length > 1) {
					// console.log('SETTING SELL')
					this.suggestedPrice = [this.suggestedPrice.reduce((a, b) => (a === undefined || b > a) ? b : a)]
					this.side = 'sell'
				}
				// this.suggestedPrice = this.suggestedPrice[0]
			}
			// console.log([this.balance[this.coin].free, this.tradingAmount])
			// console.log(this.side === 'buy')
			this.price = this.suggestedPrice[0]
			this.amount = this.tradingAmount
			// console.log(this.suggestedPrice)
			// Determine if we have enough balance to support found price. (stale profit or partial order execution)
			if ((this.side === 'buy' || this.side === 'sell') && (this.side === 'buy' ? (this.price * this.amount) : this.amount) <= this.balance[this.side === 'buy' ? this.base : this.coin].free) {
				setTimeout(async () => {
					await this.submitOrder()
					this.side = ''
					this.updateTime = this.updateMax
					this.updating = false
				}, 1000)
			} else {
				// console.log('skip')
				this.updateTime = this.updateMax
				this.updating = false
			}
		},
		async submitOrder () {
			if (this.amount === 0 || this.price === 0) {
				return
			}

			console.warn('Creating order: ', this.symbol, ' side: ', this.side, ' amount: ', this.amount, ' price: ', this.price)
			await this.kucoin.createOrder(this.symbol, 'limit', this.side, this.amount, this.price, { tradeType: 'MARGIN_TRADE' })
			// 0 Balances
			// this.amount = 0
			this.price = 0
			// this.quickAmount = ''
			// Update data
			this.refreshData()
		},
		setAmountByPercent (value) {
			// Determine if using base/other as balance
			const balance = (this.side === 'buy') ? this.balance[this.base].free : this.balance[this.coin].free

			// Obtain percentage
			this.amount = parseFloat(value) * parseFloat(balance)

			// We need to convert to the coin-amount
			if (this.side === 'buy') {
				this.amount = this.amount / this.price
				// Deduct for fee on this side
				this.amount = this.amount - (this.amount * 0.001)
			}

			// Note, this is a little off but seems to be lower than real
			this.amount = parseFloat(this.amount.toFixed(6))
		},
		round (value, decimals) {
			return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
		}
	}
}
</script>
<style lang="scss" scoped>
::v-deep .q-page > .row {
	max-width: 90rem;
	margin: 0 auto;
}

// .orders {
// 	li {
// 		background-color: #eee;

// 		&:nth-child(odd) {
// 			background-color: #ccc;
// 		}

// 	}
// }
</style>
