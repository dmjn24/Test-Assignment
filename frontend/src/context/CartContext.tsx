import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    quantity: number;
    options: Record<string, string>;

    product: any;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: any, options: Record<string, string>) => void;
    removeFromCart: (productId: string, options: Record<string, string>) => void;
    updateQuantity: (productId: string, options: Record<string, string>, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const areOptionsEqual = (opts1: Record<string, string>, opts2: Record<string, string>) => {
        const keys1 = Object.keys(opts1);
        const keys2 = Object.keys(opts2);
        if (keys1.length !== keys2.length) return false;
        return keys1.every(key => opts1[key] === opts2[key]);
    };

    const addToCart = (product: any, options: Record<string, string>) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id && areOptionsEqual(item.options, options));
            if (existing) {
                return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { id: product.id, quantity: 1, options, product }];
        });
    };

    const removeFromCart = (productId: string, options: Record<string, string>) => {
        setCartItems(prev => prev.filter(item => !(item.id === productId && areOptionsEqual(item.options, options))));
    };

    const updateQuantity = (productId: string, options: Record<string, string>, delta: number) => {
        setCartItems(prev => {
            return prev.map(item => {
                if (item.id === productId && areOptionsEqual(item.options, options)) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter((item): item is CartItem => item !== null);
        });
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const totalAmount = cartItems.reduce((sum, item) => {

        const price = item.product.prices[0].amount;
        return sum + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
