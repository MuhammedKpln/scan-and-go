import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { QueryKeys } from "@/models/query_keys.model";
import { ITag } from "@/models/tag.model";
import { tagService } from "@/services/tag.service";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonTextarea,
  IonToggle,
} from "@ionic/react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface IProps {
  tagUid: string;
  tag: ITag;
}

const editTagFormSchema = z.object({
  name: z.string(),
  note: z.string(),
  isActive: z.boolean(),
});

export default function EditTagModule({ tagUid, tag }: IProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { showToast } = useAppToast();

  const tagsMutation = useMutation<void, PostgrestError, Partial<ITag>>({
    mutationFn: (tag) => {
      return tagService.updateTag(tagUid, tag);
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData<ITag>([QueryKeys.Tag, user?.id], (v) => {
        if (v) {
          return { ...v, ...variables };
        }
      });

      queryClient.setQueryData<ITag[]>([QueryKeys.Tags, user?.id], (v) => {
        console.log(v);
        if (v && v.length > 0) {
          const updatedState = produce(v, (draft) => {
            const index = draft.findIndex((e) => e.id === tagUid);

            if (index !== -1) {
              draft[index] = { ...draft[index], ...variables };
            }
          });

          return updatedState;
        }
      });
    },
  });

  console.log(tagsMutation.error);

  const { handleSubmit, control } = useForm<typeof editTagFormSchema._type>({
    resolver: zodResolver(editTagFormSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      name: tag?.name ?? "",
      isActive: tag?.isActive ?? undefined,
      note: tag?.note ?? "",
    },
  });

  const onSubmitForm = useCallback(
    async (inputs: typeof editTagFormSchema._type) => {
      try {
        await tagsMutation.mutateAsync({
          isActive: inputs.isActive,
          name: inputs.name,
          note: inputs.note,
        });

        showToast({
          message: "Successfully edited.",
          status: ToastStatus.Success,
        });
      } catch (error) {
        showToast({
          message: "Successfully error.",
          status: ToastStatus.Error,
        });
      }
    },
    []
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <IonList inset>
          <IonItem>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <IonInput
                  onIonChange={field.onChange}
                  onIonBlur={field.onBlur}
                  value={field.value}
                  placeholder="Ettikett namn"
                  labelPlacement="floating"
                  label="Ettikett namn"
                />
              )}
            />
          </IonItem>
          <IonItem>
            <Controller
              control={control}
              name="note"
              render={({ field }) => (
                <IonTextarea
                  onIonChange={field.onChange}
                  onIonBlur={field.onBlur}
                  value={field.value}
                  placeholder="Ettikett almänt namn"
                  labelPlacement="floating"
                  label="Ettikett almänt namn"
                />
              )}
            />
          </IonItem>
          <IonItem>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <IonToggle
                  checked={field.value}
                  onIonChange={(e) => field.onChange(e.target.checked)}
                >
                  Öppet för användning
                </IonToggle>
              )}
            />
          </IonItem>
        </IonList>

        <IonButton type="submit" expand="full" className="ion-padding">
          Spara ettikett
        </IonButton>
      </form>
    </>
  );
}
