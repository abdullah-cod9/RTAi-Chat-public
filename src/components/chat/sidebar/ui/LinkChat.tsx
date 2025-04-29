import { Chat } from "@/app/actions/db/actions";
import Link from "next/link";
import React, { memo } from "react";
import { Chat as BsChat } from "react-bootstrap-icons";

type Props = {
  onDragStart: React.DragEventHandler<HTMLAnchorElement>;
  onDragEnd: React.DragEventHandler<HTMLAnchorElement>;
  ref: React.Ref<HTMLAnchorElement>;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
  className: string;
  data: Chat;
};

export default memo(function LinkChat({
  onDragStart,
  className,
  data,
  onClick,
  onDragEnd,
  ref,
}: Props) {
  return (
    <Link
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      ref={ref}
      onClick={onClick}
      href={`/chat/${data.id}`}
      prefetch={true}
      // style={{ contentVisibility: "auto" }}
      className={className}
    >
      <BsChat className="text-blue-600" />
      <div className="max-w-40 text-sm">
        <p className="truncate ">{data.name}</p>
      </div>
    </Link>
  );
});
