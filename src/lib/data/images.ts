/**
 * Central image registry.
 * MVP uses generated catalogue photography; replace with verified
 * product photos (Supabase Storage / CDN) without touching the UI.
 */
const cdn = "https://image.qwenlm.ai/generated-images";

export const IMG = {
  hero: `${cdn}/311cc1ba-e169-452b-8477-71dddad96022/_result.png`,
  drill: `${cdn}/3a28ce76-14dd-47d1-a156-746161b715ec/_result.png`,
  grinder: `${cdn}/fadd4ead-b331-480d-80ba-423b58dca81b/_result.png`,
  safety: `${cdn}/3c270f0e-e329-40c0-af66-89f9d8ab962c/_result.png`,
  motor: `${cdn}/4633ac61-59af-4f9d-bc02-4b30ded9316f/_result.png`,
  machinery: `${cdn}/adfee6c3-9444-4cd8-896e-65bd23230848/_result.png`,
  generator: `${cdn}/8b7a1975-69ab-4f19-a16c-393f117c04f2/_result.png`,
  welder: `${cdn}/b03e3c93-7b77-46ee-b112-482516c313bf/_result.png`,
  compressor: `${cdn}/d380a90d-8e97-4529-b93d-03e5c407afbf/_result.png`,
  hands: `${cdn}/fbf6b019-ae01-413b-953e-bddc4ff32c90/_result.png`,
} as const;
