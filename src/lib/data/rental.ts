/**
 * Manufacturer-hosted product reference images are used for visual identification only;
 * they are not photographs of Al Safwa-owned units and do not confirm local availability.
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
  item("rt-excavator-20t", "https://s7d2.scene7.com/is/image/Caterpillar/CM20170417-48239-28017?%24cc-pdp-t5%24=&fmt=pjpeg", "Heavy Machinery", "Tracked excavator for bulk excavation, trenching, foundations and site preparation.", "/images/home-rental-excavator.webp", "20-ton class · final size TBC"),
  item("rt-mini-excavator", "https://s7d2.scene7.com/is/image/Caterpillar/CM20210820-b09f2-ba5c8?%24hero-cc-t1%24=", "Heavy Machinery", "Compact excavator for utilities, landscaping, confined sites and light excavation.", "/images/02-heavy-machinery.png"),
  item("rt-long-reach-excavator", "https://s7d2.scene7.com/is/image/Caterpillar/CM20170417-48239-28017?%24cc-pdp-t5%24=&fmt=pjpeg", "Heavy Machinery", "Extended-reach excavator enquiry for deep drainage, canal and slope work.", "/images/02-heavy-machinery.png"),
  item("rt-wheel-excavator", "https://s7d2.scene7.com/is/image/Caterpillar/CM20170417-48239-28017?%24cc-pdp-t5%24=&fmt=pjpeg", "Heavy Machinery", "Road-friendly excavator for urban utilities and work requiring frequent relocation.", "/images/02-heavy-machinery.png"),
  item("rt-wheel-loader", "https://s7d2.scene7.com/is/image/Caterpillar/CM20250728-2ec16-cef50?%24cc-pdp-t5%24=&fmt=pjpeg", "Heavy Machinery", "Wheel loader for stockpiles, truck loading, aggregate handling and backfilling.", "/images/02-heavy-machinery.png", "Bucket capacity TBC"),
  item("rt-backhoe-loader", "https://s7d2.scene7.com/is/image/Caterpillar/CM20210820-b09f2-ba5c8?%24hero-cc-t1%24=", "Heavy Machinery", "Combined front loader and rear excavator for road, utility and general construction.", "/images/02-heavy-machinery.png"),
  item("rt-bulldozer", "https://s7d2.scene7.com/is/image/Caterpillar/CM20180928-34732-61567?%24cc-pdp-t5%24=&fmt=pjpeg", "Heavy Machinery", "Tracked dozer for pushing, clearing, rough grading and bulk earthworks.", "/images/02-heavy-machinery.png"),
  item("rt-motor-grader", "https://s7d2.scene7.com/is/image/Caterpillar/CM20260317-1883c-4dd96?%24hero-cc-t1%24=", "Heavy Machinery", "Precision grading machine for road formation, shoulders and site finishing.", "/images/02-heavy-machinery.png"),
  item("rt-skid-steer", "https://s7d2.scene7.com/is/image/Caterpillar/CM20210820-b09f2-ba5c8?%24hero-cc-t1%24=", "Heavy Machinery", "Compact loader for material movement, cleanup and attachment-based site work.", "/images/02-heavy-machinery.png"),
  item("rt-track-loader", "https://s7d2.scene7.com/is/image/Caterpillar/CM20210820-b09f2-ba5c8?%24hero-cc-t1%24=", "Heavy Machinery", "Tracked compact loader for uneven ground, loading and site preparation.", "/images/02-heavy-machinery.png"),
  item("rt-articulated-dump-truck", "https://s7d2.scene7.com/is/image/Caterpillar/CM20180928-34732-61567?%24cc-pdp-t5%24=&fmt=pjpeg", "Heavy Machinery", "Off-road articulated hauler for moving bulk material across demanding sites.", "/images/02-heavy-machinery.png"),
  item("rt-site-dumper", "https://www.wackerneuson.com/media/_processed_/d/2/csm_THE_Original_Gravel_gross_d4635d0d3b.jpg", "Heavy Machinery", "Compact dumper for moving soil, aggregate and construction material around site.", "/images/02-heavy-machinery.png"),
  item("rt-tipper-truck", "https://s7d2.scene7.com/is/image/Caterpillar/CM20180928-34732-61567?%24cc-pdp-t5%24=&fmt=pjpeg", "Heavy Machinery", "Tipper truck enquiry for earth, sand, aggregate and construction waste transport.", "/images/02-heavy-machinery.png"),

  // Construction, concrete and demolition
  item("rt-concrete-mixer", "https://www.wackerneuson.com/media/_processed_/d/5/csm_DPU110r_A01_6bc6534f81.jpg", "Construction Equipment", "Site mixer for small pours, mortar preparation and general concrete work.", "/images/16-rental-equipment.png"),
  item("rt-transit-mixer", "https://www.wackerneuson.com/media/_processed_/d/5/csm_DPU110r_A01_6bc6534f81.jpg", "Construction Equipment", "Truck-mounted mixer enquiry for ready-mix concrete delivery to project sites.", "/images/16-rental-equipment.png"),
  item("rt-concrete-pump", "https://www.grindex.com/siteassets/grindex-media/home/sludge_family4727.jpg", "Construction Equipment", "Concrete pumping solution for elevated, remote or high-volume pours.", "/images/16-rental-equipment.png"),
  item("rt-concrete-vibrator", "https://www.wackerneuson.com/media/_processed_/8/4/csm_WN_EMEA_image_AS60e_EZ17e_action_ae150886bb.jpg", "Construction Equipment", "Immersion vibrator enquiry for compacting fresh concrete and reducing air pockets.", "/images/01-power-tools.png"),
  item("rt-power-trowel", "https://www.wackerneuson.com/media/_processed_/d/5/csm_DPU110r_A01_6bc6534f81.jpg", "Construction Equipment", "Concrete finishing machine for smoothing and finishing slab surfaces.", "/images/16-rental-equipment.png"),
  item("rt-road-cutter", "https://www.jlg.com/dfsmedia/e4042b10c9ce4595b4cc059f1299f079/148258-source/boom-lifts-articulating-plp-series-110124", "Construction Equipment", "Walk-behind cutter enquiry for controlled cutting of concrete and asphalt.", "/images/09-cutting-and-grinding.png"),
  item("rt-core-drill", "https://www.wackerneuson.com/media/_processed_/8/4/csm_WN_EMEA_image_AS60e_EZ17e_action_ae150886bb.jpg", "Construction Equipment", "Core drilling equipment for clean circular penetrations in concrete and masonry.", "/images/01-power-tools.png"),
  item("rt-demolition-breaker", "https://s7d2.scene7.com/is/image/Caterpillar/CM20180928-34732-61567?%24cc-pdp-t5%24=&fmt=pjpeg", "Construction Equipment", "Excavator-mounted breaker enquiry for rock, reinforced concrete and demolition.", "/images/02-heavy-machinery.png"),
  item("rt-breaker-hammer", "https://www.wackerneuson.com/media/_processed_/8/4/csm_WN_EMEA_image_AS60e_EZ17e_action_ae150886bb.jpg", "Power Tools", "Heavy electric breaker for concrete demolition, floor breaking and trench work.", "/images/01-power-tools.png"),
  item("rt-tower-scaffold", "https://www.jlg.com/_next/image?q=75&url=%2Fdfsmedia%2Fe4042b10c9ce4595b4cc059f1299f079%2F148258-source%2Fboom-lifts-articulating-plp-series-110124&w=640", "Construction Equipment", "Modular access tower enquiry; height, platform and configuration confirmed per job.", "/images/16-rental-equipment.png"),

  // Working at height
  item("rt-scissor-lift", "https://dam.jlg.com/DigizuiteCore/LegacyService/api/assetstream/148591/-1.jpg?timestamp=2026-02-16T08%3A17%3A30.4871856", "Aerial Access", "Vertical personnel platform enquiry for installation, maintenance and indoor or outdoor access.", "/images/12-lifting-and-material-handling.png"),
  item("rt-articulating-boom-lift", "https://www.jlg.com/dfsmedia/e4042b10c9ce4595b4cc059f1299f079/148258-source/boom-lifts-articulating-plp-series-110124", "Aerial Access", "Articulating access platform for elevated work around obstacles and structures.", "/images/12-lifting-and-material-handling.png"),
  item("rt-telescopic-boom-lift", "https://www.jlg.com/dfsmedia/e4042b10c9ce4595b4cc059f1299f079/148254-source/boom-lifts-telescopic-plp-series-110124", "Aerial Access", "Straight-boom access platform enquiry for extended horizontal and vertical reach.", "/images/12-lifting-and-material-handling.png"),
  item("rt-personnel-lift", "https://www.jlg.com/dfsmedia/e4042b10c9ce4595b4cc059f1299f079/148255-source/boom-lifts-compact-crawlers-plp-series-110124", "Aerial Access", "Compact vertical access lift enquiry for indoor maintenance and installation tasks.", "/images/12-lifting-and-material-handling.png"),

  // Compaction and roadwork
  item("rt-single-drum-roller", "https://cdn.mediapool.wackerneusongroup.com/image/491085414967/image_vv0m7qr14555v91919k9jp8k0p/-S1920x768-FWEBP", "Compaction & Roadwork", "Ride-on roller enquiry for soil and sub-base compaction.", "/images/02-heavy-machinery.png"),
  item("rt-double-drum-roller", "https://cdn.mediapool.wackerneusongroup.com/image/491085414967/image_p5n59ah75t1db8ks5mteu6co2c/-S1920x768-FWEBP", "Compaction & Roadwork", "Tandem vibratory roller enquiry for asphalt and road-surface compaction.", "/images/02-heavy-machinery.png"),
  item("rt-plate-compactor", "https://www.wackerneuson.com/media/_processed_/d/5/csm_DPU110r_A01_6bc6534f81.jpg", "Compaction & Roadwork", "Walk-behind plate compactor for paving, trenches and granular surfaces.", "/images/16-rental-equipment.png"),
  item("rt-tamping-rammer", "https://www.wackerneuson.com/media/_processed_/8/4/csm_WN_EMEA_image_AS60e_EZ17e_action_ae150886bb.jpg", "Compaction & Roadwork", "Jumping-jack rammer enquiry for cohesive soil and confined trench compaction.", "/images/16-rental-equipment.png"),
  item("rt-asphalt-paver", "https://cdn.mediapool.wackerneusongroup.com/image/491085414967/image_p5n59ah75t1db8ks5mteu6co2c/-S1920x768-FWEBP", "Compaction & Roadwork", "Road paver enquiry for laying asphalt on road and infrastructure projects.", "/images/02-heavy-machinery.png"),
  item("rt-trencher", "https://s7d2.scene7.com/is/image/Caterpillar/CM20170417-48239-28017?%24cc-pdp-t5%24=&fmt=pjpeg", "Compaction & Roadwork", "Trenching machine enquiry for narrow utility, irrigation and cable trenches.", "/images/02-heavy-machinery.png"),

  // Material handling and lifting
  item("rt-forklift-diesel", "https://toyotaforklift.scene7.com/is/image/toyotamh/Core%20Diesel%20Pneumatic_40-8FDU32_Studio_41?%24300x250%24=", "Material Handling", "Counterbalance forklift enquiry for outdoor yards, containers and heavy pallet handling.", "/images/12-lifting-and-material-handling.png"),
  item("rt-forklift-electric", "https://toyotaforklift.scene7.com/is/image/toyotamh/3-Wheel%20Electric_8FBE20U_Studio_6?%24300x250%24=", "Material Handling", "Electric forklift enquiry for warehouses and indoor material movement.", "/images/12-lifting-and-material-handling.png"),
  item("rt-telehandler", "https://www.jlg.com/dfsmedia/e4042b10c9ce4595b4cc059f1299f079/148254-source/boom-lifts-telescopic-plp-series-110124", "Material Handling", "Telehandler enquiry for lifting and placing loads at height and reach.", "/images/12-lifting-and-material-handling.png"),
  item("rt-pallet-truck", "https://toyotaforklift.scene7.com/is/image/toyotamh/Electric%20Walkie%20Pallet%20Jack_navigation?dpr=off&qlt=85&ts=1776779028957", "Material Handling", "Powered pallet truck enquiry for warehouse and loading-bay operations.", "/images/12-lifting-and-material-handling.png"),
  item("rt-mobile-crane", "https://s7d2.scene7.com/is/image/Caterpillar/CM20180928-34732-61567?%24cc-pdp-t5%24=&fmt=pjpeg", "Material Handling", "Mobile crane enquiry; lifting plan, capacity, radius and certified operator requirements assessed per lift.", "/images/12-lifting-and-material-handling.png"),
  item("rt-truck-mounted-crane", "https://s7d2.scene7.com/is/image/Caterpillar/CM20180928-34732-61567?%24cc-pdp-t5%24=&fmt=pjpeg", "Material Handling", "Vehicle-mounted crane enquiry for delivery, unloading and site lifting operations.", "/images/12-lifting-and-material-handling.png"),
  item("rt-chain-block-hoist", "https://toyotaforklift.scene7.com/is/image/toyotamh/Electric%20Walkie%20Pallet%20Jack_navigation?dpr=off&qlt=85&ts=1776779028957", "Lifting Equipment", "Manual chain hoist enquiry for controlled lifting and positioning in workshops and on site.", "/images/12-lifting-and-material-handling.png", "Safe working load TBC"),
  item("rt-electric-hoist", "https://toyotaforklift.scene7.com/is/image/toyotamh/Electric%20Walkie%20Pallet%20Jack_navigation?dpr=off&qlt=85&ts=1776779028957", "Lifting Equipment", "Powered hoist enquiry for workshop, fabrication and industrial lifting tasks.", "/images/12-lifting-and-material-handling.png"),
  item("rt-lifting-gantry", "https://toyotaforklift.scene7.com/is/image/toyotamh/Core%20Diesel%20Pneumatic_40-8FDU32_Studio_41?%24300x250%24=", "Lifting Equipment", "Portable gantry enquiry for maintenance and equipment positioning.", "/images/12-lifting-and-material-handling.png"),

  // Power, air and utilities
  item("rt-diesel-generator", "https://s7d2.scene7.com/is/image/Caterpillar/CM20250728-2ec16-cef50?%24cc-pdp-t5%24=&fmt=pjpeg", "Generators & Power", "Canopied diesel generator enquiry for temporary site power and backup supply.", "/images/04-generators.png", "kVA rating confirmed per load"),
  item("rt-portable-generator", "https://s7d2.scene7.com/is/image/Caterpillar/CM20250728-2ec16-cef50?%24cc-pdp-t5%24=&fmt=pjpeg", "Generators & Power", "Portable generator enquiry for tools, small sites and temporary power.", "/images/04-generators.png"),
  item("rt-light-tower", "https://www.jlg.com/dfsmedia/e4042b10c9ce4595b4cc059f1299f079/148255-source/boom-lifts-compact-crawlers-plp-series-110124", "Generators & Power", "Mobile lighting tower enquiry for night shifts, roadworks and outdoor sites.", "/images/04-generators.png"),
  item("rt-distribution-board", "https://toyotaforklift.scene7.com/is/image/toyotamh/3-Wheel%20Electric_8FBE20U_Studio_6?%24300x250%24=", "Generators & Power", "Temporary electrical distribution equipment enquiry; ratings and protection confirmed per site.", "/images/14-electrical-equipment.png"),
  item("rt-air-compressor", "https://www.atlascopco.com/en-pk/construction-equipment/campaign-portable-air/e-air-electric-mobile-compressors", "Compressors", "Compressor enquiry for pneumatic tools, spraying, blasting and site air supply.", "/images/05-air-compressors.png", "Pressure / CFM confirmed per tool"),
  item("rt-diesel-compressor", "https://www.atlascopco.com/en-pk/construction-equipment/campaign-portable-air/e-air-electric-mobile-compressors", "Compressors", "Towable diesel compressor enquiry for remote worksites and heavy pneumatic tools.", "/images/05-air-compressors.png"),
  item("rt-welding-generator", "https://www.wackerneuson.com/media/_processed_/d/2/csm_THE_Original_Gravel_gross_d4635d0d3b.jpg", "Welding & Industrial", "Engine-driven welding set enquiry for field fabrication and remote maintenance.", "/images/03-welding-equipment.png"),
  item("rt-arc-welding-machine", "https://www.wackerneuson.com/media/_processed_/8/4/csm_WN_EMEA_image_AS60e_EZ17e_action_ae150886bb.jpg", "Welding & Industrial", "ARC welding set enquiry for structural fabrication, repair and maintenance.", "/images/03-welding-equipment.png"),
  item("rt-mig-welder", "https://www.wackerneuson.com/media/_processed_/8/4/csm_WN_EMEA_image_AS60e_EZ17e_action_ae150886bb.jpg", "Welding & Industrial", "MIG welding equipment enquiry for workshop fabrication and production work.", "/images/03-welding-equipment.png"),
  item("rt-plasma-cutter", "https://www.wackerneuson.com/media/_processed_/8/4/csm_WN_EMEA_image_AS60e_EZ17e_action_ae150886bb.jpg", "Welding & Industrial", "Plasma cutting equipment enquiry for conductive metal cutting and fabrication.", "/images/09-cutting-and-grinding.png"),

  // Pumps, water and site support
  item("rt-submersible-pump", "https://www.grindex.com/siteassets/grindex-media/home/drainage_family4727.jpg", "Pumps & Water Management", "Submersible pump enquiry for pits, basements, trenches and groundwater removal.", "/images/08-motors-and-pumps.png"),
  item("rt-trash-pump", "https://www.grindex.com/siteassets/grindex-media/home/sludge_family4727.jpg", "Pumps & Water Management", "Solids-handling pump enquiry for muddy water, construction runoff and slurry.", "/images/08-motors-and-pumps.png"),
  item("rt-diesel-water-pump", "https://www.grindex.com/siteassets/grindex-media/home/slurry_family4727.jpg", "Pumps & Water Management", "Diesel-driven pump enquiry for water transfer and remote dewatering.", "/images/08-motors-and-pumps.png"),
  item("rt-high-pressure-washer", "https://www.grindex.com/siteassets/grindex-media/home/drainage_family4727.jpg", "Pumps & Water Management", "High-pressure cleaning equipment enquiry for machinery, floors and site cleanup.", "/images/13-cleaning-equipment.png"),
  item("rt-water-tanker", "https://s7d2.scene7.com/is/image/Caterpillar/CM20180928-34732-61567?%24cc-pdp-t5%24=&fmt=pjpeg", "Site Equipment", "Water bowser enquiry for dust suppression, roadworks and site water distribution.", "/images/16-rental-equipment.png"),
  item("rt-fuel-tank", "https://s7d2.scene7.com/is/image/Caterpillar/CM20250728-2ec16-cef50?%24cc-pdp-t5%24=&fmt=pjpeg", "Site Equipment", "Temporary fuel storage enquiry; capacity, bunding and site compliance confirmed per project.", "/images/16-rental-equipment.png"),
  item("rt-traffic-barrier", "https://www.jlg.com/dfsmedia/e4042b10c9ce4595b4cc059f1299f079/148258-source/boom-lifts-articulating-plp-series-110124", "Site Equipment", "Work-zone traffic control equipment enquiry for construction and road maintenance.", "/images/16-rental-equipment.png"),
  item("rt-site-container", "https://s7d2.scene7.com/is/image/Caterpillar/CM20250728-2ec16-cef50?%24cc-pdp-t5%24=&fmt=pjpeg", "Site Equipment", "Secure temporary storage container enquiry for tools, materials and site equipment.", "/images/16-rental-equipment.png"),
  item("rt-angle-grinder-set", "https://www.wackerneuson.com/media/_processed_/8/4/csm_WN_EMEA_image_AS60e_EZ17e_action_ae150886bb.jpg", "Power Tools", "Angle grinder enquiry for cutting, grinding and surface preparation.", "/images/09-cutting-and-grinding.png"),
  item("rt-cutoff-saw", "https://www.wackerneuson.com/media/_processed_/8/4/csm_WN_EMEA_image_AS60e_EZ17e_action_ae150886bb.jpg", "Power Tools", "Portable cut-off saw enquiry for masonry, concrete and metal cutting.", "/images/09-cutting-and-grinding.png"),
  item("rt-rotary-hammer", "https://www.wackerneuson.com/media/_processed_/8/4/csm_WN_EMEA_image_AS60e_EZ17e_action_ae150886bb.jpg", "Power Tools", "Rotary hammer enquiry for drilling anchors and fixing into concrete and masonry.", "/images/01-power-tools.png"),
  item("rt-floor-scrubber", "https://www.grindex.com/siteassets/grindex-media/home/drainage_family4727.jpg", "Site Equipment", "Walk-behind or ride-on scrubber enquiry for cleaning industrial and commercial floors.", "/images/13-cleaning-equipment.png"),
  item("rt-air-mover", "https://www.atlascopco.com/en-pk/construction-equipment/campaign-portable-air/e-air-electric-mobile-compressors", "Site Equipment", "High-volume air mover enquiry for ventilation, drying and temporary site airflow.", "/images/13-cleaning-equipment.png"),
  item("rt-wood-chipper", "https://s7d2.scene7.com/is/image/Caterpillar/CM20210820-b09f2-ba5c8?%24hero-cc-t1%24=", "Site Equipment", "Chipper enquiry for landscaping, vegetation management and green-waste reduction.", "/images/15-agricultural-equipment.png"),
];

export async function fetchRentalItems(): Promise<RentalItem[]> {
  return [...rentalItems];
}
