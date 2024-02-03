import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { renderIdWithData } from "@/helpers";
import { QueryKeys } from "@/models/query_keys.model";
import { tagService } from "@/services/tag.service";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";

export default function TagsModule() {
  const { user } = useAuthContext();

  const queryTags = useQuery<ITagWithId[], void>({
    queryKey: [QueryKeys.Tags, user?.uid],
    queryFn: () => tagService.fetchTags(user!.uid),
  });

  if (queryTags.isLoading) {
    return <AppLoading message="Laddar etiketter" />;
  }

  return (
    <>
      {renderIdWithData<ITag>(queryTags.data!, (data, id) => (
        <IonCard routerLink={`/tags/${id}`} key={id}>
          <IonCardHeader>
            <IonCardTitle>{data.tagName}</IonCardTitle>
            <IonCardSubtitle>{data.tagNote}</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      ))}
    </>
  );
}
