/**
 * Product reference images are sourced from manufacturer or equipment-supplier product pages.
 * They are visual references only, not photographs of Al Safwa-owned units or proof of availability.
 * Rental enquiry catalogue.
 * These are equipment classes customers can enquire about, not a claim that
 * every unit is owned or currently in stock. Availability, specifications,
 * operator and transport are confirmed before a quotation is issued.
 */
import type { RentalItem } from "../types";

export const rentalCategories: string[] = [
  "Heavy Machinery",
  "Construction Equipment",
  "Aerial Access",
  "Compaction & Roadwork",
  "Material Handling",
  "Generators & Power",
  "Pumps & Water Management",
  "Welding & Industrial",
  "Power Tools",
  "Compressors",
  "Lifting Equipment",
  "Site Equipment",
];

const CONTACT = "Subject to fleet confirmation";
const condition = "Inspection and condition confirmed before dispatch";

function item(
  id: string,
  name: string,
  category: string,
  description: string,
  imageUrl: string,
  model = "Size / capacity confirmed per project",
): RentalItem {
  return {
    id, name, brand: "Confirmed per unit", model, category, description,
    condition, availability: CONTACT,
    dailyRate: null, weeklyRate: null, monthlyRate: null, imageUrl,
  };
}

export const rentalItems: RentalItem[] = [
  // Earthmoving and heavy machinery
  item("rt-excavator-20t", "20T Tracked Excavator", "Heavy Machinery", "Tracked excavator for bulk excavation, trenching, foundations and site preparation.", "https://s7d2.scene7.com/is/image/Caterpillar/CM20210630-35b09-11eca", "20-ton class · final size TBC"),
  item("rt-mini-excavator", "Mini Excavator", "Heavy Machinery", "Compact excavator for utilities, landscaping, confined sites and light excavation.", "https://s7d2.scene7.com/is/image/Caterpillar/CM20210820-b09f2-ba5c8?%24hero-cc-t1%24="),
  item("rt-long-reach-excavator", "Long-Reach Excavator", "Heavy Machinery", "Extended-reach excavator enquiry for deep drainage, canal and slope work.", "https://s7d2.scene7.com/is/image/Caterpillar/CM20190122-54827-01440?wid=800"),
  item("rt-wheel-excavator", "Wheeled Excavator", "Heavy Machinery", "Road-friendly excavator for urban utilities and work requiring frequent relocation.", "https://s7d2.scene7.com/is/image/Caterpillar/CM20160701-43726-32768?hei=504&op_sharpen=1&qlt=100&wid=752"),
  item("rt-wheel-loader", "Wheel Loader", "Heavy Machinery", "Wheel loader for stockpiles, truck loading, aggregate handling and backfilling.", "https://admin.phuthaicat.com.vn/uploads/xuc_lat_banh_lop_Cat_950_6da60bd305.jpg", "Bucket capacity TBC"),
  item("rt-backhoe-loader", "Backhoe Loader", "Heavy Machinery", "Combined front loader and rear excavator for road, utility and general construction.", "https://s7d2.scene7.com/is/image/Caterpillar/CM20220602-21cd7-1b7d3?%24cc-g%24=&fmt=pjpeg"),
  item("rt-bulldozer", "Bulldozer", "Heavy Machinery", "Tracked dozer for pushing, clearing, rough grading and bulk earthworks.", "https://s7d2.scene7.com/is/image/Caterpillar/CM20200528-f6126-c18a7"),
  item("rt-motor-grader", "Motor Grader", "Heavy Machinery", "Precision grading machine for road formation, shoulders and site finishing.", "https://s7d2.scene7.com/is/image/Caterpillar/CM20170522-31778-11854?%24cc-g%24=&fmt=pjpeg"),
  item("rt-skid-steer", "Skid-Steer Loader", "Heavy Machinery", "Compact loader for material movement, cleanup and attachment-based site work.", "https://s7d2.scene7.com/is/image/Caterpillar/CM20190805-777f3-2690b?%24cc-pdp-t5%24=&fmt=pjpeg"),
  item("rt-track-loader", "Compact Track Loader", "Heavy Machinery", "Tracked compact loader for uneven ground, loading and site preparation.", "https://s7d2.scene7.com/is/image/Caterpillar/CM20200528-f6126-c18a7"),
  item("rt-articulated-dump-truck", "Articulated Dump Truck", "Heavy Machinery", "Off-road articulated hauler for moving bulk material across demanding sites.", "https://s7d2.scene7.com/is/image/Caterpillar/CM20180618-58323-54462"),
  item("rt-site-dumper", "Site Dumper", "Heavy Machinery", "Compact dumper for moving soil, aggregate and construction material around site.", "https://www.bauforum24.biz/uploads/2015/08/post-1166-1438774937.jpg"),
  item("rt-tipper-truck", "Tipper Truck", "Heavy Machinery", "Tipper truck enquiry for earth, sand, aggregate and construction waste transport.", "https://cdn.motorbazee.com/ImageData/model/800x600/183372.jpg"),

  // Construction, concrete and demolition
  item("rt-concrete-mixer", "Concrete Mixer", "Construction Equipment", "Site mixer for small pours, mortar preparation and general concrete work.", "https://www.kiloutou.com/content/uploads/sites/19/2024/10/30507-1024x1024.png"),
  item("rt-transit-mixer", "Transit Mixer Truck", "Construction Equipment", "Truck-mounted mixer enquiry for ready-mix concrete delivery to project sites.", "https://ik.imagekit.io/TrucksBuses/uploads/4253_eicher-pro-6028-tm-transit-mixer-truck.jpg"),
  item("rt-concrete-pump", "Concrete Pump", "Construction Equipment", "Concrete pumping solution for elevated, remote or high-volume pours.", "https://www.putzmeister.com/documents/20127/71383/EU_MEA_AP_Concrete_M38_01_1000x500.jpg/07d21b44-89ff-f915-989c-3ff02c89ffdc?imagePreview=1&t=1644906638061&version=3.0"),
  item("rt-concrete-vibrator", "Concrete Vibrator", "Construction Equipment", "Immersion vibrator enquiry for compacting fresh concrete and reducing air pockets.", "https://edge.sitecorecloud.io/kennardshire-c0u30dz6/media/KennardsHire/products/9005198/9005198-WACKER-NEUSON-IRFU3823015-CONCRETE-VIBRATOR-UNIT--38MM-15IN-ELECTRIC-15MDEEP-ETCHED.jpg"),
  item("rt-power-trowel", "Power Trowel", "Construction Equipment", "Concrete finishing machine for smoothing and finishing slab surfaces.", "https://liftek.com.au/cdn/shop/products/CT48_2.jpg?v=1656302952"),
  item("rt-road-cutter", "Road Cutter", "Construction Equipment", "Walk-behind cutter enquiry for controlled cutting of concrete and asphalt.", "https://greenriverrental.com/assets/product-images/big/24%20saw%202-0.png"),
  item("rt-core-drill", "Diamond Core Drill", "Construction Equipment", "Core drilling equipment for clean circular penetrations in concrete and masonry.", "https://static.wixstatic.com/media/8b3d80_900177518b9446c0878f1eae683dc033~mv2.webp/v1/fill/w_1900%2Ch_1900%2Cal_c/8b3d80_900177518b9446c0878f1eae683dc033~mv2.webp"),
  item("rt-demolition-breaker", "Excavator Breaker", "Construction Equipment", "Excavator-mounted breaker enquiry for rock, reinforced concrete and demolition.", "https://reynaud-location.fr/images/produits/11/11/7.jpeg"),
  item("rt-breaker-hammer", "Demolition Breaker Hammer", "Power Tools", "Heavy electric breaker for concrete demolition, floor breaking and trench work.", "https://reynaud-location.fr/images/produits/11/11/7.jpeg"),
  item("rt-tower-scaffold", "Mobile Scaffold Tower", "Construction Equipment", "Modular access tower enquiry; height, platform and configuration confirmed per job.", "https://media.hornbach.de/mp/packshot/1180ccd0-d42b-4585-94cd-f6cc92638a91?size=1400"),

  // Working at height
  item("rt-scissor-lift", "Scissor Lift", "Aerial Access", "Vertical personnel platform enquiry for installation, maintenance and indoor or outdoor access.", "https://icrsupply.com/cdn/shop/files/B_52d76056-1ad7-4fcf-97b2-ee7075bf99ca.jpg?v=1733905411&width=1946"),
  item("rt-articulating-boom-lift", "Articulating Boom Lift", "Aerial Access", "Articulating access platform for elevated work around obstacles and structures.", "https://img.directindustry.com/images_di/photo-g/9090-7253123.jpg"),
  item("rt-telescopic-boom-lift", "Telescopic Boom Lift", "Aerial Access", "Straight-boom access platform enquiry for extended horizontal and vertical reach.", "https://img.directindustry.com/images_di/photo-g/9090-13006056.webp"),
  item("rt-personnel-lift", "Personnel Lift", "Aerial Access", "Compact vertical access lift enquiry for indoor maintenance and installation tasks.", "https://img.directindustry.com/pt/images_di/photo-g/9090-20376441.jpg"),

  // Compaction and roadwork
  item("rt-single-drum-roller", "Single-Drum Roller", "Compaction & Roadwork", "Ride-on roller enquiry for soil and sub-base compaction.", "https://cdn.mediapool.wackerneusongroup.com/image/491085414967/image_vv0m7qr14555v91919k9jp8k0p/-S1920x768-FWEBP"),
  item("rt-double-drum-roller", "Double-Drum Roller", "Compaction & Roadwork", "Tandem vibratory roller enquiry for asphalt and road-surface compaction.", "https://cdn.mediapool.wackerneusongroup.com/image/491085414967/image_gmo8rp98ol5gv6rlgnir6ha248/-S720x480-FWEBP"),
  item("rt-plate-compactor", "Plate Compactor", "Compaction & Roadwork", "Walk-behind plate compactor for paving, trenches and granular surfaces.", "https://storage.keepital.com/public/company/sg/t/e/tenda-construction-equipment-pte-ltd/images/product/wacker-neuson-single-direction-vibratory-plate-compactor/pic-03.jpg"),
  item("rt-tamping-rammer", "Tamping Rammer", "Compaction & Roadwork", "Jumping-jack rammer enquiry for cohesive soil and confined trench compaction.", "https://cdn.mediapool.wackerneusongroup.com/image/491085414967/image_e3p4l9qd5d3mr9tra789n3592m/-B720-FWEBP"),
  item("rt-asphalt-paver", "Asphalt Paver", "Compaction & Roadwork", "Road paver enquiry for laying asphalt on road and infrastructure projects.", "https://s7d2.scene7.com/is/image/Caterpillar/C10885594"),
  item("rt-trencher", "Trencher", "Compaction & Roadwork", "Trenching machine enquiry for narrow utility, irrigation and cable trenches.", "https://acropolis-wp-content-uploads.s3.us-west-1.amazonaws.com/36-inch-walk-behind-trencher-25-16.png"),

  // Material handling and lifting
  item("rt-forklift-diesel", "Diesel Forklift", "Material Handling", "Counterbalance forklift enquiry for outdoor yards, containers and heavy pallet handling.", "https://cdn.toyota-forklifts.eu/globalassets/inriver/resources/tonero_tc_2019_left_35t.jpg?autorotate=true&preset=Small"),
  item("rt-forklift-electric", "Electric Forklift", "Material Handling", "Electric forklift enquiry for warehouses and indoor material movement.", "https://toyotaforklift.scene7.com/is/image/toyotamh/Stand-Up-Rider_8FBA15-25U_Studio_3?dpr=off&qlt=85&ts=1776085209211"),
  item("rt-telehandler", "Telehandler", "Material Handling", "Telehandler enquiry for lifting and placing loads at height and reach.", "https://img.forconstructionpros.com/files/base/acbm/fcp/image/2015/11/JLG_G15_44A_2.5643b824564e3.png?auto=format%2Ccompress&h=630&q=70&w=1200"),
  item("rt-pallet-truck", "Electric Pallet Truck", "Material Handling", "Powered pallet truck enquiry for warehouse and loading-bay operations.", "https://cdn.toyotamaterialhandling.com.au/azapp-umbraco-prod-tmha-002/ftedhe51/stmh0213_tmha_lwi160_electricpalletjack_web_1_800x800.jpg"),
  item("rt-mobile-crane", "Mobile Crane", "Material Handling", "Mobile crane enquiry; lifting plan, capacity, radius and certified operator requirements assessed per lift.", "https://www-assets.liebherr.com/media/bu-media/lhbu-lwe/images/subhome/liebherr-ltm-1920x1920-1_w736.jpg"),
  item("rt-truck-mounted-crane", "Truck-Mounted Crane", "Material Handling", "Vehicle-mounted crane enquiry for delivery, unloading and site lifting operations.", "https://www.machmall.com/images/store/357636/item/SQ127K3Q%201%20%285%29.jpg"),
  item("rt-chain-block-hoist", "Chain Block Hoist", "Lifting Equipment", "Manual chain hoist enquiry for controlled lifting and positioning in workshops and on site.", "https://cdn.shopify.com/s/files/1/1864/7093/products/electric-chain-hosit-cpe_d4e10261-c15b-4c51-ade2-3b9717cb5b94.png?v=1548334312", "Safe working load TBC"),
  item("rt-electric-hoist", "Electric Chain Hoist", "Lifting Equipment", "Powered hoist enquiry for workshop, fabrication and industrial lifting tasks.", "https://www.hebetechnik.at/images/stories/produkte/hebezeuge/eletrokettenzuege_und_druckluftkettenzuege/CPEF_2023.jpg"),
  item("rt-lifting-gantry", "Portable Lifting Gantry", "Lifting Equipment", "Portable gantry enquiry for maintenance and equipment positioning.", "https://cdn11.bigcommerce.com/s-f25f8/images/stencil/1280x1280/products/8081/27913/Porta-Gantry-US-PGSS__62669.1756323465.jpg?c=2%3Fimbypass%3Don"),

  // Power, air and utilities
  item("rt-diesel-generator", "Diesel Generator", "Generators & Power", "Canopied diesel generator enquiry for temporary site power and backup supply.", "https://cdn.mediapool.wackerneusongroup.com/image/491085414967/image_idcbc9v94p09lagqcv4mbqcg3l/-S720x480-FWEBP", "kVA rating confirmed per load"),
  item("rt-portable-generator", "Portable Generator", "Generators & Power", "Portable generator enquiry for tools, small sites and temporary power.", "https://cdn.mediapool.wackerneusongroup.com/image/491085414967/image_idcbc9v94p09lagqcv4mbqcg3l/-S720x480-FWEBP"),
  item("rt-light-tower", "Mobile Light Tower", "Generators & Power", "Mobile lighting tower enquiry for night shifts, roadworks and outdoor sites.", "https://webapp.atlascopco.com/Calculators/HiLight-H6-3Dtool/images/Hilight_H6plus_atlas_4.png"),
  item("rt-distribution-board", "Temporary Distribution Board", "Generators & Power", "Temporary electrical distribution equipment enquiry; ratings and protection confirmed per site.", "https://www.omteklussen.nl/media/catalog/product/cache/1/image/1200x1200/9df78eab33525d08d6e5fb8d27136e95/b/r/brennenstuhl_bsv4-4007123654253-1.jpg"),
  item("rt-air-compressor", "Portable Air Compressor", "Compressors", "Compressor enquiry for pneumatic tools, spraying, blasting and site air supply.", "https://www.atlascopco.com/content/dam/atlas-copco/local-countries/australia/images/power-technique/8series-overview-new.png/jcr%3Acontent/renditions/cq5dam.web.1200.628.png", "Pressure / CFM confirmed per tool"),
  item("rt-diesel-compressor", "Diesel Air Compressor", "Compressors", "Towable diesel compressor enquiry for remote worksites and heavy pneumatic tools.", "https://media.baumpub.com/files/slides/locale_image/full/0127/31613_en_85891_34493_atlas-copco-xas-88.jpg"),
  item("rt-welding-generator", "Engine-Driven Welding Generator", "Welding & Industrial", "Engine-driven welding set enquiry for field fabrication and remote maintenance.", "https://canadaweldingsupply.ca/cdn/shop/files/Miller_Build_With_Blue_2025-Q1_-_Miller_Bobcat_265_Kohler_-_4.png?v=1775059060&width=1024"),
  item("rt-arc-welding-machine", "ARC Welding Machine", "Welding & Industrial", "ARC welding set enquiry for structural fabrication, repair and maintenance.", "https://www.airgas.com/medias/CM-000000NY20-Product-LINK3068-2-1200Wx1200H?context=bWFzdGVyfHByb2R1Y3R8MzQ0NDkxfGltYWdlL2pwZWd8cHJvZHVjdC9oMzAvaDVjLzEyMDYzMTk1MzMyNjM4LmpwZ3xkNWVkYmYxOTY2NTZhODAwY2YxYTUxOWMyMTQ2MjhlYjBmYTJkM2VhM2ZhOTcwOWMwZDM5ZWNlYjdiOWU2NTg3"),
  item("rt-mig-welder", "MIG Welding Machine", "Welding & Industrial", "MIG welding equipment enquiry for workshop fabrication and production work.", "https://www.airgas.com/medias/CM-000000NY20-Product-LINK3068-2-1200Wx1200H?context=bWFzdGVyfHByb2R1Y3R8MzQ0NDkxfGltYWdlL2pwZWd8cHJvZHVjdC9oMzAvaDVjLzEyMDYzMTk1MzMyNjM4LmpwZ3xkNWVkYmYxOTY2NTZhODAwY2YxYTUxOWMyMTQ2MjhlYjBmYTJkM2VhM2ZhOTcwOWMwZDM5ZWNlYjdiOWU2NTg3"),
  item("rt-plasma-cutter", "Plasma Cutter", "Welding & Industrial", "Plasma cutting equipment enquiry for conductive metal cutting and fabrication.", "https://cdn10.bigcommerce.com/s-o9m4t/products/104/images/542/65__68698.1410872057.1280.1280.jpg?c=2"),

  // Pumps, water and site support
  item("rt-submersible-pump", "Submersible Pump", "Pumps & Water Management", "Submersible pump enquiry for pits, basements, trenches and groundwater removal.", "https://www.gt-outillage.com/medias/2024/08/product_9109106hd.jpg.webp"),
  item("rt-trash-pump", "Trash Pump", "Pumps & Water Management", "Solids-handling pump enquiry for muddy water, construction runoff and slurry.", "https://www.grindex.com/siteassets/grindex-media/home/sludge_family4727.jpg"),
  item("rt-diesel-water-pump", "Diesel Water Pump", "Pumps & Water Management", "Diesel-driven pump enquiry for water transfer and remote dewatering.", "https://www.grindex.com/siteassets/grindex-media/home/slurry_family4727.jpg"),
  item("rt-high-pressure-washer", "High-Pressure Washer", "Pumps & Water Management", "High-pressure cleaning equipment enquiry for machinery, floors and site cleanup.", "https://s1.kaercher-media.com/mam/93986830/mainproduct/100697/d0.jpg"),
  item("rt-water-tanker", "Water Tanker", "Site Equipment", "Water bowser enquiry for dust suppression, roadworks and site water distribution.", "https://cdn.kuwaitmechano.com/webp/1669154210_1246083282.webp"),
  item("rt-fuel-tank", "Bunded Fuel Tank", "Site Equipment", "Temporary fuel storage enquiry; capacity, bunding and site compliance confirmed per project.", "https://www.scintex.com.au/cdn/shop/articles/Screen_Shot_2026-03-25_at_10.24.36_am_875x747_crop_center.png?v=1774399254"),
  item("rt-traffic-barrier", "Traffic Barriers", "Site Equipment", "Work-zone traffic control equipment enquiry for construction and road maintenance.", "https://jack-win.com/cdn/shop/files/water-filled-jersey-barriers.jpg?v=1730097580&width=800"),
  item("rt-site-container", "Site Storage Container", "Site Equipment", "Secure temporary storage container enquiry for tools, materials and site equipment.", "https://portableofficecabin.com/_next/static/media/container-project-2.65fd3a35.jpg"),
  item("rt-angle-grinder-set", "Angle Grinder", "Power Tools", "Angle grinder enquiry for cutting, grinding and surface preparation.", "https://cdn.luxuryloyalty.com/media/product/list/21ec1eab-0a20-4a2f-a5de-ab88ae229104.jpg"),
  item("rt-cutoff-saw", "Cut-Off Saw", "Power Tools", "Portable cut-off saw enquiry for masonry, concrete and metal cutting.", "https://www.powertoolworld.co.uk/media/catalog/product/cache/0116182253c5f60b6fc682c7434d441c/m/a/makdce090zx1_1_1.jpg"),
  item("rt-rotary-hammer", "Rotary Hammer Drill", "Power Tools", "Rotary hammer enquiry for drilling anchors and fixing into concrete and masonry.", "https://dtis8tdmkp4fg.cloudfront.net/products/corded/corded-power-tools/drills-fastening/rotary-hammers/hr1841f/hr1841f-001.jpg"),
  item("rt-floor-scrubber", "Industrial Floor Scrubber", "Site Equipment", "Walk-behind or ride-on scrubber enquiry for cleaning industrial and commercial floors.", "https://www.karcherwebshop-agron.nl/file/d0-%28104%29.jpg"),
  item("rt-air-mover", "Industrial Air Mover", "Site Equipment", "High-volume air mover enquiry for ventilation, drying and temporary site airflow.", "https://www.lawson-his.co.uk/media/catalog/product/cache/1/image/1200x/040ec09b1e35df139433887a97daa66f/_/c/_clarke-cam500-20inch-ventilator-blue-3230242.jpg"),
  item("rt-wood-chipper", "Wood Chipper", "Site Equipment", "Chipper enquiry for landscaping, vegetation management and green-waste reduction.", "https://www.fbc-agriculture.com/files/484018/x40018vehwri.webp"),
];

export async function fetchRentalItems(): Promise<RentalItem[]> {
  return [...rentalItems];
}
