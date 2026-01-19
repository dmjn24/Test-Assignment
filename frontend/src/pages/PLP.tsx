import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

const PLP = () => {
    const { categoryName } = useParams();
    const title = categoryName || 'all';

    const { products, loading, error, refetch } = useProducts(title);

    useEffect(() => {
        refetch({ title });
    }, [title, refetch]);

    if (loading) return <Loader />;
    if (error) return <div className="p-10 text-center text-red-500 font-medium">Error: {error.message}</div>;

    return (
        <div className="mx-auto px-24 py-16">
            <h2 className="text-4xl capitalize mb-12 text-text-black font-normal">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default PLP;
