import AppInfoCard from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import TagCard from "@/components/Tags/tag_card.component";
import { QueryKeys } from "@/models/query_keys.model";
import { ITag } from "@/models/tag.model";
import { tagService } from "@/services/tag.service";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";

export default function TagsModule() {
  const user = useAuthStore((state) => state.user);

  const queryTags = useQuery<ITag[], void>({
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
        queryTags.data?.map((tag) => <TagCard />)
      )}
    </>
  );
}
