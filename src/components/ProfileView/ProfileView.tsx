import {
  IUser,
  IUserPrivatePhone,
  IUserPrivateSocialMediaAccounts,
} from "@/models/user.model";
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from "@ionic/react";
import { logoTwitter, phonePortraitOutline } from "ionicons/icons";
import AppImage from "../App/AppImage";
import AppAvatar from "../Avatar";
import styles from "./ProfileView.module.scss";

interface IProps {
  profileData: IUser;
  bioText: string;
  bioContent: string;
  phoneData?: IUserPrivatePhone;
  socialData?: IUserPrivateSocialMediaAccounts;
  showSendMessageBtn?: boolean;
  isSignedIn?: boolean;
  onSendMessage?: () => void;
}

export default function ProfileView({
  profileData,
  showSendMessageBtn,
  onSendMessage,
  bioContent,
  bioText,
  isSignedIn,
  phoneData,
  socialData,
}: IProps) {
  console.log(profileData.profileImageUrl);
  return (
    <div className={styles.container}>
      <div id="userDetails" className="flex flex-col items-center">
        <AppAvatar url={profileData.profileImageUrl} className="w-32 h-32 " />

        <h1>
          {profileData?.firstName} {profileData?.lastName}
        </h1>
        <IonText color="medium">{profileData?.bio}</IonText>
      </div>
      {showSendMessageBtn && profileData?.sendMessageAllowed && isSignedIn && (
        <IonButton onClick={onSendMessage} fill="solid">
          Skicka meddelande
        </IonButton>
      )}

      <IonItem className={styles.noteContainer} lines="none">
        <IonLabel>
          <p>{bioText}</p>
          <h6>{bioContent}</h6>
        </IonLabel>
      </IonItem>

      <div id="userQr" className={styles.qrCodeContainer}>
        <AppImage
          src="https://docs.lightburnsoftware.com/img/QRCode/ExampleCode.png"
          className="w-36 h-36"
        />
      </div>

      {(socialData || phoneData) && (
        <IonList className="rounded-md">
          {phoneData && (
            <IonItem
              href={`tel:${phoneData.number}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IonIcon icon={phonePortraitOutline} slot="start" />
              <IonLabel>
                <p>Phone</p>
                <h6>
                  <a>{phoneData.number}</a>
                </h6>
              </IonLabel>
            </IonItem>
          )}

          {socialData?.twitter && (
            <IonItem
              href={`https://twitter.com/${socialData.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IonIcon icon={logoTwitter} slot="start" />
              <IonLabel>
                <p>Twitter</p>
                <h6>
                  <a>{socialData.twitter}</a>
                </h6>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
      )}
    </div>
  );
}
