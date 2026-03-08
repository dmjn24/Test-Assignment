import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import type { Product, AttributeSet } from '../../types';
import Price from '../common/Price';
import { FiShoppingCart } from 'react-icons/fi';


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
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                        <span className="text-2xl font-medium text-gray-500 uppercase tracking-wide">Out of Stock</span>
                    </div>
                )}
                {product.inStock && isHovered && (
                    <button
                        onClick={handleQuickShop}
                        className="absolute bottom-4 right-4 bg-primary text-white pt-3 pb-2 pr-3 pl-2 rounded-full shadow-lg transition-all duration-300 z-10 hover:scale-110"
                        data-testid="quick-shop-btn"
                    >
                        <FiShoppingCart size={22} color="white" />
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
