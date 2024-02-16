import { PushNotifications } from "@capacitor/push-notifications";
import { fcmService } from "../fcm.service";

class FirebasePushNotificationService {
  async removeAllListeners() {
    await PushNotifications.removeAllListeners();
  }

  async addListeners(userUid: string) {
    await PushNotifications.addListener("registration", (token) => {
      fcmService.registerNewToken(userUid, token.value);
    });

    await PushNotifications.addListener("registrationError", (err) => {
      console.error("Registration error: ", err.error);
    });

    await PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("Push notification received: ", notification);
      }
    );

    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log(
          "Push notification action performed",
          notification.actionId,
          notification.inputValue
        );
      }
    );
  }

  async registerNotifications() {
    try {
      const permission = await this.checkAndAskForPermission();

      if (permission) {
        await PushNotifications.register();
      }
    } catch (error) {
      throw new Error("Error while asking for notifications service");
    }
  }

  private async checkAndAskForPermission(): Promise<boolean> {
    const permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      const permission = await PushNotifications.requestPermissions();

      if (permission.receive !== "granted") {
        return false;
      }

      return true;
    }

    return false;
  }
}

// const addListeners = async () => {
//   await PushNotifications.addListener("registration", (token) => {
//     console.info("Registration token: ", token.value);
//   });

//   await PushNotifications.addListener("registrationError", (err) => {
//     console.error("Registration error: ", err.error);
//   });

//   await PushNotifications.addListener(
//     "pushNotificationReceived",
//     (notification) => {
//       console.log("Push notification received: ", notification);
//     }
//   );

//   await PushNotifications.addListener(
//     "pushNotificationActionPerformed",
//     (notification) => {
//       console.log(
//         "Push notification action performed",
//         notification.actionId,
//         notification.inputValue
//       );
//     }
//   );
// };

export const fcmRegisteringService = new FirebasePushNotificationService();
