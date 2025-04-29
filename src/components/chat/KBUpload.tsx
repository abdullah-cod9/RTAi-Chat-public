import Uppy from "@uppy/core";
import Dashboard from "@uppy/react/lib/Dashboard";
import XHR from "@uppy/xhr-upload";
import { useEffect, useState } from "react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import DialogButton from "../ui/myButtons/DialogButton";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { FeaturesPlan } from "@/subscription";
import { revalidate } from "@/app/actions/other/action";

function createUppy(numberOfFiles: number) {
  return new Uppy({
    restrictions: {
      maxNumberOfFiles: numberOfFiles,
      allowedFileTypes: [".pdf", ".docx", ".pptx", ".xlsx"],
      maxFileSize: 1000 * 1000 * 10,
    },
  }).use(XHR, {
    endpoint: "/api/upload-knowledge-base",
    formData: true,
    fieldName: "file",
    shouldRetry: () => false,
  });
}
type Props = {
  onUploadComplete: () => void;
  featuresPlan: FeaturesPlan
  currentFiles: number;
};
export default function KBUpload({
  onUploadComplete,featuresPlan,currentFiles
}: Props) {
  const [open, setOpen] = useState(false);
  // const queryClient = useQueryClient();

  const [uppy] = useState(() =>
    createUppy(
      featuresPlan.fileUploads > featuresPlan.maxUploadsPerSession
        ? featuresPlan.maxUploadsPerSession
        : featuresPlan.fileUploads,
    ),
  );
  useEffect(() => {
    async function uploadComplete() {
      onUploadComplete();
       revalidate();
      setOpen(false);
      uppy.clear();
    }
  
    uppy.on("complete", uploadComplete);

    return () => {

      uppy.off("complete", uploadComplete);
    };
  }, [onUploadComplete, uppy]);
  const handleOpenDialogButton = (e: boolean) => {
    setOpen(e);
  };
  return (
    <DialogButton
      trigger={
        <Button
          onClick={() => handleOpenDialogButton(true)}
          size={"icon"}
          variant={"outline"}
          className="rounded-full"
        >
          <Plus />
        </Button>
      }
      triggerClose={undefined}
      openValue={open}
      onOpenTrigger={handleOpenDialogButton}
    >
      <div className="my-5 flex w-full flex-col items-center gap-3">
        <div className="w-full px-4">
          <Dashboard
            className=""
            theme="auto"
            uppy={uppy}
            proudlyDisplayPoweredByUppy={false}
            height={300}
            width={"100%"}
            hideCancelButton
            disabled={!featuresPlan.fileUploads || currentFiles >= featuresPlan.maxDocumentUploads}
          />
        </div>
      </div>
    </DialogButton>
  );
}
