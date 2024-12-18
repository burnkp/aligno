"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useToast } from "@/components/ui/use-toast";
const logger = require("../../logger");

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: Id<"teams">;
  teamName: string;
}

export function DeleteTeamModal({
  isOpen,
  onClose,
  teamId,
  teamName,
}: DeleteTeamModalProps) {
  const router = useRouter();
  const deleteTeam = useMutation(api.teams.deleteTeam);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteTeam = async () => {
    try {
      setIsLoading(true);
      await deleteTeam({ teamId });
      
      // Close the modal
      onClose();
      
      // Show success message
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });

      // Just refresh the current page data
      router.refresh();
    } catch (error) {
      logger.error("Failed to delete team:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete team",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the team
            &quot;{teamName}&quot; and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTeam}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Team
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 