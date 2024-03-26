import { IssueData } from "@/interface/issueData.interface";
import { createClient } from "utils/supabase/client";

const supabase = createClient();
export const issueDataInsert = async (body: IssueData) => {
  const { data, error } = await supabase
    .from("issueTable")
    .insert([body])
    .select()
    .range(0, 9);
  return { data, error };
};

export const issueData = async () => {
  let { data: issueTable, error } = await supabase
    .from("issueTable")
    .select("*")
    .range(0, 9);
  return { issueTable, error };
};

export const deleteIssueApi = async (selectedId: string) => {
  const { error } = await supabase
    .from("issueTable")
    .delete()
    .eq('id', selectedId);
  return error;
};
