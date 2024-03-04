import { ITag } from "@/models/tag.model";
import { QueryData } from "@supabase/supabase-js";
import { BaseService } from "./base.service";
import { supabaseClient } from "./supabase.service";

const fetchTagQuery = supabaseClient
  .from("tags")
  .select("*, profiles(*, phone_numbers(*),social_media_accounts(*)), notes(*)")
  .limit(1)
  .single();

export type ITagWithRelations = QueryData<typeof fetchTagQuery>;

class TagService extends BaseService {
  async fetchTag(tagUid: string): Promise<ITagWithRelations | null> {
    const { data, error } = await this.client
      .from("tags")
      .select(
        "*, profiles(*, phone_numbers(*),social_media_accounts(*)), notes(*)"
      )
      .eq("id", tagUid)
      .eq("isActive", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async fetchTags(userUid: string): Promise<ITag[]> {
    const { data, error } = await this.client
      .from("tags")
      .select()
      .eq("userId", userUid);

    if (error) {
      throw error;
    }

    return data;
  }

  async addNewTag(data: ITag) {
    const { error } = await this.client.from("tags").insert(data);

    if (error) {
      throw error;
    }

    return true;
  }

  async updateTag(tagUid: string, data: Partial<ITag>) {
    const { error } = await this.client
      .from("tags")
      .update(data)
      .eq("id", tagUid);

    if (error) {
      throw error;
    }
  }
}

export const tagService = new TagService();
