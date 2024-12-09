"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";

export type Team = {
  _id: string;
  name: string;
  description?: string;
  organizationId: string;
  leaderId: string;
  members: {
    userId: string;
    role: "leader" | "member";
    joinedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team Name" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "members",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Members" />
    ),
    cell: ({ row }) => {
      const count = row.original.members.length;
      return (
        <Badge variant="secondary">
          {count} {count === 1 ? "member" : "members"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const team = row.original;
      return (
        <DataTableRowActions
          actions={[
            {
              label: "View Details",
              href: `/admin/teams/${team._id}`,
            },
            {
              label: "Edit Team",
              onClick: () => {
                // TODO: Implement edit functionality
              },
            },
            {
              label: "Delete Team",
              onClick: () => {
                // TODO: Implement delete functionality
              },
              destructive: true,
            },
          ]}
        />
      );
    },
  },
]; 