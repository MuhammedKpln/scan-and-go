import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
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
    queryFn: async () => {
      const tags = await tagService.fetchTags(user!.uid);

      return tags.docs.map<ITagWithId>((e) => ({
        [e.id]: e.data(),
      }));
    },
  });

  if (queryTags.isLoading) {
    return <AppLoading message="Laddar etiketter" />;
  }

  return (
    <>
      {queryTags.data!.map((item, index) => (
        <div key={index}>
          {Object.keys(item).map((key) => {
            const tag: ITag = item[key];
            return (
              <IonCard routerLink={`/tags/${key}`} key={key}>
                <IonCardHeader>
                  <IonCardTitle>{tag.tagName}</IonCardTitle>
                  <IonCardSubtitle>{tag.tagNote}</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            );
          })}
        </div>
      ))}
    </>
  );
}
