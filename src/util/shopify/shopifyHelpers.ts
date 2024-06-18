/**
 * Returns the URL for a product with the given handle
 * @param shopUrl 		The URL of the shop
 * @param handle  		The handle of the product
 * @returns 			The URL of the product
 */
export function productUrlHelper(shopUrl: string, handle: string): string {
	return `${shopUrl}/products/${handle}`;
}

/**
 * Returns the URL for a product with the given handle
 * @param shopUrl 		The URL of the shop
 * @param variantId  	The ID of the variant
 * @returns 			The URL of the product
 */
export function productCartUrlHelper(shopUrl: string, variantId: number): string {
	return `${shopUrl}/cart/${variantId}:1`;
}
