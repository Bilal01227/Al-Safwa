/** Local, durable image registry. No critical catalogue image depends on a third-party URL. */
const local=(name:string)=>`/images/${name}`;
export const IMG={
 hero:local("al-safwa-hero.svg"),
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
