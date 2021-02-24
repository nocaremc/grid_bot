# grid_bot
A simple grid bot

## A few notes:
This bot works only with Kucoin in their Margin section at this time. You do not need an open margin to use it.
Trades will be performed automatically
You can pause the bot in the interface
You will need to create your own grid. I've included a spreadsheet (docs/ladder_template.ods) to simplifiy this.
You will need to add your api and setup information to src/pages/Index.vue
This bot is passive and works based on the amount of funds available in your margin account. Expect to dedicate it to the bot. If you move any extra money in it will be used. I'll change this to sandbox accounts in the future.

## Known bugs
Occasionally your internet or kucoin may flake out causing an error which stops the bot. ctrl-r to get past that for now.

If you are freshly trading a coin you've not owned yet or in a while the bot can't handle it's inability to retrieve a 0 balance. Buy a small amount and ctrl-r.

Partially filled orders combined with profit funds sitting around can cause an order place such that you have to gap in your grid. This one is a flaw but baseThreshold and having 200 orders (kucoin max) combats it for now. You can check using the included spreadsheet. Canceling orders (even cancel-all) and manually reconciling may be needed.

Duplicate javascript loops can arrive if editing code while bot is active. If you need to update values in index.vue you should first pause the bot. Make your changes. Then ctrl-r in the bot interface quickly after compilation.

## How to set up
First of all this will require having nodejs installed. https://nodejs.org/en/download/

On kucoin head over to api management and create an api key: https://www.kucoin.cc/account/api
You should only need the 'Trade' and 'General' options
You will need to copy 'key', 'secret' and 'password'.

Open src/pages/Index.vue
We'll start at line 88 (or search 'export default')

Fill in your api information from kucoin here:
kucoin: new ccxt.kucoin({
	// Required if run locally
	proxy: 'http://localhost:8181/',
	// Api credentials
	apiKey: '',
	secret: '',
	password: ''

Fill in these lines as appropiate. In my case I am trading kcs-usdt. If you want to trade, say, eth then change 'KCS' to 'ETH'.
symbol: 'KCS/USDT'
base: 'USDT'
coin: 'KCS'

Next we have these lines:
Trading amount is how much of the coin we want to be buying with each order.
baseThreshold should be the cost of a single order. So If kcs is $1 right now and I want to buy 25 my baseThreshold is 25.

tradingAmount: 25
baseThreshold: 120

Next, we need to craft our grid of orders. I personally use LibreOffice but you should be able to open the file in OpenOffice or Google Docs.
You probably format column A to match whatever decimal range your chose coin supports for best performance.

Red/Orange cells are your sell orders.
Green cells are your buy orders
The yellow cell in column A is your midpoint price.
The yellow cell in column B is your order distance as a decimal fraction. 1% = 0.01

To craft our grid we need to decide on a mid price and an order distance. Generally placing your midpoint at the spot price is fine. 
Keep in mind this price can be considered our entry price.

Next determine your order gap. If this is your first go at using a grid and this bot in general I reccomend using a 1-5% (0.01 - 0.05) order distance rate.
Once those are done the spreadsheet will update.
I like to max out kucoin with 200 orders So I look at A1 and A201 price values to define my range of orders. Since we won't have an order at the midpoint price we have an extra on the buy side.

Finally we have priceList. You will drop your list of orders from the ladder_template spreadsheet.
You will need to move the entire list to the correct tab distance as well as add a comma on each line (except the last line).
To avoid a long edit time I highly reccomend using a text editor that allows for block editing. In visual studio code this is alt-ctrl-shift-up/down arrow.

## How to use
Now that we've set up our values we can use this thing.
Easiest route is to visual studio code and open the folder for this code in it.
Otherwise, assuming this folder is open in windows file explorer you can hold shift and choose "open PowerShell window here".

Type:
npm install

This will install all dependancies

Type:
npm run dev-cors

This will compile everything and start running the bot.