import { supabase } from "./supabase";

export type SubmissionType = "quote" | "rental" | "repair";

export interface SubmissionRecord {
  id: string;
  type: SubmissionType;
  payload: Record<string, string>;
  createdAt: string;
}

/**
 * Submit through the server-side Supabase function. The function writes to
 * the existing customers + quote_requests/service_requests tables using
 * server-only credentials; customer PII is never made publicly readable.
 */
export async function saveSubmission(
  type: SubmissionType,
  payload: Record<string, string>,
): Promise<SubmissionRecord> {
  const { data, error } = await supabase.functions.invoke("public-enquiry", {
    body: { type, payload },
  });
  if (error) throw new Error(error.message || "Your request could not be saved.");
  if (!data?.reference) throw new Error(data?.error || "The enquiry service did not return a reference.");
  return {
    id: data.reference,
    type,
    payload,
    createdAt: new Date().toISOString(),
  };
}
