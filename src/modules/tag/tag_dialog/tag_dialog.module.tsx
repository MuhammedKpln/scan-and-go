import AppModalHeader from "@/components/App/AppModalHeader";
import AppButton from "@/components/AppButton";
import AppAvatar from "@/components/Avatar";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRippleEffect,
} from "@ionic/react";
import classNames from "classnames";
import {
  logoFacebook,
  logoInstagram,
  logoTwitter,
  phonePortraitOutline,
  qrCodeOutline,
  sendOutline,
  shareSocialOutline,
} from "ionicons/icons";
import styles from "./tag_dialog.module.scss";

export default function TagDialogModule() {
  return (
    <IonPage>
      <AppModalHeader
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      <IonContent>
        <div id="container" className="flex flex-col gap-5 ion-padding">
          <div id="user" className="flex gap-3 justify-between items-center">
            <AppAvatar />

            <div>
              <h1 className="font-bold">Muhammed Kaplan</h1>
              <p>Yazilim mühendisi</p>
            </div>
          </div>

          <div id="actions" className="flex flex-wrap gap-5">
            <AppButton className="w-full">
              <IonIcon icon={sendOutline} slot="start" />
              Skicka meddelande
            </AppButton>

            <AppButton fill="outline" className="w-[45%]">
              <IonIcon icon={qrCodeOutline} slot="start" />
              QR-kod
            </AppButton>
            <AppButton fill="outline" className="w-[45%]">
              <IonIcon icon={shareSocialOutline} slot="start" />
              Share
            </AppButton>
          </div>

          <div id="socialAccounts" className="flex gap-5">
            <div
              id="block"
              className={classNames(
                styles.block,
                "ion-activatable",
                "relative"
              )}
            >
              <IonIcon icon={logoTwitter} size="large" />
              Twitter
              <IonRippleEffect />
            </div>
            <div
              id="block"
              className={classNames(
                styles.block,
                "ion-activatable",
                "relative"
              )}
            >
              <IonIcon icon={logoInstagram} size="large" />
              Instagram
              <IonRippleEffect />
            </div>
            <div
              id="block"
              className={classNames(
                styles.block,
                "ion-activatable",
                "relative"
              )}
            >
              <IonIcon icon={logoFacebook} size="large" />
              Facebook
              <IonRippleEffect />
            </div>
          </div>

          <div id="contacts">
            <IonList lines="none">
              <IonListHeader>
                <IonLabel>Kontakt Information</IonLabel>
              </IonListHeader>

              <IonItem>
                <IonIcon icon={phonePortraitOutline} slot="end" />
                <IonLabel>
                  <p>Telefonnummer</p>
                  <h6>
                    <a>+46 73 894 04 03</a>
                  </h6>
                </IonLabel>
              </IonItem>
            </IonList>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
