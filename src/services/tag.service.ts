import { ITag } from "@/models/tag.model";
import { BaseService } from "./base.service";

class TagService extends BaseService {
  async fetchTag(tagUid: number) {
    const { data, error } = await this.client
      .from("tags")
      .select()
      .eq("id", tagUid)
      .limit(1)
      .single();

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

  async updateTag(tagUid: number, data: Partial<ITag>) {
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
