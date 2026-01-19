import React from 'react';
import type { Price as PriceType } from '../../types';

interface PriceProps {
    price?: PriceType;
    className?: string;
    'data-testid'?: string;
}

const Price: React.FC<PriceProps> = ({ price, className = "", 'data-testid': testId }) => {
    if (!price) return null;

    const symbol = price.currency.symbol;
    const amount = price.amount.toFixed(2);

    return (
        <span className={`font-medium ${className}`} data-testid={testId}>
            {symbol}{amount}
        </span>
    );
};

export default Price;
