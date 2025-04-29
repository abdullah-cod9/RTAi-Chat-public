import { revalidate } from "@/app/actions/other/action";
import { Button } from "@/components/ui/button";
import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ArrowRepeat } from "react-bootstrap-icons";


export default function RefreshData() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refresh, setRefresh] = useState<"inactive" | "active" | "complete">(
    "inactive",
  );
  const handleRefreshClick = async () => {
    setRefresh("active");
    await revalidate();
    await queryClient.invalidateQueries();
    setRefresh("complete");
    router.refresh();
  };

  return (
    <TooltipButton side="right" tooltipContent={"Refresh"}>
      <AnimatePresence>
        <motion.div
          animate={refresh}
          variants={{
            inactive: { rotate: 0 },
            active: {
              rotate: 360,
              transition: { repeat: Infinity, duration: 1, ease: "linear" },
            },
            complete: { rotate: 0 },
          }}
        >
          <Button
            size={"icon"}
            variant={"ghost"}
            className="[&_svg]:size-5"
            onClick={handleRefreshClick}
            disabled={refresh === "active"}
          >
            <ArrowRepeat />
          </Button>
        </motion.div>
      </AnimatePresence>
    </TooltipButton>
  );
}
