import AppHeader from "@/components/App/AppHeader";
import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import { ITag, ITagWithId } from "@/models/tag.model";
import EditTagModule from "@/modules/tags/edit_tag.module";
import { Routes } from "@/routes/routes";
import { IonContent, IonPage, IonTitle } from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Redirect, RouteComponentProps } from "react-router";
export interface EditTagPageProps
  extends RouteComponentProps<{
    tagUid: string;
  }> {}

export default function EditTagPage(props: EditTagPageProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const tags = useMemo(() => {
    return queryClient.getQueryData<ITagWithId[]>([QueryKeys.Tags, user?.uid]);
  }, [queryClient]);

  const tag = useMemo(() => {
    let tag: ITag | undefined;

    if (!tags) return;

    for (const key of tags!) {
      for (const k of Object.keys(key)) {
        if (props.match.params.tagUid === k) {
          return key[k];
        }
      }
    }

    return tag;
  }, [tags]);

  if (!tags) {
    return <Redirect to={Routes.AppRoot} />;
  }

  if (!tag) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>{tag?.tagName}</IonTitle>
      </AppHeader>

      <IonContent className="ios-paddign">
        <EditTagModule tagUid={props.match.params.tagUid} tag={tag} />
      </IonContent>
    </IonPage>
  );
}
