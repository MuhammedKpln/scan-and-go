import AppHeader from "@/components/App/AppHeader";
import TagModule from "@/modules/tag/Tag.module";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonPage,
} from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";
import { RouteComponentProps } from "react-router";

export interface TagDetailPageProps
  extends RouteComponentProps<{
    tagUid: string;
  }> {}

export default function TagPage(props: TagDetailPageProps) {
  return (
    <IonPage>
      <AppHeader>
        <IonButtons>
          <IonButton routerLink="/">
            <IonIcon icon={chevronBackOutline} slot="start" />
            Scan & Go
          </IonButton>
        </IonButtons>
      </AppHeader>

      <IonContent className="ion-padding h-full w-full">
        <TagModule {...props} />
      </IonContent>
    </IonPage>
  );
}
