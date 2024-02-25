import NO_AVATAR_IMAGE from "@/assets/noavatar.svg";
import {
  IUser,
  IUserPrivatePhone,
  IUserPrivateSocialMediaAccounts,
} from "@/models/user.model";
import {
  IonButton,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from "@ionic/react";
import { logoTwitter, phonePortraitOutline } from "ionicons/icons";
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
      <div id="userDetails" className="">
        <img
          src={
            profileData?.profileImageUrl
              ? profileData.profileImageUrl
              : NO_AVATAR_IMAGE
          }
          className="w-32 h-32 rounded-full"
        />

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
        <IonImg
          src="https://docs.lightburnsoftware.com/img/QRCode/ExampleCode.png"
          className="w-36 h-36"
        />
      </div>

      {(socialData || phoneData) && (
        <IonList>
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
