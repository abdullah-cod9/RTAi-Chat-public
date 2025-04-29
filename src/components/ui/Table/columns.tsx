/* eslint-disable react/jsx-no-literals */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  format,
  formatDistanceToNow,
  isYesterday,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "../checkbox";
import { TableColumnHeader } from "./TableColumnHeader";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Attachments = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
};

export const AttachmentsColumns: ColumnDef<Attachments>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableColumnHeader column={column} title="Created at" />,
    
    cell: ({ row }) => {
      const date: Date = new Date(row.getValue("createdAt"));
      const now = new Date();

      let formattedDate;

      if (differenceInYears(now, date) >= 1) {
        formattedDate = format(date, "yyyy"); // إظهار السنة فقط
      } else if (differenceInMonths(now, date) >= 1) {
        formattedDate = format(date, "MMMM", { locale: enUS }); // إظهار اسم الشهر
      } else if (differenceInWeeks(now, date) >= 1) {
        formattedDate = `${differenceInWeeks(now, date)}w`; // عدد الأسابيع
      } else if (differenceInDays(now, date) >= 1) {
        formattedDate = isYesterday(date)
          ? "Yesterday"
          : format(date, "EEEE", { locale: enUS }); // اسم اليوم
      } else {
        formattedDate = formatDistanceToNow(date, {
          addSuffix: true,
          locale: enUS,
        }); // "منذ ساعة" أو "قبل 30 دقيقة"
      }

      return <div className="text-right font-medium">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
