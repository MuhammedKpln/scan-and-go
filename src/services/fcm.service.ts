import { BaseService } from "./base.service";

class FcmService extends BaseService {
  async registerNewToken(userUid: string, token: string) {
    const { error } = await this.client.from("fcm_tokens").insert({
      created_at: new Date().toISOString(),
      token,
      userId: userUid,
    });

    if (error) {
      throw error;
    }
  }
}

export const fcmService = new FcmService();
