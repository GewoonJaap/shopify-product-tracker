import { SHOPIFY_STORES } from '../../const';
import { Bindings } from '../../types/bindings';
import { Collection } from '../../types/shopify/shopifyCollection';
import { Product, Variant } from '../../types/shopify/shopifyProduct';
import { ShopifyProductResponse } from '../../types/shopify/shopifyProductResponse';
import { ShopifyCollectionResponse } from '../../types/shopify/shopifyCollectionResponse';
import { ShopifyStoreConfig } from '../../types/shopify/shopifyStoreConfig';
import { getProductsByShopifyStore, saveProductToDb, updateProductById } from '../db/dbConnection';
import { sendToNtfy } from '../ntfy/ntfyConnection';
import { ExtendedProductDb } from '../interface/ExtendedProductDb';

/**
 * The shopify product scraper
 */
export class ShopifyProductScraper {
	private shopifyStore: ShopifyStoreConfig;
	private env: Bindings;

	/**
	 * Creates an instance of the shopify product scraper
	 * @param {ShopifyStoreConfig} shopifyStore - The shopify store to scrape products from
	 * @param {Bindings} env - The environment variables
	 */
	public constructor(shopifyStore: ShopifyStoreConfig, env: Bindings) {
		this.shopifyStore = shopifyStore;
		this.env = env;
	}

	/**
	 * Scrapes the products from the shopify store
	 * @returns {Promise<void>} - Returns a promise
	 */
	public async scrapeProducts(): Promise<void> {
		const collections = await this.getCollections();
		for (const collection of collections) {
			const products = await this.getProducts(collection.handle);

			// check if product is already in db
			// if not, save to db

			// if product is already in db, check if it is available

			// get all products from db batched
			const dbProducts = await getProductsByShopifyStore(this.shopifyStore.URL, this.env.productsDB);

			for (const product of products) {
				for (const variant of product.variants) {
					const mappedProduct = this.mapToProductDataModel(product, variant);
					const productInDB = dbProducts.find(p => p.productId == mappedProduct.productId);
					if (!productInDB) {
						await saveProductToDb(mappedProduct, this.env.productsDB);
						await sendToNtfy(mappedProduct, this.shopifyStore, this.env, true, product, variant);
					} else if (
						productInDB.available != mappedProduct.available ||
						productInDB.price != mappedProduct.price ||
						productInDB.title != mappedProduct.title ||
						productInDB.published_at != mappedProduct.published_at
					) {
						await updateProductById(mappedProduct.productId, mappedProduct, this.env.productsDB);
						await sendToNtfy(mappedProduct, this.shopifyStore, this.env, false, product, variant);
					}
				}
			}
		}
	}

	/**
	 * Maps the product and variant to an extended product data model
	 * @param {Product} product - The product to map
	 * @param {Variant} variant - The variant to map
	 * @returns {ExtendedProductDb} - The mapped product data model
	 */
	private mapToProductDataModel(product: Product, variant: Variant): ExtendedProductDb {
		return {
			productId: this.mapProductId(product, variant),
			title: this.titleMapper(product, variant),
			bodyHtml: product.body_html,
			handle: product.handle,
			published_at: product.published_at,
			created_at: product.created_at,
			updated_at: product.updated_at,
			price: variant.price,
			available: variant.available,
			shopifyStore: this.shopifyStore.URL,
		};
	}

	/**
	 * Maps the product and variant to a unique product id
	 * @param {Product} product - The product to map
	 * @param {Variant} variant - The variant to map
	 * @returns {string} - The mapped product id
	 */
	private mapProductId(product: Product, variant: Variant): string {
		return product.id + '-' + variant.id;
	}

	/**
	 * Maps the product and variant to a unique title
	 * @param {Product} product - The product to map
	 * @param {Variant} variant - The variant to map
	 * @returns {string} - The mapped title
	 */
	private titleMapper(product: Product, variant: Variant): string {
		if (variant.title && variant.title.toLowerCase() != 'default title') {
			return product.title + ' - ' + variant.title;
		}
		return product.title;
	}

	/**
	 * Gets the collections from the shopify store
	 * @returns {Promise<Collection[]>} - The collections
	 */
	private async getCollections(): Promise<Collection[]> {
		const response = await fetch(this.shopifyStore.URL + SHOPIFY_STORES.COLLECTIONS_URL, {
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
			},
		});

		const data = (await response.json()) as ShopifyCollectionResponse;
		return data.collections;
	}

	/**
	 * Gets the products from the shopify store
	 * @param {string} collection - The collection to get the products from
	 * @returns {Promise<Product[]>} - The products
	 */
	private async getProducts(collection: string | undefined = undefined): Promise<Product[]> {
		const finalUrl = collection
			? `${this.shopifyStore.URL}/collections/${collection}` + SHOPIFY_STORES.PRODUCTS_URL
			: this.shopifyStore.URL + SHOPIFY_STORES.PRODUCTS_URL;
		console.log('Making a request to', finalUrl);
		const response = await fetch(finalUrl, {
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
			},
		});
		const data = (await response.json()) as ShopifyProductResponse;
		return data.products;
	}
}
