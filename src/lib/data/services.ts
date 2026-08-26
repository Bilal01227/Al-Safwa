import type { Service } from "../types";
import { IMG } from "./images";

export const services: Service[] = [
  {
    slug: "equipment-repair",
    name: "Equipment Repair",
    tagline: "Fault diagnosis and repair for industrial equipment.",
    summary:
      "When equipment fails on site or in the workshop, Al Safwa Trading arranges inspection, fault diagnosis and repair — with a clear quotation before any work begins.",
    scope: [
      "Fault diagnosis and assessment",
      "Electrical and mechanical repairs",
      "Component-level replacement",
      "Performance testing after repair",
      "Repair quotation before work starts",
    ],
    process: [
      { title: "Report the fault", detail: "Share equipment, brand, model and the fault you are seeing." },
      { title: "Inspection & quote", detail: "We assess the unit and issue a repair quotation for approval." },
      { title: "Repair", detail: "Approved work is carried out with suitable parts." },
      { title: "Test & return", detail: "The unit is tested under load before handover." },
    ],
    imageUrl: IMG.grinder,
    cta: "repair",
  },
  {
    slug: "power-tool-repair",
    name: "Power Tool Repair",
    tagline: "Drills, grinders, breakers and saws back to full speed.",
    summary:
      "Power tools take the heaviest abuse on any site. We handle repair of drills, grinders, rotary hammers, breakers and cutters — keeping your crew working.",
    scope: [
      "Impact drills & rotary hammers",
      "Angle grinders & cut-off machines",
      "Breakers & demolition hammers",
      "Carbon brushes, switches & armatures",
      "Post-repair run testing",
    ],
    process: [
      { title: "Drop off or report", detail: "Bring the tool in or send the details via WhatsApp." },
      { title: "Diagnosis", detail: "We identify worn or failed components." },
      { title: "Approved repair", detail: "You approve the quoted repair before we proceed." },
      { title: "Tested handover", detail: "Every tool is run-tested before collection." },
    ],
    imageUrl: IMG.drill,
    cta: "repair",
  },
  {
    slug: "preventive-maintenance",
    name: "Preventive Maintenance",
    tagline: "Scheduled care that stops failures before they start.",
    summary:
      "Planned maintenance visits keep equipment within safe working condition and reduce unplanned downtime — arranged on a schedule that suits your operation.",
    scope: [
      "Scheduled inspection visits",
      "Lubrication and wear-part checks",
      "Electrical connection inspection",
      "Condition reporting after each visit",
      "Maintenance records per asset",
    ],
    process: [
      { title: "Asset list", detail: "Share the equipment you want covered." },
      { title: "Maintenance plan", detail: "We propose visit frequency and scope." },
      { title: "Scheduled visits", detail: "Inspections happen on the agreed plan." },
      { title: "Condition reports", detail: "You receive findings and recommendations." },
    ],
    imageUrl: IMG.motor,
    cta: "maintenance",
  },
  {
    slug: "machinery-maintenance",
    name: "Machinery Maintenance",
    tagline: "Upkeep for pumps, motors, generators and plant.",
    summary:
      "From motors and pump sets to generators, we coordinate mechanical and electrical upkeep so plant stays available for production.",
    scope: [
      "Motor & pump set servicing",
      "Generator upkeep coordination",
      "Bearing and seal replacement",
      "Alignment and mounting checks",
      "Breakdown response planning",
    ],
    process: [
      { title: "Site assessment", detail: "We review the machinery and its duty." },
      { title: "Scope & quotation", detail: "A maintenance scope and quote is agreed." },
      { title: "Work execution", detail: "Servicing is carried out as planned." },
      { title: "Service report", detail: "Work completed and parts used are documented." },
    ],
    imageUrl: IMG.machinery,
    cta: "maintenance",
  },
  {
    slug: "field-service",
    name: "Field Service",
    tagline: "Technicians at your site, anywhere in Oman.",
    summary:
      "Not everything can be moved to a workshop. Our field service reaches your site for on-the-spot inspection, repair and maintenance support across Oman.",
    scope: [
      "On-site inspection and diagnosis",
      "On-site repair where practical",
      "Installation & commissioning support",
      "Breakdown call-outs",
      "Coverage across Oman",
    ],
    process: [
      { title: "Call-out request", detail: "Tell us the location and the equipment involved." },
      { title: "Visit planning", detail: "We confirm scope, timing and any access requirements." },
      { title: "On-site work", detail: "Technicians carry out the agreed work." },
      { title: "Report & follow-up", detail: "Findings and any follow-up needs are reported." },
    ],
    imageUrl: IMG.hero,
    cta: "repair",
  },
  {
    slug: "spare-parts",
    name: "Spare Parts Supply",
    tagline: "The right part, sourced and supplied.",
    summary:
      "We source and supply spare parts and consumables — brushes, discs, seals and service parts — matched to your equipment's make and model.",
    scope: [
      "Consumables: discs, blades, brushes",
      "Service parts by make & model",
      "Cross-reference part matching",
      "Bulk supply for maintenance teams",
      "Sourcing of non-stock parts",
    ],
    process: [
      { title: "Part enquiry", detail: "Send make, model and part details (photos help)." },
      { title: "Matching & quote", detail: "We match the part and quote price and lead time." },
      { title: "Supply", detail: "Approved parts are supplied or delivered." },
      { title: "Fitment support", detail: "Guidance on fitment where needed." },
    ],
    imageUrl: IMG.hands,
    cta: "quote",
  },
];

export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
