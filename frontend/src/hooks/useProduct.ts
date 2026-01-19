import { useQuery } from '@apollo/client';
import { GET_PRODUCT_BY_ID } from '../graphql/queries';
import type { Product } from '../types';

export const useProduct = (id: string | undefined) => {
    const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
        variables: { id },
        skip: !id
    });

    return {
        product: data?.product as Product | undefined,
        loading,
        error
    };
};
