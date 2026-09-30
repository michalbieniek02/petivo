const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ecxva5-gd.myshopify.com";
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "";
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

async function storefront<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!token || token === "WKLEJ_TOKEN_TUTAJ") throw new Error("No Storefront token");
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data as T;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: { id: string; title: string; priceV2: { amount: string } };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: { edges: { node: CartLine }[] };
  cost: { totalAmount: { amount: string; currencyCode: string } };
}

const CART_FIELDS = `
  id
  checkoutUrl
  lines(first: 10) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            priceV2 { amount }
          }
        }
      }
    }
  }
  cost { totalAmount { amount currencyCode } }
`;

const NUMERIC_VARIANT_ID = "58834277204342";
const PRICE_PLN = "399.00";

export function buildLocalCart(qty: number): Cart {
  return {
    id: "local",
    checkoutUrl: `https://${domain}/cart/${NUMERIC_VARIANT_ID}:${qty}`,
    lines: {
      edges: [{
        node: {
          id: "local-line",
          quantity: qty,
          merchandise: {
            id: `gid://shopify/ProductVariant/${NUMERIC_VARIANT_ID}`,
            title: "Petivo Auto",
            priceV2: { amount: PRICE_PLN },
          },
        },
      }],
    },
    cost: {
      totalAmount: {
        amount: (parseFloat(PRICE_PLN) * qty).toFixed(2),
        currencyCode: "PLN",
      },
    },
  };
}

export async function createCart(merchandiseId: string, quantity = 1): Promise<Cart> {
  const data = await storefront<{ cartCreate: { cart: Cart } }>(`
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ${CART_FIELDS} }
      }
    }
  `, { input: { lines: [{ quantity, merchandiseId }] } });
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, merchandiseId: string, quantity = 1): Promise<Cart> {
  const data = await storefront<{ cartLinesAdd: { cart: Cart } }>(`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
      }
    }
  `, { cartId, lines: [{ quantity, merchandiseId }] });
  return data.cartLinesAdd.cart;
}
