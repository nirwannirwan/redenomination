export type FormatMode = 'new' | 'old' | 'both';

export interface FormatOptions {
    locale?: string;
    currency?: string;
    symbol?: string;
    mode?: FormatMode;
}

export interface RedenominationOptions {
    factor?: number;
    enable?: boolean;
    rounding?: number;
    format?: FormatOptions;
}

export interface BaseRedenomination {
    to_new: (val: number | null | undefined) => number | null;
    to_old: (val: number | null | undefined) => number | null;
}

export interface FormattedRedenomination extends BaseRedenomination {
    format: (val: number | null | undefined) => string | null;
}

export interface FormattedBothRedenomination extends BaseRedenomination {
    format: (val: number | null | undefined) => [string, string] | null;
}

export function redenomination(
    config: RedenominationOptions & { format: FormatOptions & { mode: 'both' } }
): FormattedBothRedenomination;
export function redenomination(
    config: RedenominationOptions & { format: FormatOptions }
): FormattedRedenomination;
export function redenomination(config?: RedenominationOptions): BaseRedenomination;
export function redenomination(
    config?: RedenominationOptions
): BaseRedenomination | FormattedRedenomination | FormattedBothRedenomination {
    const factor = config?.factor ?? 1000;
    const enable = config?.enable ?? true;
    const rounding = config?.rounding ?? 2;

    const round_number = (val: number): number => {
        const multiplier = Math.pow(10, rounding);
        return Math.round(val * multiplier) / multiplier;
    };

    const to_new = (val: number | null | undefined): number | null => {
        if (!enable || val == null) return val ?? null;
        return round_number(val / factor);
    };

    const to_old = (val: number | null | undefined): number | null => {
        if (!enable || val == null) return val ?? null;
        return Math.round(val * factor);
    };

    const base: BaseRedenomination = { to_new, to_old };

    if (!config?.format) return base;

    const fmt = config.format;
    const locale = fmt.locale ?? 'id-ID';
    const currency = fmt.currency ?? 'IDR';
    const symbol = fmt.symbol;
    const mode: FormatMode = fmt.mode ?? 'new';

    const make_formatter = (fraction_digits: number): Intl.NumberFormat =>
        new Intl.NumberFormat(locale, {
            style: symbol ? 'decimal' : 'currency',
            currency: symbol ? undefined : currency,
            minimumFractionDigits: fraction_digits,
            maximumFractionDigits: fraction_digits,
        });

    const apply_symbol = (formatted: string): string =>
        symbol ? `${symbol} ${formatted}` : formatted;

    const format_new = (val: number): string => {
        const new_val = enable ? round_number(val / factor) : val;
        return apply_symbol(make_formatter(rounding).format(new_val));
    };

    const format_old = (val: number): string =>
        apply_symbol(make_formatter(0).format(val));

    if (mode === 'both') {
        const format = (val: number | null | undefined): [string, string] | null => {
            if (val == null) return null;
            return [format_new(val), format_old(val)];
        };
        return { ...base, format };
    }

    const format = (val: number | null | undefined): string | null => {
        if (val == null) return null;
        return mode === 'old' ? format_old(val) : format_new(val);
    };
    return { ...base, format };
}
