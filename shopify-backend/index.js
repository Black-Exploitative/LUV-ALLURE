require('dotenv').config();
const express = require('express');
const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Apollo Client for Shopify
const shopifyClient = new ApolloClient({
  uri: `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
  cache: new InMemoryCache(),
  headers: {
    'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN
  }
});

// Proxy endpoint for Shopify GraphQL queries
app.post('/api/shopify', async (req, res) => {
  try {
    const { query, variables } = req.body;
    const { data } = await shopifyClient.query({
      query: gql(query),
      variables: variables || {}
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on http://localhost:${process.env.PORT}`);
});