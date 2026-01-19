import { useQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_CATEGORY } from '../graphql/queries';

export const useProducts = (categoryName: string) => {
    const { data, loading, error, refetch } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
        variables: { title: categoryName },
    });

    return {
        products: data?.category?.products || [],
        loading,
        error,
        refetch
    };
};
