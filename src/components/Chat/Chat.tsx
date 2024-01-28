import { IUser } from "@/models/user.model";
import {
  IonAvatar,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonText,
} from "@ionic/react";

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
        <IonAvatar slot="start">
          <img
            alt="Silhouette of a person's head"
            src="https://ionicframework.com/docs/img/demos/avatar.svg"
          />
        </IonAvatar>
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
