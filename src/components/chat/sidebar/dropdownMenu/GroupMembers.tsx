import { Button } from "@/components/ui/button";
import DialogButton from "@/components/ui/myButtons/DialogButton";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";
import AlertDialogButton from "@/components/ui/myButtons/AlertDialogButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMembers, removeMemberFromGrope } from "@/app/actions/db/actions";
import { SkeletonLoadMembers } from "@/components/SkeletonLoad";
import { toast } from "sonner";
import { LucideUserRound, LucideUserRoundMinus } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  chatId: string;
  role: "admin" | "user" | null;
  publicId:string
  userId:string
};

export default function GroupMembers({
  chatId,
  role,
  publicId,
  userId
}: Props) {
  const queryClient = useQueryClient();
const t = useTranslations('Chat.sidebar.content.dropdownMenu.groupMembers')
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [`GroupMembers-${chatId}`],
    queryFn: () => getMembers(userId,chatId),
    refetchOnMount: false,
  });

  const { mutateAsync, isPending: mutatePending } = useMutation({
    mutationFn: async ({
      chatId,
      publicId,
      isLastMember,
    }: {
      chatId: string;
      publicId: string;
      isLastMember: boolean;
    }) => await removeMemberFromGrope(userId,chatId, publicId, isLastMember),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [`GroupMembers-${chatId}`],
        }),
        queryClient.invalidateQueries({
          queryKey: [`getFoldersAndChats`],
        }),
      ]);
      toast.success(t('toast_success'));
    },
    onError() {
      refetch();
      toast.error(
        t('toast_error')
      );
    },
  });
  return (
    <DialogButton
      title={t('title')}
      trigger={
        <Button
          variant={"ghost"}
          size={"icon"}
          className="h-fit w-full justify-start gap-3 p-2 text-start"
        >
          <LucideUserRound />
          <span>{t('title')}</span>
        </Button>
      }
      triggerClose={<Button variant={"outline"}>{t('triggerClose')}</Button>}
      description={<></>}
      className="px-4"
    >
      <div dir="auto" className="flex flex-col gap-3 px-2 py-1">
        {isPending ? (
          <SkeletonLoadMembers />
        ) : isError ? (
          <div className="flex items-center justify-between">
            <p>{t('status.error')}</p>
            <Button variant={"outline"} onClick={() => refetch()}>
            {t('status.refetch')}
            </Button>
          </div>
        ) : data ? (
          data.map((m) => (
            <div key={m.publicId} className="flex items-start gap-3">
              <Avatar>
                <AvatarImage className="max-w-8" src={m.avatarUrl} />
                {/*  eslint-disable-next-line react/jsx-no-literals */}
                <AvatarFallback>RTAi</AvatarFallback>
              </Avatar>
              <span>{m.username}</span>
              {role === "admin" && m.publicId !== publicId && (
                <AlertDialogButton
                  trigger={
                    <Button
                      size={"sm"}
                      variant={"destructive"}
                      className="ml-auto"
                      disabled={mutatePending}
                    >
                      <LucideUserRoundMinus />
                    </Button>
                  }
                  title={t('removeMember.title')}
                  description={
                    <>
                      {t('removeMember.description.m1')}{" "}
                      <span className="font-medium text-primary">
                        {m.username}
                      </span>{" "}
                      {t('removeMember.description.m2')}
                    </>
                  }
                  action={
                    <Button
                      variant={"destructive"}
                      onClick={async () => {
                        await mutateAsync({
                          chatId,
                          publicId: m.publicId,
                          isLastMember: data.length === 2,
                        });
                      }}
                      className="bg-destructive hover:bg-destructive"
                    >
                       {t('removeMember.action')}
                    </Button>
                  }
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-center font-medium text-primary"> {t('status.privateChat')}</p>
        )}
      </div>
    </DialogButton>
  );
}
