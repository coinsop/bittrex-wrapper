import CryptoJS from 'crypto-js';
import querystring from 'querystring';
import request from '../helpers/request';

class Bittrex {
  /**
   * API Reference
   * Our APIs are broken into three distinct groups
   *  * Public - Public information available without an API key
   *  * Account - For managing your account
   *  * Market - For programatic trading of crypto currencies
   * $apikey='xxx';
   * $apisecret='xxx';
   * $nonce=time();
   * $uri='https://bittrex.com/api/v1.1/market/getopenorders?apikey='.$apikey.'&nonce='.$nonce;
   * $sign=hash_hmac('sha512',$uri,$apisecret);
   * $ch = curl_init($uri);
   * curl_setopt($ch, CURLOPT_HTTPHEADER, array('apisign:'.$sign));
   * $execResult = curl_exec($ch);
   * $obj = json_decode($execResult);
   */

  /**
   * Bittrex class constructor
   *
   * @param {any} apiKey - API key given by bittrex
   * @param {any} apiSecret - API secret given by bittrex
   * @param {string} [apiProtocol='https'] - Server protocol
   * @param {string} [apiHost='bittrex.com'] - Server hostname
   * @param {string} [apiVersion='v1.1'] - Bittrex API version
   *
   * @memberof Bittrex
   */
  constructor(apiKey, apiSecret, apiProtocol = 'https', apiHost = 'bittrex.com', apiVersion = 'v1.1') {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    if (!apiSecret) {
      throw new Error('API secret is required');
    }
    this.__lastNonce = null;
    this.__apiProtocol = apiProtocol;
    this.__apiHost = apiHost;
    this.__apiVersion = apiVersion;
    this.__apiKey = apiKey;
    this.__apiSecret = apiSecret;
    // Public API endpoints
    this.PUBLIC_GET_MARKETS = '/public/getmarkets';
    this.PUBLIC_GET_CURRENCIES = '/public/getcurrencies';
    this.PUBLIC_GET_TICKER = '/public/getticker';
    this.PUBLIC_GET_MARKET_SUMMARIES = '/public/getmarketsummaries';
    this.PUBLIC_GET_MARKET_SUMMARY = '/public/getmarketsummary';
    this.PUBLIC_GET_ORDER_BOOK = '/public/getorderbook';
    this.PUBLIC_GET_MARKET_HISTORY = '/public/getmarkethistory';
    // Market API endpoits
    this.MARKET_BUY_LIMIT = '/market/buylimit';
    this.MARKET_SELL_LIMIT = '/market/selllimit';
    this.MARKET_CANCEL = '/market/cancel';
    this.MARKET_GET_OPEN_ORDERS = '/market/getopenorders';
  }

  /**
   * Gets api sign
   *
   * @param {string} uri - uri to request
   * @returns {string} signature for headers
   *
   * @memberof Bittrex
   */
  getApiSign(uri) {
    const hash = CryptoJS.HmacSHA512(uri, this.__apiSecret);
    return hash.toString();
  }

  getNonce() {
    this.__lastNonce = Math.floor(new Date().getTime() / 1000);
    return this.__lastNonce;
  }

  /**
   * Makes direct http request to API
   *
   * @param {String} path - Main path for request
   * @param {Object} data - Data to send in the request
   * @returns {promise} server response
   *
   * @memberof Bittrex
   */
  doRequest(path, data) {
    return new Promise((resolve, reject) => {
      const _data = Object.assign(data || {}, {
        nonce: this.getNonce(),
        apikey: this.__apiKey
      });
      const _url = `${this.__apiProtocol}://${this.__apiHost}/api/${this.__apiVersion}${path}?${querystring.stringify(_data)}`;
      console.log(_url);
      const apisign = this.getApiSign(_url);
      request({
        method: 'GET',
        host: this.__apiHost,
        path: `/api/${this.__apiVersion}${path}`,
        headers: {
          apisign
        }
      }, _data).then(res => resolve(res)).catch(err => reject(err));
    });
  }

  /**
   * Used to get the open and available trading markets at Bittrex along with other meta data
   *
   * @returns Promise
   * @memberof Bittrex
   */
  publicGetMarkets() {
    return this.doRequest(this.PUBLIC_GET_MARKETS);
  }

  /**
   * Used to get all supported currencies at Bittrex along with other meta data
   *
   * @returns Promise
   * @memberof Bittrex
   */
  publicGetCurrencies() {
    return this.doRequest(this.PUBLIC_GET_CURRENCIES);
  }

  /**
   * Used to get the current tick values for a market
   *
   * @param {String} market - required a string literal for the market (ex: BTC-LTC)
   * @returns Promise
   * @memberof Bittrex
   */
  publicGetTicker(market) {
    if (!market) {
      throw new Error('Market is required');
    }
    return this.doRequest(this.PUBLIC_GET_TICKER, { market });
  }

  /**
   * Used to get the last 24 hour summary of all active exchanges
   *
   * @returns Promise
   * @memberof Bittrex
   */
  publicGetMarketSummaries() {
    return this.doRequest(this.PUBLIC_GET_MARKET_SUMMARIES);
  }

