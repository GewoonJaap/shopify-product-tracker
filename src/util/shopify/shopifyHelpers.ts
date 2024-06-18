export function productUrlHelper(shopUrl: string, handle: string): string {
	return `${shopUrl}/products/${handle}`;
}

export function productCartUrlHelper(shopUrl: string, variantId: number): string {
	return `${shopUrl}/cart/${variantId}:1`;
}
