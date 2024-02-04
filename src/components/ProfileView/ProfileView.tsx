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
  IonSpinner,
  IonText,
} from "@ionic/react";
import { logoTwitter, phonePortraitOutline } from "ionicons/icons";
import styles from "./ProfileView.module.scss";

interface IProps {
  profileData: IUser;
  bioText: string;
  bioContent: string;
  showPhone?: boolean;
  showSocial?: boolean;
  phoneData?: IUserPrivatePhone;
  socialData?: IUserPrivateSocialMediaAccounts;
  showSendMessageBtn?: boolean;
  bioIsLoading?: boolean;
  isSignedIn?: boolean;
  onSendMessage?: () => void;
}

export default function ProfileView({
  profileData,
  showSendMessageBtn,
  onSendMessage,
  bioContent,
  bioIsLoading,
  bioText,
  isSignedIn,
  showPhone,
  showSocial,
  phoneData,
  socialData,
}: IProps) {
  return (
    <div className={styles.container}>
      <div id="userDetails" className="">
        <img
          src={profileData?.profileImageRef}
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
          <h6>{bioIsLoading ? <IonSpinner /> : <>{bioContent}</>}</h6>
        </IonLabel>
      </IonItem>

      <div id="userQr" className={styles.qrCodeContainer}>
        <IonImg
          src="https://docs.lightburnsoftware.com/img/QRCode/ExampleCode.png"
          className="w-36 h-36"
        />
      </div>

      {(showPhone || showSocial) && (
        <IonList>
          {showPhone && phoneData && (
            <IonItem
              href={`tel:${phoneData.value}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IonIcon icon={phonePortraitOutline} slot="start" />
              <IonLabel>
                <p>Phone</p>
                <h6>
                  <a>{phoneData.value}</a>
                </h6>
              </IonLabel>
            </IonItem>
          )}

          {showSocial && socialData?.twitter && (
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
