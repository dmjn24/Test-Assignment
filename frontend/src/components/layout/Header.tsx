import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCategories } from '../../hooks/useCategories';
import CartOverlay from '../cart/CartOverlay';

const Header = () => {
    const { categories } = useCategories();
    const { totalItems } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const location = useLocation();

    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white z-50 flex items-center justify-between px-24">

            <nav className="flex items-center space-x-8">
                {categories.map((cat: any) => {


                    const toPath = cat.name === 'all' ? '/all' : `/${cat.name}`;
                    const isActive = location.pathname === toPath || (toPath === '/all' && location.pathname === '/');

                    return (
                        <Link
                            key={cat.name}
                            to={cat.name === 'all' ? '/all' : `/${cat.name}`}
                            className={`uppercase font-medium text-base px-2 pb-4 transition-colors border-b-2
                                ${isActive
                                    ? 'text-primary border-primary'
                                    : 'text-text-black border-transparent hover:text-primary'
                                }`
                            }
                            data-testid={isActive ? 'active-category-link' : 'category-link'}
                        >
                            {cat.name}
                        </Link>
                    );
                })}
            </nav>


            <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="h-8" />

                </Link>
            </div>


            <div className="flex items-center space-x-6">

                <div className="relative">
                    <button
                        onClick={() => setIsCartOpen(!isCartOpen)}
                        data-testid="cart-btn"
                        className="p-2"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1H5.4L7.68 12.39C7.77144 12.8504 8.02191 13.264 8.38755 13.5639C8.75318 13.8638 9.21301 14.0324 9.68 14H19.4C19.867 14.0324 20.3268 13.8638 20.6925 13.5639C21.0581 13.264 21.3086 12.8504 21.4 12.39L23 4H6" stroke="#43464E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                                {totalItems}
                            </span>
                        )}
                    </button>
                    {isCartOpen && (
                        <>

                            <div
                                className="fixed inset-0 top-20 bg-black/20 z-40"
                                onClick={() => setIsCartOpen(false)}
                            ></div>

                            <div className="absolute right-0 top-full pt-8 w-80 bg-white shadow-xl z-50 px-4 py-6 max-h-[80vh] overflow-y-auto">
                                <CartOverlay close={() => setIsCartOpen(false)} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
