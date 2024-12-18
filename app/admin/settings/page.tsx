"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
const logger = require("../../../logger");

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    enableUserRegistration: true,
    enableTeamCreation: true,
    maxUsersPerOrg: "50",
    maxTeamsPerOrg: "10",
    defaultUserRole: "team_member",
    emailNotifications: true,
    auditLogging: true,
  });

  const handleSave = () => {
    // TODO: Implement settings save functionality
    logger.info("Settings saved:", settings);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure system-wide settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to register through invitations
                </p>
              </div>
              <Switch
                checked={settings.enableUserRegistration}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableUserRegistration: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Team Creation</Label>
                <p className="text-sm text-muted-foreground">
                  Allow organization admins to create new teams
                </p>
              </div>
              <Switch
                checked={settings.enableTeamCreation}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableTeamCreation: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Organization Limits */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Organization Limits</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Maximum Users per Organization</Label>
              <Input
                type="number"
                value={settings.maxUsersPerOrg}
                onChange={(e) =>
                  setSettings({ ...settings, maxUsersPerOrg: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Teams per Organization</Label>
              <Input
                type="number"
                value={settings.maxTeamsPerOrg}
                onChange={(e) =>
                  setSettings({ ...settings, maxTeamsPerOrg: e.target.value })
                }
              />
            </div>
          </div>
        </Card>

        {/* User Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Default User Role</Label>
              <Select
                value={settings.defaultUserRole}
                onValueChange={(value) =>
                  setSettings({ ...settings, defaultUserRole: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team_member">Team Member</SelectItem>
                  <SelectItem value="team_leader">Team Leader</SelectItem>
                  <SelectItem value="org_admin">Organization Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for important events
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audit Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Log all important system events
                </p>
              </div>
              <Switch
                checked={settings.auditLogging}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, auditLogging: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
} 