  /**
   * Used to get the last 24 hour summary of all active exchanges
   *
   * @param {String} market - required a string literal for the market (ex: BTC-LTC)
   * @returns Promise
   * @memberof Bittrex
   */
  publicGetMarketSummary(market) {
    if (!market) {
      throw new Error('Market is required');
    }
    return this.doRequest(this.PUBLIC_GET_MARKET_SUMMARY, { market });
  }

  /**
   * Used to get retrieve the orderbook for a given market
   *
   * @param {String} market - required a string literal for the market (ex: BTC-LTC)
   * @param {String} [type='both'] - required buy, sell or both type of orderbook to return
   * @param {Number} [depth=20] - optional defaults to 20 - Max is 50
   * @returns Promise
   * @memberof Bittrex
   */
  publicGetOrderBook(market, type = 'both', depth = 20) {
    if (!market) {
      throw new Error('Market is required');
    }
    return this.doRequest(this.PUBLIC_GET_ORDER_BOOK, { market, type, depth });
  }

  /**
   * Used to retrieve the latest trades that have occured for a specific market
   *
   * @param {String} market - market required a string literal for the market (ex: BTC-LTC)
   * @returns Promise
   * @memberof Bittrex
   */
  publicGetMarketHistory(market) {
    if (!market) {
      throw new Error('Market is required');
    }
    return this.doRequest(this.PUBLIC_GET_MARKET_HISTORY, { market });
  }

  /**
   * Market Apis
   * /market/buylimit
   * Used to place a buy order in a specific market.
   * Use buylimit to place limit orders.
   * Make sure you have the proper permissions set on your API keys for this call to work
   *
   * Parameters
   * parameter required description
   * market required a string literal for the market (ex: BTC-LTC)
   * quantity required the amount to purchase
   * rate required the rate at which to place the order.
   */
  marketBuyLimit(market, quantity, rate) {
    if (!market) {
      throw new Error('Market is required');
    }
    if (!quantity) {
      throw new Error('Quantity is required');
    }
    if (!rate) {
      throw new Error('Rate is required');
    }
    return this.doRequest(this.MARKET_BUY_LIMIT, { market, quantity, rate });
  }

  /**
   * /market/selllimit
   * Used to place an sell order in a specific market.
   * Use selllimit to place limit orders.
   * Make sure you have the proper permissions set on your API keys for this call to work
   *
   * Parameters
   * parameter required description
   * market required a string literal for the market (ex: BTC-LTC)
   * quantity required the amount to purchase
   * rate required the rate at which to place the order
   */
  marketSellLimit(market, quantity, rate) {
    if (!market) {
      throw new Error('Market is required');
    }
    if (!quantity) {
      throw new Error('Quantity is required');
    }
    if (!rate) {
      throw new Error('Rate is required');
    }
    return this.doRequest(this.MARKET_SELL_LIMIT, { market, quantity, rate });
  }

  /**
   * /market/cancel
   * Used to cancel a buy or sell order.
   *
   * Parameters
   * parameter required description
   * uuid required uuid of buy or sell order
   */
  marketCancel(uuid) {
    if (!uuid) {
      throw new Error('UUID is required');
    }
    return this.doRequest(this.MARKET_CANCEL, { uuid });
  }

  /**
   * /market/getopenorders
   * Get all orders that you currently have opened. A specific market can be requested
   * Parameters
   * parameter required description
   * market optional a string literal for the market (ie. BTC-LTC)
   */
  marketGetOpenOrders(market) {
    if (!market) {
      throw new Error('Market is required');
    }
    return this.doRequest(this.MARKET_GET_OPEN_ORDERS, { market });
  }

  /**
   *
   * Account Api
   * /account/getbalances
   * Used to retrieve all balances from your account
   *
   * Parameters
   * None
   *
   *
   * /account/getbalance
   * Used to retrieve the balance from your account for a specific currency.
   *
   * Parameters
   * parameter required description
   * currency required a string literal for the currency (ex: LTC)
   *
   * /account/getdepositaddress
   * Used to retrieve or generate an address for a specific currency.
   * If one does not exist, the call will fail and return ADDRESS_GENERATING until one is available.
   *
   * Parameters
   * parameter required description
   * currency required a string literal for the currency (ie. BTC)
   *
   * /account/withdraw
   * Used to withdraw funds from your account. note: please account for txfee.
   *
   * Parameters
   * parameter required description
   * currency required a string literal for the currency (ie. BTC)
   * quantity required the quantity of coins to withdraw
   * address required the address where to send the funds.
   * paymentid optional used for CryptoNotes/BitShareX/Nxt optional field (memo/paymentid)
   *
   * /account/getorder
   * Used to retrieve a single order by uuid.
   *
   * Parameters
   * parameter required description
   * uuid required the uuid of the buy or sell order
   *
   * /account/getorderhistory
   * Used to retrieve your order history.
   *
   * Parameters
   * parameter required description
   * market optional a string literal for the market (ie. BTC-LTC).
   * If ommited, will return for all markets
   *
   * /account/getwithdrawalhistory
   * Used to retrieve your withdrawal history.
   *
   * Parameters
   * parameter required description
   * currency optional a string literal for the currecy (ie. BTC).
   * If omitted, will return for all currencies
   *
   * /account/getdeposithistory
   * Used to retrieve your deposit history.
   *
   * Parameters
   * parameter required description
   * currency optional a string literal for the currecy (ie. BTC).
   * If omitted, will return for all currencies
   */
}

export default Bittrex;
