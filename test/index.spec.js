import { expect } from 'chai';
import Bittrex from '../src';

require('dotenv').config();

const bittrex = new Bittrex(process.env.BITTREX_API_KEY, process.env.BITTREX_API_KEY);

describe('### Import module', () => {
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
  });
});
