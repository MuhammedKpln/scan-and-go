import { INote } from "@/models/note.model";
import { Tables } from "@/models/supabase";
import { BaseService } from "./base.service";

class NoteService extends BaseService {
  async fetchLatestNote(userUid: string) {
    const { data, error } = await this.client
      .from("notes")
      .select()
      .eq("userId", userUid)
      .limit(1);

    if (error) {
      throw error;
    }

    return data;
  }

  async fetchLatestNotes(userUid: string): Promise<Tables<"notes">[]> {
    const { data, error } = await this.client
      .from("notes")
      .select()
      .eq("userId", userUid);

    if (error) {
      throw error;
    }

    return data;
  }

  async addNewNote(_data: Omit<INote, "id">) {
    const { data, error } = await this.client
      .from("notes")
      .insert(_data)
      .select()
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteNote(noteUid: number) {
    const { error } = await this.client
      .from("notes")
      .delete()
      .eq("id", noteUid);

    if (error) {
      throw error;
    }
  }

  async updateNote(noteUid: number, _data: Partial<INote>) {
    const { error } = await this.client
      .from("notes")
      .update(_data)
      .eq("id", noteUid);

    if (error) {
      throw error;
    }
  }
}

export const noteService = new NoteService();
