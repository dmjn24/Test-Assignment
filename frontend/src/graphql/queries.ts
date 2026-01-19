import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      name
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($title: String!) {
    category(id: $title) {
      name
      products {
        id
        name
        inStock
        gallery
        prices {
          amount
          currency {
            label
            symbol
          }
        }
        brand
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      brand
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($items: [OrderInput]!) {
    createOrder(items: $items)
  }
`;
