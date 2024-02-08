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
      await this.checkAndAskForPermission();

      await PushNotifications.register();
    } catch (error) {
      throw new Error("Error while asking for notifications service");
    }
  }

  private async checkAndAskForPermission() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      throw new Error("User denied permissions!");
    }
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
