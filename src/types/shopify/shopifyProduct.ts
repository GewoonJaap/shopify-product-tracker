export interface Product {
	id: number;
	title: string;
	handle: string;
	body_html: string;
	published_at: string;
	created_at: string;
	updated_at: string;
	vendor: string;
	product_type: string;
	tags: string[];
	variants: Variant[];
	images: Image[];
	options: Option[];
}

export interface Variant {
	id: number;
	title: string;
	option1: string;
	option2: any;
	option3: any;
	sku: string;
	requires_shipping: boolean;
	taxable: boolean;
	featured_image: any;
	available: boolean;
	price: string;
	grams: number;
	compare_at_price?: string;
	position: number;
	product_id: number;
	created_at: string;
	updated_at: string;
}

export interface Image {
	id: number;
	created_at: string;
	position: number;
	updated_at: string;
	product_id: number;
	variant_ids: any[];
	src: string;
	width: number;
	height: number;
}

export interface Option {
	name: string;
	position: number;
	values: string[];
}
