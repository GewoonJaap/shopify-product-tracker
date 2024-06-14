import { SHOPIFY_STORES } from "../../const";
import { Bindings } from "../../types/bindings";
import { Product, Variant } from "../../types/shopify/shopifyProduct";
import { ShopifyProductResponse } from "../../types/shopify/shopifyProductResponse";
import { ShopifyStoreConfig } from "../../types/shopify/shopifyStoreConfig";
import { getProductFromDBByProductId, saveProductToDb, updateProductById } from "../dbConnection";
import { ProductDB } from "../interface/ProductDb";
import { sendToNtfy } from "../ntfyConnection";

export class ShopifyProductScraper {
    private shopifyStore: ShopifyStoreConfig;
    private env: Bindings;

    public constructor(shopifyStore: ShopifyStoreConfig, env: Bindings) {
        this.shopifyStore = shopifyStore;
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
            await sendToNtfy(mappedProduct, this.shopifyStore, this.env);
        }
        else{
            if(productInDB.available !== variant.available || productInDB.price !== variant.price || productInDB.title !== product.title || productInDB.updated_at !== product.updated_at || productInDB.created_at !== product.created_at || productInDB.published_at !== product.published_at){
                
                productInDB.available = variant.available;
                productInDB.price = variant.price;
                productInDB.title = product.title;
                productInDB.updated_at = product.updated_at;
                productInDB.created_at = product.created_at;
                productInDB.published_at = product.published_at;
                
                await updateProductById(id, mappedProduct, this.env.productsDB);
                await sendToNtfy(mappedProduct, this.shopifyStore, this.env);
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
            shopifyStore: this.shopifyStore.URL
        }
    }
    
    private async getProducts(): Promise<Product[]> {
        console.log('Making a request to', this.shopifyStore.URL + SHOPIFY_STORES.PRODUCTS_URL);
        const reponse = await fetch(this.shopifyStore.URL + SHOPIFY_STORES.PRODUCTS_URL, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        const data = await reponse.json() as ShopifyProductResponse;
        return data.products;
    }
}