import { Tables } from "./supabase";

export type INote = Tables<"notes">;

export type INoteWithId = {
  [id: string]: INote;
};
