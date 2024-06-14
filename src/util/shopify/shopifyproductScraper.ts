import { SHOPIFY_STORES } from "../../const";
import { Bindings } from "../../types/bindings";
import { Product, Variant } from "../../types/shopify/shopifyProduct";
import { ShopifyProductResponse } from "../../types/shopify/shopifyProductResponse";
import { getProductFromDBByProductId, saveProductToDb, updateProductById } from "../dbConnection";
import { ProductDB } from "../interface/ProductDb";
import { sendToNtfy } from "../ntfyConnection";

export class ShopifyProductScraper {
    private shopifyStoreUrl: string;
    private env: Bindings;

    public constructor(shopifyStoreUrl: string, env: Bindings) {
        this.shopifyStoreUrl = shopifyStoreUrl;
        this.env = env;
    }

    public async scrapeProducts(): Promise<void> {
        const products = await this.getProducts();
        // check if product is already in db
        // if not, save to db

        // if product is already in db, check if it is available

        for (const product of products) {
            for(const variant of product.variants) {
                const mappedProduct = this.mapToProductDataModel(product, variant);
                const id= product.id + '-' + variant.id;
        const productInDB = await getProductFromDBByProductId(id, this.env.productsDB);
        if(!productInDB) {
            await saveProductToDb(mappedProduct, this.env.productsDB);
            await sendToNtfy(mappedProduct, this.shopifyStoreUrl, this.env);
        }
        else{
            if(productInDB.available !== variant.available || productInDB.price !== variant.price || productInDB.title !== product.title){
                
                productInDB.available = variant.available;
                productInDB.price = variant.price;
                productInDB.title = product.title;
                await updateProductById(id, mappedProduct, this.env.productsDB);
                await sendToNtfy(mappedProduct, this.shopifyStoreUrl, this.env);
            }
        
        }
            }
        }
    }

    private mapToProductDataModel(product: Product, variant: Variant): ProductDB{
        return {
            productId: product.id + '-' + variant.id,
            title: product.title,
            handle: product.handle,
            published_at: product.published_at,
            created_at: product.created_at,
            updated_at: product.updated_at,
            price: variant.price,
            available: variant.available,
            shopifyStore: this.shopifyStoreUrl
        }
    }
    
    private async getProducts(): Promise<Product[]> {
        const reponse = await fetch(this.shopifyStoreUrl + SHOPIFY_STORES.PRODUCTS_URL);
        const data = await reponse.json() as ShopifyProductResponse;
        return data.products;
    }
}