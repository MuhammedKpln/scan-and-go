import { supabaseClient } from "./supabase.service";

export interface IGeneralOptions {
  fromCache?: boolean;
}

export class BaseService {
  protected client = supabaseClient;
}
