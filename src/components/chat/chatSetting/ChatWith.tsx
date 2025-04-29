import { ChatWithOption, Status } from "@/lib/consts";
import { useTranslations } from "next-intl";
import { ComboBoxResponsiveList } from "../../ui/myButtons/ComboBoxResponsiveList";
import { Button } from "../../ui/button";

type Props = {
  setSelectedStatus: (status: Status) => void;
  selectValue: Status;
};

export default function ChatWith({
  setSelectedStatus,
  selectValue,
}: Props) {
  const t = useTranslations("Chat.chatSetting.ChatWith");
  return (
    <ComboBoxResponsiveList
      i18Translations="Chat.chatSetting.ChatWith"
      selectValue={selectValue}
      setSelectedStatus={setSelectedStatus}
      statuses={ChatWithOption}
      side="right"
      childButton={
        <Button
          variant={"ghost"}
          className="flex w-full items-center justify-between rounded-none rounded-b-sm p-3 h-fit"
          dir="auto">
          <span>{t("option", {option: selectValue.value})}</span>
        </Button>
      }
      disableSearch
    />
  );
}
