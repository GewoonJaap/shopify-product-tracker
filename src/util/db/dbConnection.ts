import { ProductDB } from '../interface/ProductDb';

/**
 * Saves a product to the database
 * @param {ProductDB} data - The product data
 * @param {D1Database} productDB - The database connection
 * @returns {Promise<void>} - Returns a promise
 */
export async function saveProductToDb(data: ProductDB, productDB: D1Database): Promise<void> {
	try {
		await productDB
			.prepare(
				`INSERT into product (productId,title,handle,published_at,created_at,updated_at,price,available,shopifyStore	
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
			)
			.bind(
				data.productId,
				data.title,
				data.handle,
				data.published_at,
				data.created_at,
				data.updated_at,
				data.price,
				data.available,
				data.shopifyStore
			)
			.run();
	} catch (e) {
		console.log('Failed to save product to db', e);
	}
}

/**
 * Returns a product from the database by product ID
 * @param {string} productId - The product ID
 * @param {D1Database} productDB - The database connection
 * @returns {Promise<ProductDB | null>} - Returns a promise
 */
export async function getProductFromDBByProductId(productId: string, productDB: D1Database): Promise<ProductDB | null> {
	const result = await productDB.prepare(`SELECT * FROM product WHERE productId = ?`).bind(productId).first();

	return result as unknown as ProductDB | null;
}

/**
 * Returns all products from the database
 * @param {D1Database} productDB - The database connection
 * @returns {Promise<ProductDB[]>} - Returns a promise
 */
export async function getAllProductsFromDb(productDB: D1Database): Promise<ProductDB[]> {
	const { results } = await productDB.prepare(`SELECT * FROM product`).all();

	return results as unknown as ProductDB[];
}

/**
 * Returns all products from the database by shopify store
 * @param {string} shopifyStore - The shopify store
 * @param {D1Database} productDB - The database connection
 * @returns {Promise<ProductDB[]>} - Returns a promise
 */
export async function getProductsByShopifyStore(shopifyStore: string, productDB: D1Database): Promise<ProductDB[]> {
	const { results } = await productDB.prepare(`SELECT * FROM product WHERE shopifyStore = ?`).bind(shopifyStore).all();

	return results as unknown as ProductDB[];
}

/**
 * Updates a product by product ID
 * @param {string} productId - The product ID
 * @param {ProductDB} data - The product data
 * @param {D1Database} productDB - The database connection
 * @returns {Promise<void>} - Returns a promise
 */
export async function updateProductById(productId: string, data: ProductDB, productDB: D1Database): Promise<void> {
	try {
		await productDB
			.prepare(
				`UPDATE product SET title = ?, handle = ?, published_at = ?, created_at = ?, updated_at = ?, price = ?, available = ?, shopifyStore = ? WHERE productId = ?`
			)
			.bind(
				data.title,
				data.handle,
				data.published_at,
				data.created_at,
				data.updated_at,
				data.price,
				data.available,
				data.shopifyStore,
				productId
			)
			.run();
	} catch (e) {
		console.log('Failed to update product', e);
	}
}
