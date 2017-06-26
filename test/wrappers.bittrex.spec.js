import { expect } from 'chai';
import Bittrex from '../src/wrappers/Bittrex';

require('dotenv').config();

const market = 'BTC-DGB';
const currency = 'BTC';
const quantityBuy = '1000';
const rateBuy = '0.000008';
const quantitySell = '1000';
const rateSell = '0.1';
const bittrex = new Bittrex(process.env.BITTREX_API_KEY, process.env.BITTREX_API_SECRET);

describe('### Make bittrex API requets', () => {
  describe('## Public API', () => {
    it('Should request publicGetMarkets path', (done) => {
      bittrex.publicGetMarkets().then((res) => {
        // console.log(res);
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('array');
        expect(res.result.length).to.be.above(0);
        done();
      }).catch((err) => {
        // console.log(err);
        done(err);
      });
    });
    it('Should request publicGetCurrencies path', (done) => {
      bittrex.publicGetCurrencies().then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('array');
        expect(res.result.length).to.be.above(0);
        done();
      }).catch((err) => {
        // console.log(err);
        done(err);
      });
    });
    it('Should request publicGetTicker path', (done) => {
      bittrex.publicGetTicker(market).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('object');
        expect(res.result.Bid).to.be.above(0);
        expect(res.result.Ask).to.be.above(0);
        expect(res.result.Last).to.be.above(0);
        done();
      }).catch((err) => {
        // console.log(err);
        done(err);
      });
    });
    it('Should request publicGetMarketSummaries path', (done) => {
      bittrex.publicGetMarketSummaries().then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('array');
        expect(res.result.length).to.be.above(0);
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request publicGetMarketSummary path', (done) => {
      bittrex.publicGetMarketSummary(market).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('array');
        expect(res.result.length).to.be.equal(1);
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request publicGetOrderBook path', (done) => {
      bittrex.publicGetOrderBook(market).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('object');
        expect(res.result.buy).to.be.an('array');
        expect(res.result.sell).to.be.an('array');
        expect(res.result.buy.length).to.be.above(0);
        expect(res.result.sell.length).to.be.above(0);
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request publicGetMarketHistory path', (done) => {
      bittrex.publicGetMarketHistory(market).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('array');
        expect(res.result.length).to.be.above(0);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('## Market API', () => {
    it('Should request marketBuyLimit and marketCancel paths', (done) => {
      bittrex.marketBuyLimit(market, quantityBuy, rateBuy).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('object');
        expect(res.result.uuid).to.be.a('string');
        bittrex.marketCancel(res.result.uuid).then((_res) => {
          expect(_res.success).to.be.equal(true);
          done();
        }).catch((err) => {
          done(err);
        });
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request marketSellLimit and marketCancel paths', (done) => {
      bittrex.marketSellLimit(market, quantitySell, rateSell).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('object');
        expect(res.result.uuid).to.be.a('string');
        bittrex.marketCancel(res.result.uuid).then((_res) => {
          expect(_res.success).to.be.equal(true);
          done();
        }).catch((err) => {
          done(err);
        });
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request marketGetOpenOrders path', (done) => {
      bittrex.marketGetOpenOrders(market).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('array');
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('## Account API', () => {
    it('Should request accountGetBalances path', (done) => {
      bittrex.accountGetBalances().then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('array');
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request accountGetBalance path', (done) => {
      bittrex.accountGetBalance(currency).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('object');
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request accountGetDepositAddress path', (done) => {
      bittrex.accountGetDepositAddress(currency).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('object');
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request marketSellLimit and accountGetOrder paths', (done) => {
      bittrex.marketSellLimit(market, quantitySell, rateSell).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('object');
        expect(res.result.uuid).to.be.a('string');
        bittrex.accountGetOrder(res.result.uuid).then((_res) => {
          expect(_res.success).to.be.equal(true);
          expect(res.result).to.be.an('object');
          done();
        }).catch((err) => {
          done(err);
        });
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request accountGetOrderHistory path', (done) => {
      bittrex.accountGetOrderHistory(market).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('array');
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request accountGetWithdrawalHistory path', (done) => {
      bittrex.accountGetWithdrawalHistory(currency).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('array');
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('Should request accountGetDepositHistory path', (done) => {
      bittrex.accountGetDepositHistory(currency).then((res) => {
        expect(res.success).to.be.equal(true);
        expect(res.result).to.be.an('array');
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});
