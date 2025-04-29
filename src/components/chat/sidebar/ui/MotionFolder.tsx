import { isMob } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo } from "react";
import SidebarDropdownMenu from "@/components/chat/sidebar/dropdownMenu/DropdownMenu";
import { ChatFolder, Plan } from "@/app/actions/db/actions";

type Props = {
  data: ChatFolder;
  publicId: string;
  plan:Plan;
  is_anonymous: boolean;
  userId: string;

  onOpen: (value: boolean) => void;
  openValue: boolean;
  isHover: boolean;
};

export default memo(function MotionFolder({
  data,
  plan,
  publicId,
  is_anonymous,
  userId,

  openValue,
  onOpen,
  isHover,
}: Props) {
  return (
    <div
      className="flex cursor-default items-center relative"

    >
      <AnimatePresence>
        {isMob() ? (
          <div className="absolute right-1">
            <SidebarDropdownMenu
              data={data}
              onOpen={onOpen}
              openValue={openValue}
              plan={plan}
              publicId={publicId}
              is_anonymous={is_anonymous}
              userId={userId}
            />
          </div>
        ) : (
          isHover && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.8,

                  ease: [0, 0.71, 0.2, 1.01],
                },
              }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-1"
            >
              <SidebarDropdownMenu
                data={data}
                onOpen={onOpen}
                openValue={openValue}
                plan={plan}
                publicId={publicId}
                is_anonymous={is_anonymous}
                userId={userId}
              />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
});
