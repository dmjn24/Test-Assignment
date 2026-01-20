import React from 'react';
import { useCart } from '../../context/CartContext';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '../../graphql/queries';

import Price from '../common/Price';


const CartOverlay: React.FC<{ close: () => void }> = ({ close }) => {
    const { cartItems, totalItems, totalAmount, updateQuantity, clearCart } = useCart();


    const [createOrder] = useMutation(CREATE_ORDER);


    const totalCurrencySymbol = cartItems.length > 0 ? cartItems[0].product.prices[0].currency.symbol : '$';
    const totalCurrencyLabel = cartItems.length > 0 ? cartItems[0].product.prices[0].currency.label : 'USD';

    const totalPriceObj = {
        amount: totalAmount,
        currency: { symbol: totalCurrencySymbol, label: totalCurrencyLabel }
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return;

        const itemsInput = cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            options: JSON.stringify(item.options)
        }));

        try {
            await createOrder({ variables: { items: itemsInput } });
            clearCart();
            close();
        } catch (e) {
            console.error(e);
            alert("Failed to place order");
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="font-bold text-base mb-8">
                My Bag, <span className="font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            </h3>

            <div className="flex flex-col gap-10 mb-8 overflow-y-auto pr-2">
                {cartItems.map((item, index) => {
                    const price = item.product.prices[0];

                    return (
                        <div key={`${item.id}-${index}`} className="flex justify-between items-stretch">

                            <div className="flex flex-col justify-between w-32">
                                <div className="mb-2">
                                    <p className="font-light text-base text-text-black">{item.product.name}</p>
                                    <Price price={price} className="font-bold text-base text-text-black mt-2 block" />
                                </div>


                                <div className="flex flex-col gap-2">
                                    {item.product.attributes.map((attr: any) => {
                                        const selectedVal = item.options[attr.id];
                                        const attrName = attr.name ? attr.name.trim().toLowerCase().replace(/ /g, '-') : 'attr';

                                        return (
                                            <div key={attr.id} className="text-sm" data-testid={`cart-item-attribute-${attrName}`}>
                                                <p className="mb-1 text-sm font-light">{attr.name}:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {attr.items.map((opt: any) => {
                                                        const isSelected = opt.id === selectedVal;
                                                        const optValue = opt.displayValue || opt.value || 'opt';
                                                        const testId = isSelected
                                                            ? `cart-item-attribute-${attrName}-${optValue}-selected`
                                                            : `cart-item-attribute-${attrName}-${optValue}`;

                                                        if (attr.type === 'swatch') {
                                                            return (
                                                                <div
                                                                    key={opt.id}
                                                                    className={`w-4 h-4 border cursor-default ${isSelected ? 'ring-1 ring-primary ring-offset-1' : 'border-gray-300'}`}
                                                                    style={{ backgroundColor: opt.value }}
                                                                    title={opt.displayValue}
                                                                    data-testid={testId}
                                                                />
                                                            );
                                                        }
                                                        return (
                                                            <div
                                                                key={opt.id}
                                                                className={`min-w-[24px] h-6 px-1 border text-sm flex items-center justify-center cursor-default ${isSelected ? 'bg-white border-black' : 'bg-white border-gray-200 text-gray-500'}`}
                                                                style={isSelected ? { borderWidth: '1px' } : {}}
                                                                data-testid={testId}
                                                            >
                                                                {opt.value}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>


                            <div className="flex gap-3">
                                <div className="flex flex-col justify-between items-center">
                                    <button
                                        className="w-6 h-6 border border-black flex items-center justify-center text-lg hover:bg-gray-100"
                                        onClick={() => updateQuantity(item.id, item.options, 1)}
                                        data-testid="cart-item-amount-increase"
                                    >+</button>
                                    <span className="font-medium" data-testid="cart-item-amount">{item.quantity}</span>
                                    <button
                                        className="w-6 h-6 border border-black flex items-center justify-center text-lg hover:bg-gray-100"
                                        onClick={() => updateQuantity(item.id, item.options, -1)}
                                        data-testid="cart-item-amount-decrease"
                                    >-</button>
                                </div>
                                <div className="w-24 h-full relative">
                                    <img
                                        src={item.product.gallery[0]}
                                        alt={item.product.name}
                                        className="object-contain w-full h-full bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-auto">
                <div className="flex justify-between font-bold mb-8">
                    <span>Total</span>
                    <Price price={totalPriceObj} data-testid="cart-total" />
                </div>

                <button
                    className={`w-full py-3 text-white text-sm font-semibold uppercase ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600'}`}
                    disabled={cartItems.length === 0}
                    onClick={handlePlaceOrder}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default CartOverlay;
