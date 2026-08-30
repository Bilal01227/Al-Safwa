import type { Product } from "../../types";
import { supabase } from "../../supabase";
import { powerTools } from "./power-tools";
import { safetyEquipment } from "./safety-equipment";
import { motorsPumps } from "./motors-pumps";
import { handTools } from "./hand-tools";
import { spareParts } from "./spare-parts";

export const products: Product[] = [...powerTools,...safetyEquipment,...motorsPumps,...handTools,...spareParts];

type DbProduct={id:string;name:string;slug:string;brand_id:string|null;category_id:string|null;model_number:string|null;short_description:string|null;specifications:Record<string,string>|null;price:number|null;currency:string;price_type:string;availability_status:string;featured:boolean;verified:boolean;source_url:string|null;source_company:string|null;last_verified_at:string|null;active:boolean};
type Ref={id:string;name:string;slug:string};
async function fromSupabase():Promise<Product[]>{
 const [p,b,c,i]=await Promise.all([supabase.from("products").select("id,name,slug,brand_id,category_id,model_number,short_description,specifications,price,currency,price_type,availability_status,featured,verified,source_url,source_company,last_verified_at,active"),supabase.from("brands").select("id,name,slug"),supabase.from("categories").select("id,name,slug"),supabase.from("product_images").select("product_id,storage_path,is_primary,sort_order").order("sort_order")]);
 if(p.error) throw p.error; const brands=(b.data||[]) as Ref[],cats=(c.data||[]) as Ref[]; const images=(i.data||[]) as {product_id:string;storage_path:string;is_primary:boolean;sort_order:number}[];
 return ((p.data||[]) as DbProduct[]).filter(x=>x.active).map(x=>{const br=brands.find(v=>v.id===x.brand_id),ca=cats.find(v=>v.id===x.category_id),im=images.filter(v=>v.product_id===x.id).sort((a,z)=>Number(z.is_primary)-Number(a.is_primary)||a.sort_order-z.sort_order)[0];return {slug:x.slug,productName:x.name,brand:br?.name||"Al Safwa",brandSlug:br?.slug||"al-safwa",modelNumber:x.model_number||"—",category:ca?.slug||"industrial-equipment",subcategory:ca?.name||"Industrial Equipment",shortDescription:x.short_description||"",specifications:x.specifications||{},imageUrl:im?supabase.storage.from("product-images").getPublicUrl(im.storage_path).data.publicUrl:"",sourceUrl:x.source_url||"",sourceCompany:x.source_company||"",availability:x.availability_status,currency:x.currency,price:x.price,priceType:(x.price_type||"request_quote") as Product["priceType"],verified:x.verified,lastVerified:x.last_verified_at,featured:x.featured};});
}
async function liveProducts(){try{return await fromSupabase()}catch{return []}}
export async function fetchProducts():Promise<Product[]>{const live=await liveProducts();const map=new Map(products.map(p=>[p.slug,p]));for(const p of live)map.set(p.slug,p);return [...map.values()]}
export async function fetchProductBySlug(slug:string):Promise<Product|undefined>{const all=await fetchProducts();return all.find(p=>p.slug===slug)}
export async function fetchProductsByBrand(brandSlug:string):Promise<Product[]>{return (await fetchProducts()).filter(p=>p.brandSlug===brandSlug)}
export async function fetchFeaturedProducts():Promise<Product[]>{return (await fetchProducts()).filter(p=>p.featured)}
export async function fetchRelatedProducts(product:Product,limit=4):Promise<Product[]>{const all=await fetchProducts();return all.filter(p=>p.slug!==product.slug&&p.category===product.category).concat(all.filter(p=>p.slug!==product.slug&&p.category!==product.category)).slice(0,limit)}
export function productCountByCategory(categorySlug:string):number{if(categorySlug==="rental-equipment")return 0;return products.filter(p=>p.category===categorySlug).length}
export function productCountByBrand(brandSlug:string):number{return products.filter(p=>p.brandSlug===brandSlug).length}
