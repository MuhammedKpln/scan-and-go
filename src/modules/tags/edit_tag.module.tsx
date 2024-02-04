import { useAuthContext } from "@/context/AuthContext";
import { updateIdWithDataValue } from "@/helpers";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { QueryKeys } from "@/models/query_keys.model";
import { ITag, ITagWithId } from "@/models/tag.model";
import { tagService } from "@/services/tag.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonTextarea,
  IonToggle,
} from "@ionic/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface IProps {
  tagUid: string;
  tag: ITag;
}

const editTagFormSchema = z.object({
  name: z.string(),
  note: z.string(),
  isAvailable: z.boolean(),
});

export default function EditTagModule({ tagUid, tag }: IProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const { showToast } = useAppToast();

  const tags = useMemo(() => {
    return queryClient.getQueryData<ITagWithId[]>([QueryKeys.Tags, user?.uid]);
  }, [queryClient]);

  const tagsMutation = useMutation<void, Error, Omit<ITag, "userUid">>({
    mutationFn: (tag) => {
      return tagService.updateTag(tagUid, tag);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<ITagWithId[]>([QueryKeys.Tag, user?.uid], () => {
        if (tags) {
          return updateIdWithDataValue<ITag>(tags, tagUid, variables);
        }
      });
    },
  });

  const { handleSubmit, control } = useForm<typeof editTagFormSchema._type>({
    resolver: zodResolver(editTagFormSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      name: tag?.tagName,
      isAvailable: tag?.isAvailable,
      note: tag?.tagNote,
    },
  });

  const onSubmitForm = useCallback(
    async (inputs: typeof editTagFormSchema._type) => {
      try {
        console.log(tag.isAvailable, inputs.isAvailable);

        await tagsMutation.mutateAsync({
          isAvailable: inputs.isAvailable,
          tagName: inputs.name,
          tagNote: inputs.note,
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
              name="isAvailable"
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
