export interface Collection {
	id: number;
	title: string;
	handle: string;
	description: string;
	published_at: string;
	updated_at: string;
	image?: Image;
	products_count: number;
}

export interface Image {
	id: number;
	created_at: string;
	src: string;
	alt: any;
}
