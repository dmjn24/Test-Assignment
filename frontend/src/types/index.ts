export interface Currency {
    label: string;
    symbol: string;
}

export interface Price {
    amount: number;
    currency: Currency;
}

export interface AttributeItem {
    displayValue: string;
    value: string;
    id: string;
}

export interface AttributeSet {
    id: string;
    name: string;
    type: string;
    items: AttributeItem[];
}

export interface Product {
    id: string;
    name: string;
    inStock: boolean;
    gallery: string[];
    description: string;
    category: string;
    attributes: AttributeSet[];
    prices: Price[];
    brand: string;
}

export interface Category {
    name: string;
}

export interface CartItem extends Product {
    uid: string;
    quantity: number;
    selectedAttributes: Record<string, string>;
}
