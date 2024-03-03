import {
  IUser,
  IUserPrivatePhone,
  IUserPrivateSocialMediaAccounts,
  IUserWithPhoneAndSocial,
} from "@/models/user.model";
import { BaseService } from "./base.service";

class ProfileService extends BaseService {
  async updateProfile(userUid: string, _data: Partial<IUser>) {
    const { error } = await this.client
      .from("profiles")
      .update({
        bio: _data?.bio,
        firstName: _data?.firstName,
        lastName: _data?.lastName,
        created_at: _data?.created_at,
        profileImageUrl: _data?.profileImageUrl,
        sendMessageAllowed: _data?.sendMessageAllowed,
        showPhoneNumber: _data?.showPhoneNumber,
      })
      .eq("id", userUid);

    if (error) {
      throw error;
    }
  }

  async updateSocialMediaAccounts(
    userUid: string,
    _data: IUserPrivateSocialMediaAccounts
  ) {
    const { error } = await this.client
      .from("social_media_accounts")
      .upsert(_data, { onConflict: "id" })
      .eq("userId", userUid);

    if (error) {
      throw error;
    }
  }

  async fetchPhoneNumber(
    userUid: string
  ): Promise<Pick<IUserPrivatePhone, "number">> {
    const { data, error } = await this.client
      .from("phone_numbers")
      .select("number")
      .eq("userId", userUid)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async fetchSocialMediaAccounts(
    userUid: string
  ): Promise<IUserPrivateSocialMediaAccounts | null> {
    const { data, error } = await this.client
      .from("social_media_accounts")
      .select()
      .eq("userId", userUid)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async fetchProfile(userUid: string) {
    const profileQuery = this.client
      .from("profiles")
      .select("*, phone_numbers(*), social_media_accounts(*)")
      .eq("id", userUid)
      .limit(1)
      .single();

    const { data, error } = await profileQuery;

    if (error) {
      throw error;
    }

    return data as unknown as IUserWithPhoneAndSocial;
  }
}

export const profileService = new ProfileService();
