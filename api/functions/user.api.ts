import { IgetSignUpQuery } from "@/interface/apiresp.interfaces";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";
import { createClient } from "utils/supabase/client";

const supabase = createClient();

export interface loginMutationPayload {
  email: string;
  password: string;
}

export const loginMutation = async (body: loginMutationPayload) => {
  const res = await supabase.auth.signInWithPassword(body)
  return res;
};
