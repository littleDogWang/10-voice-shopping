import catalogData from './catalog.json';

export interface Product {
  productId: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  attributes: string[];
  stock: number;
}

const products = catalogData.products as Product[];

export function searchProducts(query: string): Product[] {
  const tokens = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return products.filter((product) => {
    const searchable = [product.name, product.category, ...product.attributes]
      .join(' ')
      .toLowerCase();
    return tokens.length === 0 || tokens.some((token) => searchable.includes(token));
  });
}

export function getProduct(productId: string): Product | null {
  return products.find((product) => product.productId === productId.trim().toUpperCase()) ?? null;
}

export const CATALOG_FIXTURE_VERSION = catalogData.version;
