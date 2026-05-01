import {expect} from 'chai';
import {describe, it} from 'mocha';
import {redenomination} from '../src/redenomination'

const normalize = (s: string | null): string => (s ?? '').replace(/\s+/g, ' ').trim();

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

describe('redenomination formatter (opt-in)', () => {
    it('should not expose format() when format config absent', () => {
        const redenom = redenomination({ factor: 1000 });
        expect((redenom as any).format).to.equal(undefined);
    })

    it('should expose format() when format config is set', () => {
        const redenom = redenomination({
            factor: 1000,
            format: {}
        });
        expect(redenom.format).to.be.a('function');
    })

    it('should format with default id-ID + IDR', () => {
        const redenom = redenomination({
            factor: 1000,
            rounding: 0,
            format: {}
        });
        const result = normalize(redenom.format(1500000));
        expect(result).to.include('Rp');
        expect(result).to.include('1.500');
    })

    it('should format with USD + en-US', () => {
        const redenom = redenomination({
            factor: 1000,
            rounding: 2,
            format: { locale: 'en-US', currency: 'USD' }
        });
        const result = normalize(redenom.format(1500000));
        expect(result).to.include('$');
        expect(result).to.include('1,500.00');
    })

    it('should format with EUR + de-DE', () => {
        const redenom = redenomination({
            factor: 1000,
            rounding: 2,
            format: { locale: 'de-DE', currency: 'EUR' }
        });
        const result = normalize(redenom.format(1500000));
        expect(result).to.include('€');
        expect(result).to.include('1.500,00');
    })

    it('should format with JPY + ja-JP (zero decimals)', () => {
        const redenom = redenomination({
            factor: 1000,
            rounding: 0,
            format: { locale: 'ja-JP', currency: 'JPY' }
        });
        const result = normalize(redenom.format(1500000));
        expect(result).to.match(/[¥￥]/);
        expect(result).to.include('1,500');
    })

    it('should format mode "old" without conversion', () => {
        const redenom = redenomination({
            factor: 1000,
            rounding: 0,
            format: { mode: 'old' }
        });
        const result = normalize(redenom.format(1500000));
        expect(result).to.include('Rp');
        expect(result).to.include('1.500.000');
    })

    it('should format mode "both" as tuple [new, old]', () => {
        const redenom = redenomination({
            factor: 1000,
            rounding: 0,
            format: { mode: 'both' }
        });
        const result = redenom.format(1500000);
        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
        const [new_str, old_str] = result as [string, string];
        expect(normalize(new_str)).to.include('1.500');
        expect(normalize(new_str)).to.not.include('1.500.000');
        expect(normalize(old_str)).to.include('1.500.000');
    })

    it('should return null in mode "both" for null input', () => {
        const redenom = redenomination({
            factor: 1000,
            format: { mode: 'both' }
        });
        expect(redenom.format(null)).to.equal(null);
        expect(redenom.format(undefined)).to.equal(null);
    })

    it('should override symbol when provided', () => {
        const redenom = redenomination({
            factor: 1000,
            rounding: 0,
            format: { symbol: 'Rp(baru)' }
        });
        const result = normalize(redenom.format(1500000));
        expect(result.startsWith('Rp(baru)')).to.equal(true);
        expect(result).to.include('1.500');
    })

    it('should return null for null/undefined input', () => {
        const redenom = redenomination({
            factor: 1000,
            format: {}
        });
        expect(redenom.format(null)).to.equal(null);
        expect(redenom.format(undefined)).to.equal(null);
    })

    it('should respect rounding in format output', () => {
        const redenom = redenomination({
            factor: 1000,
            rounding: 2,
            format: { locale: 'en-US', currency: 'USD' }
        });
        const result = normalize(redenom.format(1500490));
        expect(result).to.include('1,500.49');
    })

    it('should pass through value when disabled', () => {
        const redenom = redenomination({
            factor: 1000,
            rounding: 0,
            enable: false,
            format: {}
        });
        const result = normalize(redenom.format(1500000));
        expect(result).to.include('1.500.000');
    })
})
