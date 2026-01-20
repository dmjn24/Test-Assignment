import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCategories } from '../../hooks/useCategories';
import CartOverlay from '../cart/CartOverlay';
import { FiShoppingCart } from 'react-icons/fi';

const Header = () => {
    const { categories: fetchedCategories } = useCategories();
    const categories = fetchedCategories.length > 0 ? fetchedCategories : [
        { name: 'all' },
        { name: 'clothes' },
        { name: 'tech' }
    ];
    const { totalItems, isCartOpen, setIsCartOpen } = useCart();
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
                        className="p-2 cursor-pointer transition-colors group"
                    >
                        <FiShoppingCart size={24} className="text-[#43464E] group-hover:text-primary transition-colors" />
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

                            <div
                                data-testid="cart-overlay"
                                className="absolute right-0 top-full pt-8 w-80 bg-white shadow-xl z-50 px-4 py-6 max-h-[80vh] overflow-y-auto"
                            >
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
