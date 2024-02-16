import TagModule from "@/modules/tag/Tag.module";
import { IonPage } from "@ionic/react";
import { RouteComponentProps } from "react-router";

export interface TagDetailPageProps
  extends RouteComponentProps<{
    tagUid: string;
  }> {}

export default function TagPage(props: TagDetailPageProps) {
  return (
    <IonPage>
      <TagModule {...props} />
    </IonPage>
  );
}
