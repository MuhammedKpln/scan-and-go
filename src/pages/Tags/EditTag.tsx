import AppHeader from "@/components/App/AppHeader";
import AppLoading from "@/components/App/AppLoading";
import { QueryKeys } from "@/models/query_keys.model";
import { ITag } from "@/models/tag.model";
import EditTagModule from "@/modules/tags/edit_tag.module";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";
import { IonContent, IonPage, IonTitle } from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Redirect, RouteComponentProps } from "react-router";
export interface EditTagPageProps
  extends RouteComponentProps<{
    tagUid: string;
  }> {}

export default function EditTagPage(props: EditTagPageProps) {
  const user = useAuthStore((state) => state.user);

  const tagUid = props.match.params.tagUid;
  const tags = useQuery<ITag[]>({
    queryKey: [QueryKeys.Tags, user?.id],
  });

  const tag = useMemo(() => {
    if (!tags.data) return;

    const filteredTags = tags.data.filter(
      (v) => v.id === props.match.params.tagUid
    );

    return filteredTags.length > 0 && filteredTags[0];
  }, [tags]);

  if (!tags) {
    return <Redirect to={Routes.AppRoot} />;
  }

  if (!tag) {
    return <AppLoading />;
  }

  if (tags.isLoading) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>{tag?.name}</IonTitle>
      </AppHeader>

      <IonContent className="ios-paddign">
        <EditTagModule tagUid={tagUid} tag={tag} />
      </IonContent>
    </IonPage>
  );
}
