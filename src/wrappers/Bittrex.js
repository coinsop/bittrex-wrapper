import crypto from 'crypto';
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
    this.__apiProtocol = apiProtocol;
    this.__apiHost = apiHost;
    this.__apiVersion = apiVersion;
    this.__apiKey = apiKey;
    this.__apiSecret = apiSecret;
  }

  /**
   * Completes path for request
   *
   * @param {string} req - Main path for request
   * @returns {string} path
   *
   * @memberof Bittrex
   */
  getPath(req) {
    return `${req}?apikey=${this.__apiKey}&nonce=${new Date().getTime()}`;
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
    hmac.update(uri);
    return hmac.digest('hex');
  }

  /**
   * Makes direct http request to API
   *
   * @param {string} req - Main path for request
   * @returns {promise} server response
   *
   * @memberof Bittrex
   */
  doRequest(req) {
    return new Promise((resolve, reject) => {
      const _path = `/api/${this.__apiVersion}${this.getPath(req)}`;
      const _url = `${this.__apiProtocol}://${this.__apiHost}${_path}`;
      const apisign = this.getApiSign(_url);
      request(this.__apiProtocol, {
        method: 'GET',
        host: this.__apiHost,
        path: `/api/${this.__apiVersion}${this.getPath(req)}`,
        headers: {
          apisign
        }
      }).then(res => resolve(res)).catch(err => reject(err));
    });
  }

  /**
   * Public Api
   * /public/getmarkets
   * Used to get the open and available trading markets at Bittrex along with other meta data.
   *
   * /public/getcurrencies
   * Used to get all supported currencies at Bittrex along with other meta data.
   *
   * /public/getticker
   * Used to get the current tick values for a market.
   *
   * Parameters
   * parameter required description
   * market required a string literal for the market (ex: BTC-LTC)
   *
   * /public/getmarketsummaries
   * Used to get the last 24 hour summary of all active exchanges
   *
   * /public/getmarketsummary
   * Used to get the last 24 hour summary of all active exchanges
   *
   * Parameters
   * parameter required description
   * market required a string literal for the market (ex: BTC-LTC)
   *
   * /public/getorderbook
   * Used to get retrieve the orderbook for a given market
   *
   * Parameters
   * parameter required description
   * market required a string literal for the market (ex: BTC-LTC)
   * type required buy, sell or both to identify the type of orderbook to return.
   * depth optional defaults to 20 - how deep of an order book to retrieve. Max is 50
   *
   * /public/getmarkethistory
   * Used to retrieve the latest trades that have occured for a specific market.
   *
   * Parameters
   * parameter required description
   * market required a string literal for the market (ex: BTC-LTC)
   *
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
   *
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
   *
   * /market/cancel
   * Used to cancel a buy or sell order.
   *
   * Parameters
   * parameter required description
   * uuid required uuid of buy or sell order
   *
   * /market/getopenorders
   * Get all orders that you currently have opened. A specific market can be requested
   * Parameters
   * parameter required description
   * market optional a string literal for the market (ie. BTC-LTC)
   *
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
