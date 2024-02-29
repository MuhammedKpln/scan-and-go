import { IUser } from "@/models/user.model";
import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonText,
} from "@ionic/react";

import AppAvatar from "../Avatar";
import styles from "./Chat.module.scss";

interface IProps {
  onClick: () => void;
  onClickDelete: () => void;
  user: IUser;
  subtitle: string;
}

export default function Chat({
  onClick,
  onClickDelete,
  subtitle,
  user,
}: IProps) {
  return (
    <IonItemSliding>
      <IonItem button onClick={onClick} className={styles.selam}>
        <AppAvatar url={user.profileImageUrl} />
        <IonText>
          {user.firstName} {user.lastName}
          <IonLabel color="medium">
            <div>{subtitle}</div>
          </IonLabel>
        </IonText>
        {/* <div>
          <IonText>
            <div className="text-md mb-2">
              {user.firstName} {user.lastName}
            </div>
          </IonText>
          <IonText color="medium">
            <div>{subtitle}</div>
          </IonText>
        </div> */}
      </IonItem>
      <IonItemOptions>
        <IonItemOption color="danger" onClick={onClickDelete}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
}
