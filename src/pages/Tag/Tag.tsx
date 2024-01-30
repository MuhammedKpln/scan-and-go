import TagModule from "@/modules/tag/Tag.module";
import { IonContent, IonPage } from "@ionic/react";
import { RouteComponentProps } from "react-router";

export interface TagDetailPageProps
  extends RouteComponentProps<{
    tagUid: string;
  }> {}

export default function TagPage(props: TagDetailPageProps) {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <TagModule {...props} />
      </IonContent>
    </IonPage>
  );
}
