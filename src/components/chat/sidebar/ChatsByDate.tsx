import { SidebarGroupLabel } from "@/components/ui/sidebar";
import React, { useState } from "react";

type Props = {
  createdAt: Date;
};

export default function ChatsByDate({ createdAt }: Props) {
  const [date, setDate] = useState<string>();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);
  const chatDate = new Date(createdAt);
  if (chatDate >= today) {
    setDate("Today");
  } else if (chatDate >= yesterday) {
    setDate("Yesterday");
  } else if (chatDate >= lastWeek) {
    setDate("LastWeek");
  } else if (chatDate >= lastMonth) {
    setDate(lastMonth.toDateString());
  } else if (chatDate >= lastYear) {
    setDate(lastYear.toDateString());
  }

  return <SidebarGroupLabel>{date}</SidebarGroupLabel>;
}
