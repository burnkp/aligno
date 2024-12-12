"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface OrganizationSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "organization" | "admin" | "settings";

interface FormData {
  organization: {
    name: string;
    contactPerson: {
      name: string;
      email: string;
      phone: string;
    };
    subscription: {
      plan: string;
    };
  };
  admin: {
    name: string;
    email: string;
    password: string;
  };
  settings: {
    allowTeamCreation: boolean;
    requireApproval: boolean;
  };
}

const INITIAL_FORM_DATA: FormData = {
  organization: {
    name: "",
    contactPerson: {
      name: "",
      email: "",
      phone: "",
    },
    subscription: {
      plan: "basic",
    },
  },
  admin: {
    name: "",
    email: "",
    password: "",
  },
  settings: {
    allowTeamCreation: true,
    requireApproval: true,
  },
};

export function OrganizationSetupWizard({
  isOpen,
  onClose,
}: OrganizationSetupWizardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("organization");
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const createOrganization = useMutation(api.organizations.createOrganization);
  const createUser = useMutation(api.users.createUser);

  const handleStepChange = (step: Step) => {
    setCurrentStep(step);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create organization
      const organizationId = await createOrganization({
        name: formData.organization.name,
        contactPerson: formData.organization.contactPerson,
        subscription: {
          plan: formData.organization.subscription.plan,
          startDate: new Date().toISOString(),
        },
      });

      // Generate a unique userId for the admin user
      const userId = `org_admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create admin user
      await createUser({
        userId,
        name: formData.admin.name,
        email: formData.admin.email,
        role: "org_admin",
        organizationId,
      });

      toast({
        title: "Success",
        description: "Organization created successfully",
      });

      onClose();
      setFormData(INITIAL_FORM_DATA);
      
      // Redirect to welcome page
      router.push(`/admin/organizations/${organizationId}/welcome`);
    } catch (error) {
      console.error("Error creating organization:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Organization Setup Wizard</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={currentStep} onValueChange={(v) => handleStepChange(v as Step)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="admin">Admin User</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="organization" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={formData.organization.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organization: {
                          ...formData.organization,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Person</h3>
                  <div>
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      value={formData.organization.contactPerson.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: {
                            ...formData.organization,
                            contactPerson: {
                              ...formData.organization.contactPerson,
                              name: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={formData.organization.contactPerson.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: {
                            ...formData.organization,
                            contactPerson: {
                              ...formData.organization.contactPerson,
                              email: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      value={formData.organization.contactPerson.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: {
                            ...formData.organization,
                            contactPerson: {
                              ...formData.organization.contactPerson,
                              phone: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="subscription-plan">Subscription Plan</Label>
                  <Select
                    value={formData.organization.subscription.plan}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        organization: {
                          ...formData.organization,
                          subscription: {
                            ...formData.organization.subscription,
                            plan: value,
                          },
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => handleStepChange("admin")}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-name">Admin Name</Label>
                  <Input
                    id="admin-name"
                    value={formData.admin.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admin: {
                          ...formData.admin,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={formData.admin.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admin: {
                          ...formData.admin,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleStepChange("organization")}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => handleStepChange("settings")}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                {/* Settings will be implemented in the next iteration */}
                <p className="text-muted-foreground">
                  Organization settings will be configurable after creation.
                </p>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleStepChange("admin")}
                >
                  Previous
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Create Organization
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
} 