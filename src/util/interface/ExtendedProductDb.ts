import { ProductDB } from './ProductDb';

export interface ExtendedProductDb extends ProductDB {
	bodyHtml: string;
}
