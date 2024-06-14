import { SHOPIFY_STORES } from '../../const';
import { Bindings } from '../../types/bindings';
import { Collection } from '../../types/shopify/shopifyCollection';
import { Product, Variant } from '../../types/shopify/shopifyProduct';
import { ShopifyProductResponse } from '../../types/shopify/shopifyProductResponse';
import { ShopifyStoreConfig } from '../../types/shopify/shopifyStoreConfig';
import { getProductFromDBByProductId, saveProductToDb, updateProductById } from '../dbConnection';
import { ProductDB } from '../interface/ProductDb';
import { sendToNtfy } from '../ntfyConnection';

export class ShopifyProductScraper {
	private shopifyStore: ShopifyStoreConfig;
	private env: Bindings;

	public constructor(shopifyStore: ShopifyStoreConfig, env: Bindings) {
		this.shopifyStore = shopifyStore;
		this.env = env;
	}

	public async scrapeProducts(): Promise<void> {
		const collections = await this.getCollections();
		for (const collection of collections) {
			const products = await this.getProducts(collection.handle);

			// check if product is already in db
			// if not, save to db

			// if product is already in db, check if it is available

			for (const product of products) {
				for (const variant of product.variants) {
					const mappedProduct = this.mapToProductDataModel(product, variant);
					const id = product.id + '-' + variant.id;
					const productInDB = await getProductFromDBByProductId(id, this.env.productsDB);
					if (!productInDB) {
						await saveProductToDb(mappedProduct, this.env.productsDB);
						await sendToNtfy(mappedProduct, this.shopifyStore, this.env);
					} else if (
						productInDB.available != mappedProduct.available ||
						productInDB.price != mappedProduct.price ||
						productInDB.title != mappedProduct.title ||
						productInDB.published_at != mappedProduct.published_at
					) {
						await updateProductById(id, mappedProduct, this.env.productsDB);
						await sendToNtfy(mappedProduct, this.shopifyStore, this.env);
					}
				}
			}
		}
	}

	private mapToProductDataModel(product: Product, variant: Variant): ProductDB {
		return {
			productId: product.id + '-' + variant.id,
			title: this.titleMapper(product, variant),
			handle: product.handle,
			published_at: product.published_at,
			created_at: product.created_at,
			updated_at: product.updated_at,
			price: variant.price,
			available: variant.available,
			shopifyStore: this.shopifyStore.URL,
		};
	}

	private titleMapper(product: Product, variant: Variant): string {
		if (variant.title && variant.title.toLowerCase() != 'default title') {
			return product.title + ' - ' + variant.title;
		}
		return product.title;
	}

	private async getCollections(): Promise<Collection[]> {
		const response = await fetch(this.shopifyStore.URL + SHOPIFY_STORES.COLLECTIONS_URL, {
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
			},
		});

		const data = (await response.json()) as Collection[];
		return data;
	}

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
