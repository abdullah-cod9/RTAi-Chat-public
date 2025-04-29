"use client";

import Uppy, { Meta, UploadResult, UppyFile } from "@uppy/core";
// For now, if you do not want to install UI components you
// are not using import from lib directly.
import Dashboard from "@uppy/react/lib/Dashboard";
import XHR from "@uppy/xhr-upload";
import { memo, useEffect, useState } from "react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { toast } from "sonner";
import DialogButton from "../ui/myButtons/DialogButton";
import { Button } from "../ui/button";
import { FileUpload } from "@/lib/myTypes";
import { Paperclip } from "lucide-react";
import { FeaturesPlan } from "@/subscription";
import UpgradeNow from "./UpgradeNow";
import { revalidate } from "@/app/actions/other/action";

function createUppy(numberOfFiles: number) {
  return new Uppy({
    restrictions: {
      maxNumberOfFiles: numberOfFiles,
      maxFileSize: 1000 * 1000 * 10,
      allowedFileTypes: [
        ".pdf",
        ".png",
        ".svg",
        ".jpeg",
        ".jpg",
        ".docx",
        ".pptx",
        ".xlsx",
        ".txt",
      ],
    },
  }).use(XHR, {
    endpoint: "/api/upload",
    formData: true,
    fieldName: "file",
    shouldRetry: () => false,
  });
}
type Props = {
  setAtt: (file: FileUpload) => void;
  featuresPlan: FeaturesPlan;
  is_anonymous: boolean;
};
export default memo(function AttUpload({
  setAtt,
  featuresPlan,
  is_anonymous,
}: Props) {
  const [uppy] = useState(() =>
    createUppy(
      featuresPlan.fileUploads > featuresPlan.maxUploadsPerSession
        ? featuresPlan.maxUploadsPerSession
        : featuresPlan.fileUploads,
    ),
  );
  const [open, setOpen] = useState(false);
  useEffect(() => {
    async function uploadSuccess(
      file: UppyFile<Meta, Record<string, never>> | undefined,
      res: {
        body?: Record<string, never> | undefined;
        status: number;
        bytesUploaded?: number;
        uploadURL?: string;
      },
    ) {
      if (res.body) {
        setAtt(res.body as unknown as FileUpload);
        return;
      }
      toast.success("File has been add successfully.");
    }

    uppy.on("upload-success", uploadSuccess);
    async function uploadComplete(
      result: UploadResult<Meta, Record<string, never>>,
    ) {
      const successful = result.successful ? result.successful[0] : undefined;
      if (!successful) {
        return toast.error("Error upload files.");
      }
      const resBody = successful?.response?.body;

      if (resBody) {
        setAtt(resBody as unknown as FileUpload);
      } else {
        toast.success("File has been added successfully.");
      }

      revalidate();
      setOpen(false);
      uppy.clear();
    }
    uppy.on("complete", uploadComplete);

    return () => {
      uppy.off("upload-success", uploadSuccess);
      uppy.off("complete", uploadComplete);
    };
  }, [setAtt, uppy]);

  const handleOpenDialogButton = (e: boolean) => {
    setOpen(e);
  };
  return (
    <DialogButton
      trigger={
        <Button
          autoFocus={false}
          onClick={() => handleOpenDialogButton(true)}
          size={"icon"}
          variant={"outline"}
          className="border-0 shadow-md"
        >
          <Paperclip />
        </Button>
      }
      triggerClose={undefined}
      onOpenTrigger={handleOpenDialogButton}
      openValue={open}
    >
      <div className="my-5 flex w-full flex-col items-center gap-3">
        {is_anonymous ? (
          <UpgradeNow is_anonymous={is_anonymous} />
        ) : (
          <div className="w-full px-4">
            <Dashboard
              className=""
              theme="dark"
              uppy={uppy}
              proudlyDisplayPoweredByUppy={false}
              height={300}
              width={"100%"}
              hideCancelButton
              disabled={!featuresPlan.fileUploads}
            />
          </div>
        )}
      </div>
    </DialogButton>
  );
});
