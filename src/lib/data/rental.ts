/**
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

const TBC = "Specification confirmed per enquiry";
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
  item("rt-excavator-20t", "Crawler Excavator — 20-Ton Class", "Heavy Machinery", "Tracked excavator for bulk excavation, trenching, foundations and site preparation.", "/images/home-rental-excavator.webp", "20-ton class · final size TBC"),
  item("rt-mini-excavator", "Mini Excavator", "Heavy Machinery", "Compact excavator for utilities, landscaping, confined sites and light excavation.", "/images/02-heavy-machinery.png"),
  item("rt-long-reach-excavator", "Long-Reach Excavator", "Heavy Machinery", "Extended-reach excavator enquiry for deep drainage, canal and slope work.", "/images/02-heavy-machinery.png"),
  item("rt-wheel-excavator", "Wheeled Excavator", "Heavy Machinery", "Road-friendly excavator for urban utilities and work requiring frequent relocation.", "/images/02-heavy-machinery.png"),
  item("rt-wheel-loader", "Wheel Loader", "Heavy Machinery", "Wheel loader for stockpiles, truck loading, aggregate handling and backfilling.", "/images/02-heavy-machinery.png", "Bucket capacity TBC"),
  item("rt-backhoe-loader", "Backhoe Loader", "Heavy Machinery", "Combined front loader and rear excavator for road, utility and general construction.", "/images/02-heavy-machinery.png"),
  item("rt-bulldozer", "Crawler Bulldozer", "Heavy Machinery", "Tracked dozer for pushing, clearing, rough grading and bulk earthworks.", "/images/02-heavy-machinery.png"),
  item("rt-motor-grader", "Motor Grader", "Heavy Machinery", "Precision grading machine for road formation, shoulders and site finishing.", "/images/02-heavy-machinery.png"),
  item("rt-skid-steer", "Skid-Steer Loader", "Heavy Machinery", "Compact loader for material movement, cleanup and attachment-based site work.", "/images/02-heavy-machinery.png"),
  item("rt-track-loader", "Compact Track Loader", "Heavy Machinery", "Tracked compact loader for uneven ground, loading and site preparation.", "/images/02-heavy-machinery.png"),
  item("rt-articulated-dump-truck", "Articulated Dump Truck", "Heavy Machinery", "Off-road articulated hauler for moving bulk material across demanding sites.", "/images/02-heavy-machinery.png"),
  item("rt-site-dumper", "Site Dumper", "Heavy Machinery", "Compact dumper for moving soil, aggregate and construction material around site.", "/images/02-heavy-machinery.png"),
  item("rt-tipper-truck", "Tipper / Dump Truck", "Heavy Machinery", "Tipper truck enquiry for earth, sand, aggregate and construction waste transport.", "/images/02-heavy-machinery.png"),

  // Construction, concrete and demolition
  item("rt-concrete-mixer", "Portable Concrete Mixer", "Construction Equipment", "Site mixer for small pours, mortar preparation and general concrete work.", "/images/16-rental-equipment.png"),
  item("rt-transit-mixer", "Transit Concrete Mixer", "Construction Equipment", "Truck-mounted mixer enquiry for ready-mix concrete delivery to project sites.", "/images/16-rental-equipment.png"),
  item("rt-concrete-pump", "Concrete Pump", "Construction Equipment", "Concrete pumping solution for elevated, remote or high-volume pours.", "/images/16-rental-equipment.png"),
  item("rt-concrete-vibrator", "Concrete Poker Vibrator", "Construction Equipment", "Immersion vibrator enquiry for compacting fresh concrete and reducing air pockets.", "/images/01-power-tools.png"),
  item("rt-power-trowel", "Ride-On / Walk-Behind Power Trowel", "Construction Equipment", "Concrete finishing machine for smoothing and finishing slab surfaces.", "/images/16-rental-equipment.png"),
  item("rt-road-cutter", "Road / Concrete Cutter", "Construction Equipment", "Walk-behind cutter enquiry for controlled cutting of concrete and asphalt.", "/images/09-cutting-and-grinding.png"),
  item("rt-core-drill", "Diamond Core Drilling Machine", "Construction Equipment", "Core drilling equipment for clean circular penetrations in concrete and masonry.", "/images/01-power-tools.png"),
  item("rt-demolition-breaker", "Hydraulic Demolition Breaker", "Construction Equipment", "Excavator-mounted breaker enquiry for rock, reinforced concrete and demolition.", "/images/02-heavy-machinery.png"),
  item("rt-breaker-hammer", "Demolition / Breaker Hammer", "Power Tools", "Heavy electric breaker for concrete demolition, floor breaking and trench work.", "/images/01-power-tools.png"),
  item("rt-tower-scaffold", "Mobile Scaffold Tower", "Construction Equipment", "Modular access tower enquiry; height, platform and configuration confirmed per job.", "/images/16-rental-equipment.png"),

  // Working at height
  item("rt-scissor-lift", "Electric / Diesel Scissor Lift", "Aerial Access", "Vertical personnel platform enquiry for installation, maintenance and indoor or outdoor access.", "/images/12-lifting-and-material-handling.png"),
  item("rt-articulating-boom-lift", "Articulating Boom Lift", "Aerial Access", "Articulating access platform for elevated work around obstacles and structures.", "/images/12-lifting-and-material-handling.png"),
  item("rt-telescopic-boom-lift", "Telescopic Boom Lift", "Aerial Access", "Straight-boom access platform enquiry for extended horizontal and vertical reach.", "/images/12-lifting-and-material-handling.png"),
  item("rt-personnel-lift", "Vertical Personnel Lift", "Aerial Access", "Compact vertical access lift enquiry for indoor maintenance and installation tasks.", "/images/12-lifting-and-material-handling.png"),

  // Compaction and roadwork
  item("rt-single-drum-roller", "Single-Drum Soil Roller", "Compaction & Roadwork", "Ride-on roller enquiry for soil and sub-base compaction.", "/images/02-heavy-machinery.png"),
  item("rt-double-drum-roller", "Double-Drum Asphalt Roller", "Compaction & Roadwork", "Tandem vibratory roller enquiry for asphalt and road-surface compaction.", "/images/02-heavy-machinery.png"),
  item("rt-plate-compactor", "Reversible Plate Compactor", "Compaction & Roadwork", "Walk-behind plate compactor for paving, trenches and granular surfaces.", "/images/16-rental-equipment.png"),
  item("rt-tamping-rammer", "Tamping Rammer", "Compaction & Roadwork", "Jumping-jack rammer enquiry for cohesive soil and confined trench compaction.", "/images/16-rental-equipment.png"),
  item("rt-asphalt-paver", "Asphalt Paver", "Compaction & Roadwork", "Road paver enquiry for laying asphalt on road and infrastructure projects.", "/images/02-heavy-machinery.png"),
  item("rt-trencher", "Trencher", "Compaction & Roadwork", "Trenching machine enquiry for narrow utility, irrigation and cable trenches.", "/images/02-heavy-machinery.png"),

  // Material handling and lifting
  item("rt-forklift-diesel", "Diesel Forklift", "Material Handling", "Counterbalance forklift enquiry for outdoor yards, containers and heavy pallet handling.", "/images/12-lifting-and-material-handling.png"),
  item("rt-forklift-electric", "Electric Forklift", "Material Handling", "Electric forklift enquiry for warehouses and indoor material movement.", "/images/12-lifting-and-material-handling.png"),
  item("rt-telehandler", "Telescopic Handler", "Material Handling", "Telehandler enquiry for lifting and placing loads at height and reach.", "/images/12-lifting-and-material-handling.png"),
  item("rt-pallet-truck", "Electric Pallet Truck", "Material Handling", "Powered pallet truck enquiry for warehouse and loading-bay operations.", "/images/12-lifting-and-material-handling.png"),
  item("rt-mobile-crane", "Mobile Hydraulic Crane", "Material Handling", "Mobile crane enquiry; lifting plan, capacity, radius and certified operator requirements assessed per lift.", "/images/12-lifting-and-material-handling.png"),
  item("rt-truck-mounted-crane", "Truck-Mounted Crane", "Material Handling", "Vehicle-mounted crane enquiry for delivery, unloading and site lifting operations.", "/images/12-lifting-and-material-handling.png"),
  item("rt-chain-block-hoist", "Chain Block Hoist", "Lifting Equipment", "Manual chain hoist enquiry for controlled lifting and positioning in workshops and on site.", "/images/12-lifting-and-material-handling.png", "Safe working load TBC"),
  item("rt-electric-hoist", "Electric Chain Hoist", "Lifting Equipment", "Powered hoist enquiry for workshop, fabrication and industrial lifting tasks.", "/images/12-lifting-and-material-handling.png"),
  item("rt-lifting-gantry", "Portable Lifting Gantry", "Lifting Equipment", "Portable gantry enquiry for maintenance and equipment positioning.", "/images/12-lifting-and-material-handling.png"),

  // Power, air and utilities
  item("rt-diesel-generator", "Diesel Generator Set", "Generators & Power", "Canopied diesel generator enquiry for temporary site power and backup supply.", "/images/04-generators.png", "kVA rating confirmed per load"),
  item("rt-portable-generator", "Portable Petrol Generator", "Generators & Power", "Portable generator enquiry for tools, small sites and temporary power.", "/images/04-generators.png"),
  item("rt-light-tower", "Mobile Lighting Tower", "Generators & Power", "Mobile lighting tower enquiry for night shifts, roadworks and outdoor sites.", "/images/04-generators.png"),
  item("rt-distribution-board", "Temporary Power Distribution Board", "Generators & Power", "Temporary electrical distribution equipment enquiry; ratings and protection confirmed per site.", "/images/14-electrical-equipment.png"),
  item("rt-air-compressor", "Portable Air Compressor", "Compressors", "Compressor enquiry for pneumatic tools, spraying, blasting and site air supply.", "/images/05-air-compressors.png", "Pressure / CFM confirmed per tool"),
  item("rt-diesel-compressor", "Diesel Air Compressor", "Compressors", "Towable diesel compressor enquiry for remote worksites and heavy pneumatic tools.", "/images/05-air-compressors.png"),
  item("rt-welding-generator", "Engine-Driven Welding Generator", "Welding & Industrial", "Engine-driven welding set enquiry for field fabrication and remote maintenance.", "/images/03-welding-equipment.png"),
  item("rt-arc-welding-machine", "ARC Welding Machine", "Welding & Industrial", "ARC welding set enquiry for structural fabrication, repair and maintenance.", "/images/03-welding-equipment.png"),
  item("rt-mig-welder", "MIG Welding Machine", "Welding & Industrial", "MIG welding equipment enquiry for workshop fabrication and production work.", "/images/03-welding-equipment.png"),
  item("rt-plasma-cutter", "Plasma Cutting Machine", "Welding & Industrial", "Plasma cutting equipment enquiry for conductive metal cutting and fabrication.", "/images/09-cutting-and-grinding.png"),

  // Pumps, water and site support
  item("rt-submersible-pump", "Submersible Dewatering Pump", "Pumps & Water Management", "Submersible pump enquiry for pits, basements, trenches and groundwater removal.", "/images/08-motors-and-pumps.png"),
  item("rt-trash-pump", "Trash / Slurry Pump", "Pumps & Water Management", "Solids-handling pump enquiry for muddy water, construction runoff and slurry.", "/images/08-motors-and-pumps.png"),
  item("rt-diesel-water-pump", "Diesel Water Transfer Pump", "Pumps & Water Management", "Diesel-driven pump enquiry for water transfer and remote dewatering.", "/images/08-motors-and-pumps.png"),
  item("rt-high-pressure-washer", "Industrial Pressure Washer", "Pumps & Water Management", "High-pressure cleaning equipment enquiry for machinery, floors and site cleanup.", "/images/13-cleaning-equipment.png"),
  item("rt-water-tanker", "Water Tanker / Bowser", "Site Equipment", "Water bowser enquiry for dust suppression, roadworks and site water distribution.", "/images/16-rental-equipment.png"),
  item("rt-fuel-tank", "Temporary Fuel Storage Tank", "Site Equipment", "Temporary fuel storage enquiry; capacity, bunding and site compliance confirmed per project.", "/images/16-rental-equipment.png"),
  item("rt-traffic-barrier", "Temporary Traffic Barriers & Signage", "Site Equipment", "Work-zone traffic control equipment enquiry for construction and road maintenance.", "/images/16-rental-equipment.png"),
  item("rt-site-container", "Site Storage Container", "Site Equipment", "Secure temporary storage container enquiry for tools, materials and site equipment.", "/images/16-rental-equipment.png"),
  item("rt-angle-grinder-set", "Industrial Angle Grinder Set", "Power Tools", "Angle grinder enquiry for cutting, grinding and surface preparation.", "/images/09-cutting-and-grinding.png"),
  item("rt-cutoff-saw", "Handheld Cut-Off Saw", "Power Tools", "Portable cut-off saw enquiry for masonry, concrete and metal cutting.", "/images/09-cutting-and-grinding.png"),
  item("rt-rotary-hammer", "Rotary Hammer Drill", "Power Tools", "Rotary hammer enquiry for drilling anchors and fixing into concrete and masonry.", "/images/01-power-tools.png"),
  item("rt-floor-scrubber", "Industrial Floor Scrubber", "Site Equipment", "Walk-behind or ride-on scrubber enquiry for cleaning industrial and commercial floors.", "/images/13-cleaning-equipment.png"),
  item("rt-air-mover", "Industrial Fan / Air Mover", "Site Equipment", "High-volume air mover enquiry for ventilation, drying and temporary site airflow.", "/images/13-cleaning-equipment.png"),
  item("rt-wood-chipper", "Wood Chipper", "Site Equipment", "Chipper enquiry for landscaping, vegetation management and green-waste reduction.", "/images/15-agricultural-equipment.png"),
];

export async function fetchRentalItems(): Promise<RentalItem[]> {
  return [...rentalItems];
}
