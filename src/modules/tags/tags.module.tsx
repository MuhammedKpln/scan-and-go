import AppInfoCard from "@/components/App/AppInfoCard";
import TagCard from "@/components/Tags/tag_card.component";
import { QueryKeys } from "@/models/query_keys.model";
import { ITag } from "@/models/tag.model";
import { tagService } from "@/services/tag.service";
import { useAuthStore } from "@/stores/auth.store";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function TagsModule() {
  const user = useAuthStore((state) => state.user);

  const queryTags = useSuspenseQuery<ITag[], void>({
    queryKey: [QueryKeys.Tags, user?.id],
    queryFn: () => tagService.fetchTags(user!.id),
  });

  return (
    <div className="flex flex-col justify-center items-center">
      {queryTags?.data?.length < 1 ? (
        <AppInfoCard message="Inga registererade etiketter kunde hittas." />
      ) : (
        queryTags.data?.map((tag) => (
          <TagCard
            created_at={tag.created_at}
            icon={tag.icon}
            isActive={tag.isActive}
            name={tag.name}
            note={tag.note}
            tagUid={tag.id}
            key={tag.id}
          />
        ))
      )}
    </div>
  );
}
