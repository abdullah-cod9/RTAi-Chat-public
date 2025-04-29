import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

type Props = {
  trigger: React.ReactNode;
  title: string;
  description: React.ReactNode;
  action: React.ReactNode;
};

export default function AlertDialogButton({
  trigger,
  title,
  description,
  action,
}: Props) {
  const t = useTranslations('components.alertDialogButton')
  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent  >
        <AlertDialogHeader  dir="auto">
          <AlertDialogTitle >{title}</AlertDialogTitle>
          <AlertDialogDescription >{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction asChild>{action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
