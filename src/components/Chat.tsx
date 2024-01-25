import { IUser } from "@/models/user.model";
import {
  IonAvatar,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonText,
} from "@ionic/react";

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
      <IonItem button onClick={onClick}>
        <div className="flex flex-row items-center gap-5 p-3">
          <IonAvatar>
            <img
              alt="Silhouette of a person's head"
              src="https://ionicframework.com/docs/img/demos/avatar.svg"
            />
          </IonAvatar>

          <div>
            <IonText>
              <div className="text-md mb-2">
                {user.firstName} {user.lastName}
              </div>
            </IonText>
            <IonText color="medium">
              <div>{subtitle}</div>
            </IonText>
          </div>
        </div>
      </IonItem>
      <IonItemOptions>
        <IonItemOption color="danger" onClick={onClickDelete}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
}
