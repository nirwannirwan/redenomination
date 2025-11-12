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

### License

[MIT](https://github.com/nirwannirwan/redenomination/blob/main/LICENSE.txt)

### Acknowledgements

- Inspired by Indonesian currency redenomination discussions.