"use client";

import { Settings, User, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="mt-1 text-text-secondary">
          Manage your account and preferences.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:border-text-muted">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">
              Profile, email, and authentication settings.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:border-text-muted">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Palette className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">
              Theme, colors, and display preferences.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:border-text-muted">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Settings className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>General</CardTitle>
                <CardDescription>General application settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">
              Notifications, integrations, and more.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Coming Soon
        </h2>
        <p className="mt-2 text-text-secondary">
          Settings functionality is under development. In Phase 1, the focus is on
          core product management features. Full settings will be available in a future update.
        </p>
      </div>
    </div>
  );
}
