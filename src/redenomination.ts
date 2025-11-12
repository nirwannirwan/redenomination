export interface RedenominationOptions {
    factor?: number;
    enable?: boolean;
    rounding?: number;
}

export function redenomination(config?:RedenominationOptions) {
    const factor = config?.factor ?? 1000;
    const enable = config?.enable ?? true;
    const rounding = config?.rounding ?? 2;

    const round_number = (val: number): number => {
        const multiplier = Math.pow(10, rounding);
        return Math.round(val * multiplier) / multiplier;
    }

    const to_new = (val: number | null | undefined): number | null => {
        if (!enable || val == null) return val ?? null;
        const new_value = val / factor;
        return round_number(new_value)
    }

    const to_old = (val:number | null | undefined): number | null => {
        if (!enable || val == null) return val ?? null;
        const old_value = val * factor;
        return Math.round(old_value);
    }

    return {
        to_new,
        to_old,
    };
}