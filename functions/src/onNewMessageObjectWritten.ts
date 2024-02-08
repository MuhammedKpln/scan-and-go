import * as admin from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { converter } from "./converter";
import { FirebaseCollections, IFcmToken, IRoom } from "./interfaces";

admin.initializeApp();

export default onDocumentWritten(
  `${FirebaseCollections.Rooms}/{docId}`,
  async (event) => {
    const roomDataAfter = event.data?.after.data() as IRoom;
    const roomDataBefore = event.data?.before.data() as IRoom;

    const userToSendNotification = roomDataAfter.users.filter(
      (v) => v !== roomDataAfter.recentMessage.sendBy
    );

    if (userToSendNotification.length > 0) {
      if (roomDataBefore.recentMessage !== roomDataAfter.recentMessage) {
        const sendToUser = userToSendNotification[0];
        const fcmToken = await admin
          .firestore()
          .collection(FirebaseCollections.FcmTokens)
          .doc(sendToUser)
          .withConverter<IFcmToken>(converter())
          .get();

        if (fcmToken) {
          await admin.messaging().send({
            token: fcmToken.data()!.token,

            notification: {
              title: "Du har fått ett nytt meddelande!",
            },
          });

          return;
        }

        return;
      }
    }
  }
);
