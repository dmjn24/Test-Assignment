import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries';

export const useCategories = () => {
    const { data, loading, error } = useQuery(GET_CATEGORIES);

    return {
        categories: data?.categories || [],
        loading,
        error
    };
};
