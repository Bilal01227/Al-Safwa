/** Local, durable image registry. No critical catalogue image depends on a third-party URL. */
const local=(name:string)=>`/images/${name}`;
export const IMG={
 hero:local("1upR7jHmsyR1GNGbdQFYaWUka1XSOK2bw2UzvXm96YEnTPOzVNsN_9Oau0MLzx9KNS_ss5r_pzG4PFONj2dirrH_KZlStiQykNNhivJxk_m5jNE3HKyqNR-oAF8kOAOYdXQv0IWosJ7GXAnjJfNX4hPhxwgN-n8wCkPk4j1fPj70yPSec3ZFrSph8MZ719nY.jpg"),
 closing:local("43vYWwAHrCXjOui4-bgBTdF3O_cPkZv58TOd5kI10buVj8Ei3RtEvSVOKpiP7VObpzBj4ezsFg8XO2JzmCnOgxY2NEquwQAv4BBm1O2_vFUb1jMU2SqRbGuNjc1fki2rViz43qfNeTIfG3lXokzdBpOp0nbfXMiGtaI6Hilv3VsdSmPXT6L6hCZBbSRkk8L3.jpg"),
 drill:local("category-drill.svg"),
 grinder:local("category-grinding.svg"),
 safety:local("category-safety.svg"),
 motor:local("category-pump.svg"),
 pump:local("category-pump.svg"),
 machinery:local("category-machinery.svg"),
 generator:local("category-generator.svg"),
 welder:local("category-welding.svg"),
 compressor:local("category-compressor.svg"),
 hands:local("category-hand-tools.svg"),
 spareParts:local("category-parts.svg"),
 measuring:local("category-measuring.svg"),
 cutting:local("category-grinding.svg"),
 lifting:local("category-machinery.svg"),
 cleaning:local("category-safety.svg"),
 electrical:local("category-measuring.svg"),
 agricultural:local("category-agriculture.svg"),
} as const;
