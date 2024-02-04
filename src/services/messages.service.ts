import { FirebaseCollections } from "@/models/firebase_collections.model";
import { IRoom, IRoomWithId } from "@/models/room.model";
import {
  DocumentSnapshot,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { BaseService } from "./base.service";
import { profileService } from "./profile.service";

class MessagesService extends BaseService {
  constructor() {
    super(FirebaseCollections.Rooms);
  }

  async fetchRooms(userUid: string) {
    const queryRef = query(
      this.collectionRef,
      where("users", "array-contains", userUid)
    ).withConverter<IRoom>(this.converter());

    try {
      const data = await getDocs(queryRef);

      const s = await Promise.all(
        data.docs.map(async (e) => {
          const data = e.data();
          const recent = await profileService.fetchProfile(
            data.recentMessage.sendBy
          );

          const _messages = data.messages.map(async (e) => {
            const user = await profileService.fetchProfile(e.sendBy);

            return {
              ...e,
              user: user.data(),
            };
          });

          const messages = await Promise.all(_messages);

          const recentm = {
            ...data.recentMessage,
            user: recent.data(),
          };

          return {
            [e.id]: {
              ...data,
              recentMessage: recentm,
              messages,
            },
          };
        })
      );

      return s;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async fetchRoom(roomUid: string): Promise<IRoomWithId | undefined> {
    const docRef = doc(
      this.db,
      FirebaseCollections.Rooms,
      roomUid
    ).withConverter<IRoom>(this.converter());

    try {
      const query = await getDoc(docRef);
      const data = query.data();

      if (data) {
        const recent = await profileService.fetchProfile(
          data.recentMessage.sendBy,
          true
        );

        const _messages = data.messages.map(async (e) => {
          const user = await profileService.fetchProfile(e.sendBy, true);

          return {
            ...e,
            user: user.data(),
          };
        });

        const messages = await Promise.all(_messages);

        const recentm = {
          ...data.recentMessage,
          user: recent.data(),
        };

        return {
          [query.id]: {
            ...data,
            recentMessage: recentm,
            messages,
          },
        };
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async listenRoom(
    roomUid: string,
    callback: (item: DocumentSnapshot<IRoom>) => void
  ) {
    const docRef = doc(
      this.db,
      FirebaseCollections.Rooms,
      roomUid
    ).withConverter<IRoom>(this.converter());

    try {
      onSnapshot(docRef, async (item) => {
        callback(item);
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

export const messagesService = new MessagesService();
