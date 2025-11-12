import {expect} from 'chai';
import {describe, it} from 'mocha';
import {redenomination} from '../src/redenomination'

describe('redenomination helper', () => {
    const redenom = redenomination({
        factor: 1000,
        rounding:0,
        enable:true
    })

    it('should redenominate value correctly', () => {
        const result = redenom.to_new(1500000);
        expect(result).to.equal(1500);
    })

    it('should revert redenomination correctly', () => {
        const result = redenom.to_old(1500);
        expect(result).to.equal(1500000);
    })

    const redenom_rounding = redenomination({
        factor: 1000,
        rounding:2,
        enable:true
    })


    it('should redenominate value with rounding correctly', () => {
        const result = redenom_rounding.to_new(1500490);
        expect(result).to.equal(1500.49);
    })


    it('should revert redenomination with rounding correctly', () => {
        const result = redenom_rounding.to_old(1500.49);
        expect(result).to.equal(1500490);
    })

    it('should handle zero correctly', () => {
        const resultNew = redenom.to_new(0);
        const resultOld = redenom.to_old(0);
        expect(resultNew).to.equal(0);
        expect(resultOld).to.equal(0);
    })

    it('should not redenominate when disabled', () => {
        const redenomDisabled = redenomination({
            factor: 1000,
            rounding:0,
            enable:false
        });
        const resultNew = redenomDisabled.to_new(1500000);
        const resultOld = redenomDisabled.to_old(1500);
        expect(resultNew).to.equal(1500000);
        expect(resultOld).to.equal(1500);
    })
})