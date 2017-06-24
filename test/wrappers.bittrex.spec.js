import { expect } from 'chai';
import Bittrex from '../src/wrappers/Bittrex';

require('dotenv').config();

const market = 'BTC-LTC';
const bittrex = new Bittrex(process.env.BITTREX_API_KEY, process.env.BITTREX_API_KEY);

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
});
