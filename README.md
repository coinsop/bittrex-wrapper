# Node (npm) API wrapper for Bittrex Exchange

This a library that interacts with the Bittrex Exchange API

## Installation

bittrex-wrapper is available from npm

```
npm install bittrex-wrapper
```

## Usage

### Getting Started

Include the module and create a new Bittrex object.

The parameters are optional and have the following values:

* api_key: (string) Your apps API KEY. Optional only needed for private methods
* api_secret: (string) Your apps API SECRET. Optional only needed for private methods


Example with API KEY and API SECRET for private and public methods:

```javascript
Bittrex = require('bittrex-wrapper');

const bittrex = new Bittrex('YOUR API KEY', 'YOUR API SECRET');
```
Example without API KEY and API SECRET for just public methods:

```javascript
const Bittrex = require('bittrex-wrapper');

const bittrex = new Bittrex();
```

Once you have the client you can do request to the API like this:

```javascript
const Bittrex = require('bittrex-wrapper');

const bittrex = new Bittrex('YOUR API KEY', 'YOUR API SECRET');

bittrex.publicGetTicker('BTC-LTC').then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});
```
All the methods always return a Promise.

If the result has no errors the result object will be:

```json
{
  "success" : true,
  "message" : "",
  "result" : {
    "Bid" : 2.05670368,
    "Ask" : 3.35579531,
    "Last" : 3.35579531
  }
}
```

If the result if false you will get success: false and the error in the message.

## How to obtain the API KEY and API SECRET

1. Login on your Bittrex account [https://bittrex.com/](https://bittrex.com/)
2. Go to Settings > API Keys
3. Click on Add New Key
4. Select the permission (on/off)
5. Put your Two factor authentication number and click on Update Keys
6. Copy your Key and Secret.

## CAUTION

**Depending on the permission that you give to your Keys you can make transactions and withdrawals with certains methods, always keep safe your KEYS, don't you put your Keys in the code. Use enviroment variables or other secure methods.**

**WE ARE NOT RESPONSABLE FOR THE WRONG USE OF THIS APPLICATION OR FOR ANY MALFUNCTION, BREACH OR ANY OTHER PROBLEM WITH THE BITTREX API.**

**YOU HAVE BEEN WARNED**

## Public methods

* publicGetMarkets - Used to get the open and available trading markets at Bittrex along with other meta data.
* publicGetCurrencies - Used to get all supported currencies at Bittrex along with other meta data.
* publicGetTicker(market) - Used to get the current tick values for a market.
  * market: (string) ex: BTC-LTC (required).
* publicGetMarketSummaries() - Used to get the last 24 hour summary of all active exchanges.
* publicGetMarketSummary(market) - Used to get the last 24 hour summary of all active exchanges.
  * market: (string) ex: BTC-LTC (required).
* publicGetOrderBook(market, type = 'both', depth = 20) - Used to get retrieve the orderbook for a given market
  *  market - required a string literal for the market (ex: BTC-LTC)
  * type='both' - required buy, sell or both type of orderbook to return
  * depth=20 - optional defaults to 20 - Max is 50
* publicGetMarketHistory(market) - Used to retrieve the latest trades that have occured for a specific market
  * market - market required a string literal for the market (ex: BTC-LTC)

## Private methods (API KEY and SECRET required)

* marketBuyLimit(market, quantity, rate) - Used to place a buy order in a specific market
  * market - required a string literal for the market (ex: BTC-LTC).
  * quantity - required the amount to purchase.
  * rate - required the rate at which to place the order.
* marketSellLimit(market, quantity, rate) - Used to place an sell order in a specific market
  * market - required a string literal for the market (ex: BTC-LTC).
  * quantity - required the amount to sell.
  * rate - required the rate at which to place the order.
* marketCancel(uuid) - Used to cancel a buy or sell order
  * uuid - required uuid of buy or sell order
* marketGetOpenOrders(market) - Get all orders that you currently have opened. A specific market can be requested.
  * market - optional a string literal for the market (ie. BTC-LTC)
* accountGetBalances() - Used to retrieve all balances from your account
* accountGetBalance(currency) - Used to retrieve the balance from your account for a specific currency
  * currency - required a string literal for the currency (ex: LTC)
* accountGetDepositAddress(currency) - Used to retrieve or generate an address for a specific currency. If one does not exist, the call will fail and return ADDRESS_GENERATING until one is available.
  * currency - required a string literal for the currency (ie. BTC)
* accountWithdraw(currency, quantity, address, paymentid = null) - Used to withdraw funds from your account. note: please account for txfee.
  * currency - required a string literal for the currency (ie. BTC)
  * quantity - required the quantity of coins to withdraw
  * address - required the address where to send the funds.
  * paymentid - optional used for CryptoNotes/BitShareX/Nxt
* accountGetOrder(uuid) - Used to retrieve a single order by uuid.
  * uuid - required the uuid of the buy or sell order
* accountGetOrderHistory(market) - Used to retrieve your order history.
  * market - optional a string literal for the market (ie. BTC-LTC).
* accountGetWithdrawalHistory(currency) - Used to retrieve your withdrawal history.
  * currency - optional a string literal for the currecy (ie. BTC).
* accountGetDepositHistory(currency) - Used to retrieve your deposit history.
  * currency - optional a string literal for the currecy (ie. BTC).

If you want more info about the methods here you can find the documentation on the Bittrex API documentation [here](https://bittrex.com/home/api).

## Contribute

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Issues or feature request

Open an issue on [Github](https://github.com/coinsop/bittrex-wrapper/issues)

## History

1.0.0: Added all methods public and private.

## Credits

- [Luis Fuenmayor](https://github.com/fuelusumar)
- [Olivers De Abreu](https://github.com/oliversd)

## License

This project is licensed under the [MIT License](https://github.com/coinsop/bittrex-wrapper/blob/master/LICENSE)
