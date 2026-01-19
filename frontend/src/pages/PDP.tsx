import { useState } from 'react';
import parse from 'html-react-parser';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct } from '../hooks/useProduct';
import Loader from '../components/common/Loader';
import Price from '../components/common/Price';

const PDP = () => {
    const { id } = useParams();
    const { product, loading, error } = useProduct(id);
    const { addToCart } = useCart();


    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (loading) return <Loader />;
    if (error) return <div className="p-10 text-center text-red-500 font-medium">Error: {error.message}</div>;

    if (!product) return <div className="p-10 text-center font-medium">Product not found</div>;

    const handleOptionSelect = (attrId: string, itemId: string) => {
        setSelectedOptions(prev => ({ ...prev, [attrId]: itemId }));
    };

    const isAllSelected = product.attributes.every((attr: any) => selectedOptions[attr.id]);

    const handleAddToCart = () => {
        if (!isAllSelected) return;
        addToCart(product, selectedOptions);
    };

    return (
        <div className="w-full mx-auto xl:px-24 md:px-8 py-16 flex flex-col md:flex-row gap-16">

            <div className="w-full md:w-3/4 flex gap-4" data-testid="product-gallery">

                <div className="flex flex-col gap-4 w-20">
                    {product.gallery.map((img: string, idx: number) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className="cursor-pointer"
                        >
                            <img src={img} alt="" className="w-full h-20 object-cover" />
                        </div>
                    ))}
                </div>

                <div className="flex-1 relative aspect-auto">
                    <img src={product.gallery[currentImageIndex]} alt={product.name} className="w-full h-auto object-contain max-h-[600px]" />

                    <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 text-white p-2"
                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? product.gallery.length - 1 : prev - 1)}
                    >&lt;</button>
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 text-white p-2"
                        onClick={() => setCurrentImageIndex(prev => prev === product.gallery.length - 1 ? 0 : prev + 1)}
                    >&gt;</button>
                </div>
            </div>


            <div className="w-full md:w-1/3">
                <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
                <p className="text-xl mb-8 font-medium">{product.brand}</p>

                {product.attributes.map((attr: any) => (
                    <div key={attr.id} className="mb-6" data-testid={`product-attribute-${attr.name.toLowerCase().replace(/ /g, '-')}`}>
                        <p className="font-bold uppercase font-rubik text-sm mb-2">{attr.name}:</p>
                        <div className="flex gap-3">
                            {attr.items.map((item: any) => {
                                const isSelected = selectedOptions[attr.id] === item.id;
                                if (attr.type === 'swatch') {
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleOptionSelect(attr.id, item.id)}
                                            className={`w-8 h-8 border ${isSelected ? 'ring-2 ring-primary ring-offset-1' : 'border-gray-300'}`}
                                            style={{ backgroundColor: item.value }}
                                            title={item.displayValue}
                                        />
                                    );
                                }
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleOptionSelect(attr.id, item.id)}
                                        className={`h-10 w-16 border ${isSelected ? 'bg-black text-white' : 'bg-white text-black border-black'} font-medium`}
                                    >
                                        {item.value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="mb-8">
                    <p className="font-bold uppercase font-rubik text-sm mb-2">Price:</p>
                    <Price price={product.prices[0]} className="text-2xl font-bold" />
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || !isAllSelected}
                    data-testid="add-to-cart"
                    className={`w-full py-4 uppercase font-semibold text-white mb-8 transition-colors ${!product.inStock || !isAllSelected ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600'}`}
                >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <div
                    data-testid="product-description"
                    className="font-roboto text-base leading-relaxed"
                >
                    {parse(product.description || '')}
                </div>
            </div>
        </div>
    );
};

export default PDP;
