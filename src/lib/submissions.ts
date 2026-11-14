import { supabase } from "./supabase";

export type SubmissionType = "quote" | "rental" | "repair";

export interface SubmissionRecord {
  id: string;
  type: SubmissionType;
  payload: Record<string, string>;
  createdAt: string;
}

/**
 * Persist every public enquiry in the existing operational tables.
 * Contact details are stored on customers; quote and service records are
 * linked to that customer and become visible to the existing admin workflows.
 */
export async function saveSubmission(
  type: SubmissionType,
  payload: Record<string, string>,
): Promise<SubmissionRecord> {
  const customer = {
    name: payload.name.trim(),
    company_name: payload.company?.trim() || null,
    phone: payload.phone.trim() || null,
    whatsapp: payload.whatsapp?.trim() || null,
    email: payload.email?.trim() || null,
    city: payload.location?.trim() || null,
    country: "Oman",
    customer_type: payload.company?.trim() ? "business" : "individual",
  };

  const { data: customerRow, error: customerError } = await supabase
    .from("customers")
    .insert(customer)
    .select("id")
    .single();
  if (customerError || !customerRow) {
    throw new Error(customerError?.message || "Customer details could not be saved.");
  }

  if (type === "repair") {
    const { data, error } = await supabase
      .from("service_requests")
      .insert({
        customer_id: customerRow.id,
        service_type: payload.intent === "maintenance" ? "maintenance" : "repair",
        equipment_name: payload.equipment.trim(),
        model_number: payload.model?.trim() || null,
        problem_description: payload.problem.trim(),
        location: payload.location?.trim() || null,
        urgency: (payload.urgency || "Standard").toLowerCase().replaceAll(" ", "_"),
      })
      .select("service_number")
      .single();
    if (error || !data) throw new Error(error?.message || "Service request could not be saved.");
    return { id: data.service_number, type, payload, createdAt: new Date().toISOString() };
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .insert({
      customer_id: customerRow.id,
      product_name_snapshot: payload.product.trim(),
      model_snapshot: payload.model?.trim() || null,
      quantity: payload.quantity && /^\\d+$/.test(payload.quantity.trim()) ? Number(payload.quantity.trim()) : null,
      requirement: payload.requirement.trim(),
      location: payload.location?.trim() || null,
      customer_notes: JSON.stringify({
        brand: payload.brand || null,
        whatsapp: payload.whatsapp || null,
        email: payload.email || null,
        request_type: type,
      }),
      priority: "normal",
    })
    .select("quote_number")
    .single();
  if (error || !data) throw new Error(error?.message || "Quotation request could not be saved.");
  return { id: data.quote_number, type, payload, createdAt: new Date().toISOString() };
}
