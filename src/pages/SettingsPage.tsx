import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { t } from "@/locales";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: "محمد أحمد",
    email: "mohamed.ahmed@example.com",
    company: "استوديو الإبداع",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user123",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    projectReminders: true,
    paymentAlerts: true,
    weeklyReports: false,
  });

  const [displaySettings, setDisplaySettings] = useState({
    theme: "light",
    currency: "usd",
    dateFormat: "dd/mm/yyyy",
  });

  // Apply theme when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (displaySettings.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(displaySettings.theme);
    }
  }, [displaySettings.theme]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof notificationSettings],
    }));
  };

  const handleDisplayChange = (key: string, value: string) => {
    setDisplaySettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveDisplaySettings = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث إعدادات العرض بنجاح",
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "تم حفظ الملف الشخصي",
      description: "تم تحديث معلومات الملف الشخصي بنجاح",
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("settingsTitle")}
        </h1>
        <p className="text-muted-foreground">{t("settingsSubtitle")}</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
          <TabsTrigger value="display">{t("display")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("profileInformation")}</CardTitle>
              <CardDescription>{t("updatePersonalBusiness")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 flex-row-reverse">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="h-20 w-20 rounded-full"
                />
                <Button variant="outline">{t("changeAvatar")}</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("fullName")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("emailAddress")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">{t("companyStudioName")}</Label>
                <Input
                  id="company"
                  name="company"
                  value={profileData.company}
                  onChange={handleProfileChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>{t("saveChanges")}</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("password")}</CardTitle>
              <CardDescription>{t("updatePassword")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t("currentPassword")}</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t("newPassword")}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    {t("confirmPassword")}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>{t("updatePasswordButton")}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("notificationPreferences")}</CardTitle>
              <CardDescription>{t("chooseNotifications")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("emailNotifications")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("receiveEmailNotifications")}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() =>
                    handleNotificationToggle("emailNotifications")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("projectReminders")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("getProjectReminders")}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.projectReminders}
                  onCheckedChange={() =>
                    handleNotificationToggle("projectReminders")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("paymentAlerts")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("receivePaymentAlerts")}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.paymentAlerts}
                  onCheckedChange={() =>
                    handleNotificationToggle("paymentAlerts")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("weeklyReports")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("getWeeklyReports")}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={() =>
                    handleNotificationToggle("weeklyReports")
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>{t("savePreferences")}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("displaySettings")}</CardTitle>
              <CardDescription>{t("customizeAppearance")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t("theme")}</Label>
                <Select
                  value={displaySettings.theme}
                  onValueChange={(value) => handleDisplayChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectTheme")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t("light")}</SelectItem>
                    <SelectItem value="dark">{t("dark")}</SelectItem>
                    <SelectItem value="system">{t("systemDefault")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("currency")}</Label>
                <Select
                  value={displaySettings.currency}
                  onValueChange={(value) =>
                    handleDisplayChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectCurrency")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="egp">EGP (ج.م)</SelectItem>
                    <SelectItem value="sar">SAR (ر.س)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("dateFormat")}</Label>
                <Select
                  value={displaySettings.dateFormat}
                  onValueChange={(value) =>
                    handleDisplayChange("dateFormat", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectDateFormat")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveDisplaySettings}>
                {t("saveSettings")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
