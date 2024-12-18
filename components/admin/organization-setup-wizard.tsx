"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import logger from "@/utils/logger";

const formSchema = z.object({
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface OrganizationSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrganizationSetupWizard({
  isOpen,
  onClose,
}: OrganizationSetupWizardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createOrganization = useMutation(api.mutations.organizations.create);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      // Create organization in Convex
      const orgResult = await createOrganization({
        name: data.orgName,
        contactPerson: {
          name: data.contactName,
          email: data.email,
          phone: data.phone,
        },
      });

      if (!orgResult) {
        throw new Error("Failed to create organization");
      }

      // Send welcome email
      const emailResponse = await fetch("/api/send-welcome-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          orgName: data.orgName,
          name: data.contactName,
        }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        logger.error("Email API error:", emailData);
        // Continue with redirection even if email fails
      }

      // Reset form and close modal
      reset();
      onClose();

      // Show success toast
      toast({
        title: "Organization Created",
        description: "Please check your email to access your organization's dashboard.",
      });

      // Construct confirmation URL with parameters
      const params = new URLSearchParams({
        orgName: data.orgName,
        email: data.email,
      });

      // Force hard navigation to confirmation page
      window.location.href = `/get-started/confirmation?${params.toString()}`;
    } catch (error) {
      logger.error("Failed to create organization:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!isSubmitting && !open) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Organization</DialogTitle>
          <DialogDescription>
            Enter your organization details to get started with Aligno.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              {...register("orgName")}
              placeholder="Enter organization name"
              disabled={isSubmitting}
            />
            {errors.orgName && (
              <p className="text-sm text-red-500">{errors.orgName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input
              id="contactName"
              {...register("contactName")}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.contactName && (
              <p className="text-sm text-red-500">
                {errors.contactName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Enter phone number"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Organization...
                </>
              ) : (
                "Create Organization"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 