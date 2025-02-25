# Backend API Documentation for Luvs Allure

## For Frontend Developers

This document explains how to interact with the Node.js backend API that connects to Shopify’s Storefront API. Frontend developers should use these endpoints to fetch product data, collections, and other Shopify resources.

## Base URL
All endpoints are relative to:
```
https://your-backend-domain.com/api/shopify
```
(Replace with your deployed backend URL, e.g., `http://localhost:4000/api/shopify` during development).

## Authentication
Include an `X-API-Key` header in requests if your backend requires authentication (configured by your backend team):

### Request Example
```
POST /api/shopify
```
#### Headers:
```
X-API-Key: your-api-key (if applicable)
Content-Type: application/json
```

## API Endpoints
### 1. Universal GraphQL Proxy
Send GraphQL queries as a `POST` request to `/api/shopify`.

#### Request
- **Method:** `POST`
- **Headers:**
```json
{
  "Content-Type": "application/json",
  "X-API-Key": "your-api-key" // (if configured)
}
```
- **Body:**
```json
{
  "query": "Your GraphQL Query",
  "variables": { /* Optional variables */ }
}
```

## Examples
### Example 1: Fetch Products
```json
{
  "query": "
    query Products($first: Int!) {
      products(first: $first) {
        nodes {
          id
          title
          description
          variants(first: 1) {
            nodes {
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  ",
  "variables": { "first": 10 }
}
```

### Example 2: Fetch a Collection
```json
{
  "query": "
    query CollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        title
        products(first: 10) {
          nodes {
            id
            title
            images(first: 1) {
              nodes { url }
            }
          }
        }
      }
    }
  ",
  "variables": { "handle": "bridal" }
}
```

### Example 3: Fetch Product Variants
```json
{
  "query": "
    query ProductVariants($id: ID!) {
      product(id: $id) {
        variants(first: 10) {
          nodes {
            id
            title
            price {
              amount
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  ",
  "variables": { "id": "gid://shopify/Product/123456789" }
}
```

## Successful Response
**Status Code:** `200 OK`
```json
{
  "data": { /* Query result */ },
  "extensions": { /* Shopify metadata (optional) */ }
}
```

## Error Response
**Status Code:** `4xx` or `5xx`
```json
{
  "error": "Error message from Shopify or backend"
}
```

## Key Shopify GraphQL Queries for Luvs Allure
### 1. Fetch Products with Filters
```graphql
query Products(
  $first: Int!
  $query: String
) {
  products(first: $first, query: $query) {
    nodes {
      id
      title
      description
      priceRange {
        minVariantPrice { amount }
        maxVariantPrice { amount }
      }
      images(first: 3) { nodes { url } }
    }
  }
}
```
#### Sample Variables:
```json
{
  "first": 12,
  "query": "product_type:'Evening Dress' AND tag:'2024-collection'"
}
```

### 2. Fetch a Single Product by ID
```graphql
query Product($id: ID!) {
  product(id: $id) {
    title
    description
    variants(first: 10) {
      nodes {
        id
        title
        price { amount }
        selectedOptions { name, value } # e.g., Size, Color
      }
    }
  }
}
```

### 3. Fetch Collections
```graphql
query Collections {
  collections(first: 10) {
    nodes {
      id
      title
      image { url }
    }
  }
}
```

### 4. Search Products
```graphql
query SearchProducts($query: String!) {
  products(first: 10, query: $query) {
    nodes {
      id
      title
      images(first: 1) { nodes { url } }
    }
  }
}
```

## Pagination
Use `first` and `after` cursors for pagination.

### Example:
```graphql
query Products($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes { id, title }
  }
}
```
#### Variables:
```json
{ "first": 10, "after": "abc123" }
```

## Error Handling
- **400 Bad Request:** Invalid query or variables.
- **401 Unauthorized:** Missing or invalid `X-API-Key` (if configured).
- **500 Internal Server Error:** Backend or Shopify API failure.

## Best Practices
- **Cache Frequently Used Data:** Use client-side caching (e.g., React Query) to reduce API calls.
- **Batch Requests:** Combine related queries into a single request.
- **Handle Loading States:** Show skeletons/loaders while waiting for responses.

