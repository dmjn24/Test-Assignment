import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import type { Product, AttributeSet } from '../../types';
import Price from '../common/Price';


const getDefaultOptions = (attributes: Product['attributes']) => {
    const options: Record<string, string> = {};
    attributes.forEach((attr: AttributeSet) => {
        if (attr.items.length > 0) {
            options[attr.id] = attr.items[0].id;
        }
    });
    return options;
};

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    const handleQuickShop = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product.inStock) return;
        const defaultOptions = getDefaultOptions(product.attributes);
        addToCart(product, defaultOptions);
    };

    return (
        <div
            className={`p-4 group relative hover:shadow-lg transition-shadow duration-300 ${!product.inStock ? 'opacity-50' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-testid={`product-${product.name.toLowerCase().replace(/ /g, '-')}`}
        >
            <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden mb-4">
                <img
                    src={product.gallery[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                        <span className="text-2xl font-medium text-gray-500 uppercase tracking-wide">Out of Stock</span>
                    </div>
                )}
                {product.inStock && isHovered && (
                    <button
                        onClick={handleQuickShop}
                        className="absolute bottom-4 right-4 bg-primary text-white pt-2.5 pb-1.5 pr-2.5 pl-1.5 rounded-full shadow-lg transition-all duration-300 z-10 hover:scale-110"
                        data-testid="quick-shop-btn"
                    >

                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1H5.4L7.68 12.39C7.77144 12.8504 8.02191 13.264 8.38755 13.5639C8.75318 13.8638 9.21301 14.0324 9.68 14H19.4C19.867 14.0324 20.3268 13.8638 20.6925 13.5639C21.0581 13.264 21.3086 12.8504 21.4 12.39L23 4H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </Link>

            <div className="mt-2">
                <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-lg font-light text-text-black">{product.name}</h3>
                    <Price price={product.prices[0]} className="text-lg font-medium text-text-black mt-1" />
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
