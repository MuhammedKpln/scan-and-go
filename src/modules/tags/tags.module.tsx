import AppInfoCard from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import { ITagWithId } from "@/models/tag.model";
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
    queryKey: [QueryKeys.Tags, user?.id],
    queryFn: () => tagService.fetchTags(user!.id),
  });

  if (queryTags.isLoading) {
    return <AppLoading message="Laddar etiketter" />;
  }

  return (
    <>
      {queryTags.data!.length < 1 ? (
        <AppInfoCard message="Inga registererade etiketter kunde hittas." />
      ) : (
        queryTags.data?.map((tag) => (
          <IonCard routerLink={`/tags/${tag.id}`} key={tag.id}>
            <IonCardHeader>
              <IonCardTitle>{tag.name}</IonCardTitle>
              <IonCardSubtitle>{tag.note}</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        ))
      )}
    </>
  );
}
