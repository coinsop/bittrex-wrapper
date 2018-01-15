import crypto from 'crypto';
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
  constructor(
    apiKey = null,
    apiSecret = null,
    apiProtocol = 'https',
    apiHost = 'bittrex.com',
    apiVersion = 'v1.1'
  ) {
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
    // Account API
    this.ACCOUNT_GET_BALANCES = '/account/getbalances';
    this.ACCOUNT_GET_BALANCE = '/account/getbalance';
    this.ACCOUNT_GET_DEPOSIT_ADDRESS = '/account/getdepositaddress';
    this.ACCOUNT_WITHDRAW = '/account/withdraw';
    this.ACCOUNT_GET_ORDER = '/account/getorder';
    this.ACCOUNT_GET_ORDER_HISTORY = '/account/getorderhistory';
    this.ACCOUNT_GET_WITHDRAWAL_HISTORY = '/account/getwithdrawalhistory';
    this.ACCOUNT_GET_DEPOSIT_HISTORY = '/account/getdeposithistory';
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
    const hmac = crypto.createHmac('sha512', this.__apiSecret);
    const signed = hmac.update(new Buffer(uri, 'utf-8')).digest('hex');
    return signed;
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
      const _data = Object.assign(
        data || {},
        this.__apiKey && this.__apiSecret
          ? {
            nonce: this.getNonce(),
            apikey: this.__apiKey
          }
          : {}
      );
      const _url = `${this.__apiProtocol}://${this.__apiHost}/api/${
        this.__apiVersion
      }${path}?${querystring.stringify(_data)}`;
      const apisign = this.__apiKey && this.__apiSecret ? this.getApiSign(_url) : null;
      request(
        {
          method: 'GET',
          host: this.__apiHost,
          path: `/api/${this.__apiVersion}${path}`,
          headers: apisign
            ? {
              apisign,
              'Content-Type': 'application/json'
            }
            : { 'Content-Type': 'application/json' }
        },
        _data
      )
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  /**
   * Public API
   */

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
      return Promise.reject(new Error('Market is required'));
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
      return Promise.reject(new Error('Market is required'));
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
      return Promise.reject(new Error('Market is required'));
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
      return Promise.reject(new Error('Market is required'));
    }
    return this.doRequest(this.PUBLIC_GET_MARKET_HISTORY, { market });
  }

  /**
   * Market API
   */

  /**
   * Used to place a buy order in a specific market
   *
   * @param {String} market - required a string literal for the market (ex: BTC-LTC)
   * @param {String} quantity - required the amount to purchase
   * @param {String} rate - required the rate at which to place the order
   * @returns Promise
   * @memberof Bittrex
   */
  marketBuyLimit(market, quantity, rate) {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for market requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for market requests'));
    }
    if (!market) {
      return Promise.reject(new Error('Market is required'));
    }
    if (!quantity) {
      return Promise.reject(new Error('Quantity is required'));
    }
    if (!rate) {
      return Promise.reject(new Error('Rate is required'));
    }
    return this.doRequest(this.MARKET_BUY_LIMIT, { market, quantity, rate });
  }

  /**
   * Used to place an sell order in a specific market
   *
   * @param {String} market - required a string literal for the market (ex: BTC-LTC)
   * @param {String} quantity - required the amount to purchase
   * @param {String} rate - required the rate at which to place the order
   * @returns Promise
   * @memberof Bittrex
   */
  marketSellLimit(market, quantity, rate) {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for market requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for market requests'));
    }
    if (!market) {
      return Promise.reject(new Error('Market is required'));
    }
    if (!quantity) {
      return Promise.reject(new Error('Quantity is required'));
    }
    if (!rate) {
      return Promise.reject(new Error('Rate is required'));
    }
    return this.doRequest(this.MARKET_SELL_LIMIT, { market, quantity, rate });
  }

  /**
   * Used to cancel a buy or sell order
   *
   * @param {String} uuid - required uuid of buy or sell order
   * @returns Promise
   * @memberof Bittrex
   */
  marketCancel(uuid) {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for market requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for market requests'));
    }
    if (!uuid) {
      return Promise.reject(new Error('UUID is required'));
    }
    return this.doRequest(this.MARKET_CANCEL, { uuid });
  }

  /**
   * Get all orders that you currently have opened. A specific market can be requested
   *
   * @param {String} market - optional a string literal for the market (ie. BTC-LTC)
   * @returns Promise
   * @memberof Bittrex
   */
  marketGetOpenOrders(market = '') {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for market requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for market requests'));
    }
    return this.doRequest(this.MARKET_GET_OPEN_ORDERS, { market });
  }

  /**
   * Account API
   */

  /**
   * Used to retrieve all balances from your account
   *
   * @returns Promise
   * @memberof Bittrex
   */
  accountGetBalances() {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for account requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for account requests'));
    }
    return this.doRequest(this.ACCOUNT_GET_BALANCES);
  }

  /**
   * Used to retrieve the balance from your account for a specific currency
   *
   * @param {String} currency - required a string literal for the currency (ex: LTC)
   * @returns Promise
   * @memberof Bittrex
   */
  accountGetBalance(currency) {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for account requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for account requests'));
    }
    if (!currency) {
      return Promise.reject(new Error('Currency is required'));
    }
    return this.doRequest(this.ACCOUNT_GET_BALANCE, { currency });
  }

  /**
   * Used to retrieve or generate an address for a specific currency
   * If one does not exist, the call will fail and return ADDRESS_GENERATING until one is available
   *
   * @param {String} currency - required a string literal for the currency (ie. BTC)
   * @returns Promise
   * @memberof Bittrex
   */
  accountGetDepositAddress(currency) {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for account requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for account requests'));
    }
    if (!currency) {
      return Promise.reject(new Error('Currency is required'));
    }
    return this.doRequest(this.ACCOUNT_GET_DEPOSIT_ADDRESS, { currency });
  }

  /**
   * Used to withdraw funds from your account. note: please account for txfee.
   *
   * @param {String} currency - required a string literal for the currency (ie. BTC)
   * @param {String} quantity - required the quantity of coins to withdraw
   * @param {String} address - required the address where to send the funds.
   * @param {String} paymentid - optional used for CryptoNotes/BitShareX/Nxt
   * @returns Promise
   * @memberof Bittrex
   */
  accountWithdraw(currency, quantity, address, paymentid = null) {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for account requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for account requests'));
    }
    if (!currency) {
      return Promise.reject(new Error('Currency is required'));
    }
    if (!quantity) {
      return Promise.reject(new Error('Quantity is required'));
    }
    if (!address) {
      return Promise.reject(new Error('Address is required'));
    }

    const data = { currency, quantity, address };
    if (paymentid !== null) {
      Object.assign(data, paymentid);
    }

    return this.doRequest(this.ACCOUNT_WITHDRAW, data);
  }

  /**
   * Used to retrieve a single order by uuid.
   *
   * @param {String} uuid - required the uuid of the buy or sell order
   * @returns Promise
   * @memberof Bittrex
   */
  accountGetOrder(uuid) {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for account requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for account requests'));
    }
    if (!uuid) {
      return Promise.reject(new Error('UUID is required'));
    }
    return this.doRequest(this.ACCOUNT_GET_ORDER, { uuid });
  }

  /**
   * Used to retrieve your order history.
   *
   * @param {String} market - optional a string literal for the market (ie. BTC-LTC).
   * @returns Promise
   * @memberof Bittrex
   */
  accountGetOrderHistory(market) {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for account requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for account requests'));
    }
    return this.doRequest(this.ACCOUNT_GET_ORDER_HISTORY, { market });
  }

  /**
   * Used to retrieve your withdrawal history.
   *
   * @param {String} currency - optional a string literal for the currecy (ie. BTC)
   * @returns Promise
   * @memberof Bittrex
   */
  accountGetWithdrawalHistory(currency) {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for account requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for account requests'));
    }
    return this.doRequest(this.ACCOUNT_GET_WITHDRAWAL_HISTORY, { currency });
  }

  /**
   * Used to retrieve your deposit history.
   *
   * @param {String} currency - optional a string literal for the currecy (ie. BTC).
   * @returns Promise
   * @memberof Bittrex
   */
  accountGetDepositHistory(currency) {
    if (!this.__apiKey) {
      return Promise.reject(new Error('API key is required for account requests'));
    }
    if (!this.__apiSecret) {
      return Promise.reject(new Error('API secret is required for account requests'));
    }
    return this.doRequest(this.ACCOUNT_GET_DEPOSIT_HISTORY, { currency });
  }
}

module.exports = Bittrex;
