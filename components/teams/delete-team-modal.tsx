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
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
      router.push("/dashboard/teams");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete team",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
      onClose();
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