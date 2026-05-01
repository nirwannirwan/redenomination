### ***redenomination***

A simple utility library to handle redenomination numbers.

### Installation

```bash
npm install redenomination
```

### Usage

```typescript
import { redenomination } from 'redenomination';

const redenom = redenomination({
    factor: 1000,      // Redenomination factor
    rounding: 2,      // Number of decimal places to round to
    enable: true      // Enable or disable redenomination
});

const newValue = redenom.to_new(1500000); // Converts to new denomination
console.log(newValue); // Outputs: 1500

const oldValue = redenom.to_old(1500); // Converts back to old denomination
console.log(oldValue); // Outputs: 1500000
```

### Options

- `factor`: The factor by which to redenominate the numbers.
- `rounding`: The number of decimal places to round the result to.
- `enable`: A boolean to enable or disable the redenomination functionality.
- `format`: Optional. When set, exposes a `format()` method that returns a localized currency string. See below.

### Formatter (opt-in)

The formatter is **opt-in** — it only appears when you pass a `format` config. Users who only need number-to-number redenomination won't see it in autocomplete and won't pay for any extra logic.

```typescript
const redenom = redenomination({
    factor: 1000,
    rounding: 2,
    format: {
        locale: 'id-ID',   // any BCP 47 locale tag
        currency: 'IDR'    // any ISO 4217 currency code
    }
});

redenom.format(1500000);  // "Rp 1.500,00"
redenom.to_new(1500000);  // 1500   (still works)
redenom.to_old(1500);     // 1500000
```

#### Multiple currencies

The formatter uses the platform's `Intl.NumberFormat`, so it supports any locale and currency:

```typescript
redenomination({ factor: 1000, format: { locale: 'en-US', currency: 'USD' } })
    .format(1500000); // "$1,500.00"

redenomination({ factor: 1000, format: { locale: 'de-DE', currency: 'EUR' } })
    .format(1500000); // "1.500,00 €"

redenomination({ factor: 1000, rounding: 0, format: { locale: 'ja-JP', currency: 'JPY' } })
    .format(1500000); // "￥1,500"
```

#### Display modes

Use `mode` to control which value is returned. Mode `'both'` returns a tuple so callers can format/label the two values however their UI requires (no hardcoded language):

```typescript
const redenom = redenomination({
    factor: 1000,
    rounding: 0,
    format: { mode: 'both' }
});

const [newStr, oldStr] = redenom.format(1500000)!;
// newStr → "Rp 1.500"
// oldStr → "Rp 1.500.000"
```

| Mode     | Return type        | Description                            |
| -------- | ------------------ | -------------------------------------- |
| `'new'`  | `string \| null`   | New denomination only (default)        |
| `'old'`  | `string \| null`   | Original value only, no conversion     |
| `'both'` | `[string, string] \| null` | `[new, old]` tuple             |

The TypeScript return type narrows automatically based on the `mode` literal you pass.

#### Custom symbol override

Override the locale's currency symbol — handy for marking transitional currency:

```typescript
redenomination({
    factor: 1000,
    rounding: 0,
    format: { symbol: 'Rp(baru)' }
}).format(1500000);
// "Rp(baru) 1.500"
```

When `symbol` is set, the symbol is always prepended (locale-specific positioning is bypassed).

### Format options

| Option     | Type     | Default   | Description                                |
| ---------- | -------- | --------- | ------------------------------------------ |
| `locale`   | string   | `'id-ID'` | BCP 47 locale tag                          |
| `currency` | string   | `'IDR'`   | ISO 4217 currency code                     |
| `symbol`   | string   | —         | Override the auto-detected currency symbol |
| `mode`     | string   | `'new'`   | `'new'`, `'old'`, or `'both'`              |

### License

[MIT](https://github.com/nirwannirwan/redenomination/blob/main/LICENSE.txt)

### Acknowledgements

- Inspired by Indonesian currency redenomination discussions.
