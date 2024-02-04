import { FirebaseCollections } from "@/models/firebase_collections.model";
import { IRoom, IRoomWithId } from "@/models/room.model";
import {
  DocumentSnapshot,
  PartialWithFieldValue,
  QuerySnapshot,
  Unsubscribe,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { BaseService, IGeneralOptions } from "./base.service";
import { profileService } from "./profile.service";

class MessagesService extends BaseService {
  constructor() {
    super(FirebaseCollections.Rooms);
  }

  async fetchRooms(userUid: string, options?: IGeneralOptions) {
    const queryRef = query(
      this.collectionRef,
      where("users", "array-contains", userUid)
    ).withConverter<IRoom>(this.converter());

    try {
      let data: QuerySnapshot<IRoom>;

      if (options?.fromCache) {
        data = await getDocsFromCache(queryRef);
      } else {
        data = await getDocs(queryRef);
      }

      const s = await Promise.all(
        data.docs.map(async (e) => {
          const data = e.data();
          const recent = await profileService.fetchProfile(
            data.recentMessage.sendBy
          );

          const recentm = {
            ...data.recentMessage,
            user: recent.data(),
          };

          return {
            [e.id]: {
              ...data,
              recentMessage: recentm,
            },
          };
        })
      );

      return s;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async fetchRoom(
    roomUid: string,
    options?: IGeneralOptions
  ): Promise<IRoomWithId | undefined> {
    const docRef = doc(
      this.db,
      FirebaseCollections.Rooms,
      roomUid
    ).withConverter<IRoom>(this.converter());

    try {
      let query: DocumentSnapshot<IRoom>;

      if (options?.fromCache) {
        query = await getDocFromCache(docRef);
      } else {
        query = await getDoc(docRef);
      }

      const data = query.data();

      if (data) {
        return this.mapUserDetails(data, query.id);
      } else {
        console.log("???");
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }

  listenRoom(
    roomUid: string,
    callback: (item: DocumentSnapshot<IRoom>) => void
  ): Unsubscribe {
    const docRef = doc(
      this.db,
      FirebaseCollections.Rooms,
      roomUid
    ).withConverter<IRoom>(this.converter());

    try {
      return onSnapshot(docRef, (item) => {
        callback(item);
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  sendMessage(
    data: IRoom,
    documentData?: PartialWithFieldValue<IRoom>,
    documentId?: string
  ) {
    const collectionRef = collection(
      this.db,
      FirebaseCollections.Rooms
    ).withConverter<IRoom>(this.converter());

    try {
      if (documentData) {
        const docRef = doc(this.collectionRef, documentId).withConverter<IRoom>(
          this.converter()
        );

        return updateDoc(docRef, documentData);
      }

      return addDoc(collectionRef, data);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async mapUserDetails(data: IRoom, roomUid: string): Promise<IRoomWithId> {
    // Fetch all user details once
    data?.users.forEach(async (user) =>
      (await profileService.fetchProfile(user, { fromCache: true })).data()
    );

    // Fetch user details from all users and map it to user field.
    const _messages = data.messages.map(async (e) => {
      const user = await profileService.fetchProfile(e.sendBy, {
        fromCache: true,
      });

      return {
        ...e,
        user: user.data(),
      };
    });

    const messages = await Promise.all(_messages);

    return {
      [roomUid]: {
        ...data,
        messages,
      },
    };
  }
}

export const messagesService = new MessagesService();
