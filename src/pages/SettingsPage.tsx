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
import { Camera } from "lucide-react";

interface CurrencyFormat {
  [key: string]: {
    symbol: string;
    position: "before" | "after";
  };
}

const currencyFormats: CurrencyFormat = {
  usd: { symbol: "$", position: "before" },
  eur: { symbol: "€", position: "before" },
  gbp: { symbol: "£", position: "before" },
  egp: { symbol: "ج.م", position: "after" },
  sar: { symbol: "ر.س", position: "after" },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: "محمد أحمد",
    email: "mohamed.ahmed@example.com",
    company: "استوديو الإبداع",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user123",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  // Load user settings from the database
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user || !user.user) return;

        // Load user profile
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.user.id)
          .single();

        if (userError) throw userError;

        if (userData) {
          setProfileData({
            name: userData.name || "محمد أحمد",
            email: userData.email || "mohamed.ahmed@example.com",
            company: userData.company || "استوديو الإبداع",
            avatar:
              userData.avatar_url ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=user123",
          });
        }

        // Load user settings
        const { data: settingsData, error: settingsError } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.user.id)
          .single();

        if (settingsError && settingsError.code !== "PGRST116") {
          // If settings don't exist, create them
          if (settingsError.code === "PGRST116") {
            const { error: insertError } = await supabase
              .from("user_settings")
              .insert({
                user_id: user.user.id,
                theme: "light",
                currency: "usd",
                date_format: "dd/mm/yyyy",
                email_notifications: true,
                project_reminders: true,
                payment_alerts: true,
                weekly_reports: false,
              });

            if (insertError) throw insertError;
          } else {
            throw settingsError;
          }
        }

        if (settingsData) {
          // Update display settings
          setDisplaySettings({
            theme: settingsData.theme || "light",
            currency: settingsData.currency || "usd",
            dateFormat: settingsData.date_format || "dd/mm/yyyy",
          });

          // Update notification settings
          setNotificationSettings({
            emailNotifications: settingsData.email_notifications ?? true,
            projectReminders: settingsData.project_reminders ?? true,
            paymentAlerts: settingsData.payment_alerts ?? true,
            weeklyReports: settingsData.weekly_reports ?? false,
          });

          // Apply theme
          const root = window.document.documentElement;
          root.classList.remove("light", "dark");

          if (settingsData.theme === "system") {
            const systemTheme = window.matchMedia(
              "(prefers-color-scheme: dark)",
            ).matches
              ? "dark"
              : "light";
            root.classList.add(systemTheme);
          } else {
            root.classList.add(settingsData.theme || "light");
          }
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
      }
    };

    loadUserSettings();
  }, []);

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = async (key: string) => {
    try {
      // Update local state
      setNotificationSettings((prev) => ({
        ...prev,
        [key]: !prev[key as keyof typeof notificationSettings],
      }));

      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Get the updated value
      const updatedValue =
        !notificationSettings[key as keyof typeof notificationSettings];

      // Check if user settings exist
      const { data: existingSettings, error: checkError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.user?.id)
        .single();

      // Update the specific setting in the database
      const updateData: any = {};
      updateData[key] = updatedValue;
      updateData.updated_at = new Date().toISOString();

      if (checkError && checkError.code === "PGRST116") {
        // Settings don't exist, create them with defaults and the new value
        const insertData: any = {
          user_id: user.user?.id,
          theme: displaySettings.theme,
          currency: displaySettings.currency,
          date_format: displaySettings.dateFormat,
          email_notifications: notificationSettings.emailNotifications,
          project_reminders: notificationSettings.projectReminders,
          payment_alerts: notificationSettings.paymentAlerts,
          weekly_reports: notificationSettings.weeklyReports,
          ...updateData,
        };

        const { error: insertError } = await supabase
          .from("user_settings")
          .insert(insertData);

        if (insertError) throw insertError;
      } else {
        // Settings exist, update them
        const { error } = await supabase
          .from("user_settings")
          .update(updateData)
          .eq("user_id", user.user?.id);

        if (error) throw error;
      }

      toast({
        title: "تم تحديث الإعدادات",
        description: "تم تحديث إعدادات الإشعارات بنجاح",
      });
    } catch (error) {
      console.error("Error toggling notification setting:", error);
      // Revert the local state change if there was an error
      setNotificationSettings((prev) => ({
        ...prev,
        [key]: prev[key as keyof typeof notificationSettings],
      }));

      toast({
        title: "خطأ في تحديث الإعدادات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDisplayChange = async (key: string, value: string) => {
    try {
      // Update local state
      setDisplaySettings((prev) => ({ ...prev, [key]: value }));

      // Apply theme change immediately
      if (key === "theme") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (value === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          root.classList.add(systemTheme);
        } else {
          root.classList.add(value);
        }
      }

      // Update the setting in the database
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Check if user settings exist
      const { data: existingSettings, error: checkError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.user?.id)
        .single();

      const updateData: any = {};
      // Map the key to the database column name
      const dbKey = key === "dateFormat" ? "date_format" : key;
      updateData[dbKey] = value;
      updateData.updated_at = new Date().toISOString();

      if (checkError && checkError.code === "PGRST116") {
        // Settings don't exist, create them with defaults and the new value
        const insertData: any = {
          user_id: user.user?.id,
          theme: "light",
          currency: "usd",
          date_format: "dd/mm/yyyy",
          email_notifications: true,
          project_reminders: true,
          payment_alerts: true,
          weekly_reports: false,
          ...updateData,
        };

        const { error: insertError } = await supabase
          .from("user_settings")
          .insert(insertData);

        if (insertError) throw insertError;
      } else {
        // Settings exist, update them
        const { error } = await supabase
          .from("user_settings")
          .update(updateData)
          .eq("user_id", user.user?.id);

        if (error) throw error;
      }

      // Show appropriate toast message
      if (key === "theme") {
        toast({
          title:
            value === "dark"
              ? "تم تفعيل الوضع الداكن"
              : "تم تفعيل الوضع الفاتح",
          description: "تم تغيير سمة التطبيق بنجاح",
        });
      } else if (key === "currency") {
        toast({
          title: "تم تغيير العملة",
          description: `تم تغيير العملة إلى ${getCurrencyName(value)}`,
        });
      } else if (key === "dateFormat") {
        toast({
          title: "تم تغيير تنسيق التاريخ",
          description: `تم تغيير تنسيق التاريخ إلى ${value}`,
        });
      }
    } catch (error) {
      console.error("Error updating display setting:", error);
      toast({
        title: "خطأ في تحديث الإعدادات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCurrencyName = (code: string) => {
    switch (code) {
      case "usd":
        return "الدولار الأمريكي ($)";
      case "eur":
        return "اليورو (€)";
      case "gbp":
        return "الجنيه الإسترليني (£)";
      case "egp":
        return "الجنيه المصري (ج.م)";
      case "sar":
        return "الريال السعودي (ر.س)";
      default:
        return code;
    }
  };

  const handleSaveDisplaySettings = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Check if user settings exist
      const { data: existingSettings, error: checkError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.user?.id)
        .single();

      if (checkError && checkError.code === "PGRST116") {
        // Settings don't exist, create them
        const { error: insertError } = await supabase
          .from("user_settings")
          .insert({
            user_id: user.user?.id,
            theme: displaySettings.theme,
            currency: displaySettings.currency,
            date_format: displaySettings.dateFormat,
            email_notifications: notificationSettings.emailNotifications,
            project_reminders: notificationSettings.projectReminders,
            payment_alerts: notificationSettings.paymentAlerts,
            weekly_reports: notificationSettings.weeklyReports,
          });

        if (insertError) throw insertError;
      } else {
        // Settings exist, update them
        const { error } = await supabase
          .from("user_settings")
          .update({
            theme: displaySettings.theme,
            currency: displaySettings.currency,
            date_format: displaySettings.dateFormat,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.user?.id);

        if (error) throw error;
      }

      toast({
        title: "تم حفظ الإعدادات",
        description: "تم تحديث إعدادات العرض بنجاح",
      });
    } catch (error) {
      console.error("Error updating display settings:", error);
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Update user profile in the database
      const { error } = await supabase
        .from("users")
        .update({
          name: profileData.name,
          email: profileData.email,
          company: profileData.company,
          avatar_url: profileData.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.user?.id);

      if (error) throw error;

      toast({
        title: "تم حفظ الملف الشخصي",
        description: "تم تحديث معلومات الملف الشخصي بنجاح",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "خطأ في حفظ الملف الشخصي",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور الجديدة وتأكيدها غير متطابقين",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "كلمة المرور قصيرة",
        description: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      // First verify the current password by attempting to sign in
      const { data: user } = await supabase.auth.getUser();
      if (!user || !user.user) throw new Error("User not found");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.user.email || "",
        password: passwordData.currentPassword,
      });

      if (signInError) {
        throw new Error("كلمة المرور الحالية غير صحيحة");
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) throw updateError;

      toast({
        title: "تم تحديث كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "خطأ في تحديث كلمة المرور",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Check if user settings exist
      const { data: existingSettings, error: checkError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.user?.id)
        .single();

      if (checkError && checkError.code === "PGRST116") {
        // Settings don't exist, create them
        const { error: insertError } = await supabase
          .from("user_settings")
          .insert({
            user_id: user.user?.id,
            email_notifications: notificationSettings.emailNotifications,
            project_reminders: notificationSettings.projectReminders,
            payment_alerts: notificationSettings.paymentAlerts,
            weekly_reports: notificationSettings.weeklyReports,
            theme: displaySettings.theme,
            currency: displaySettings.currency,
            date_format: displaySettings.dateFormat,
          });

        if (insertError) throw insertError;
      } else {
        // Settings exist, update them
        const { error } = await supabase
          .from("user_settings")
          .update({
            email_notifications: notificationSettings.emailNotifications,
            project_reminders: notificationSettings.projectReminders,
            payment_alerts: notificationSettings.paymentAlerts,
            weekly_reports: notificationSettings.weeklyReports,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.user?.id);

        if (error) throw error;
      }

      toast({
        title: "تم حفظ التفضيلات",
        description: "تم تحديث تفضيلات الإشعارات بنجاح",
      });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        title: "خطأ في حفظ التفضيلات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = () => {
    // Generate a new random avatar
    const newSeed = Math.random().toString(36).substring(2, 8);
    setProfileData((prev) => ({
      ...prev,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`,
    }));

    toast({
      title: "تم تغيير الصورة الرمزية",
      description: "تم تحديث الصورة الرمزية بنجاح",
    });
  };

  // Format currency based on settings
  const formatCurrency = (amount: number) => {
    const format = currencyFormats[displaySettings.currency];
    const formattedAmount = amount.toLocaleString();
    return format.position === "before"
      ? `${format.symbol}${formattedAmount}`
      : `${formattedAmount} ${format.symbol}`;
  };

  return (
    <div className="space-y-6">
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
              <div className="flex items-center gap-4 flex-row">
                <div className="relative">
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="h-20 w-20 rounded-full border-2 border-primary"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full bg-primary text-white hover:bg-primary/90"
                    onClick={handleAvatarChange}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-medium">{profileData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profileData.email}
                  </p>
                </div>
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
              <Button
                onClick={handleSaveProfile}
                className="bg-[hsl(var(--vodafone-red))] hover:bg-[hsl(var(--vodafone-red-dark))]"
              >
                {t("saveChanges")}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("password")}</CardTitle>
              <CardDescription>{t("updatePassword")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t("newPassword")}</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t("confirmPassword")}
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdatePassword}
                className="bg-[hsl(var(--vodafone-red))] hover:bg-[hsl(var(--vodafone-red-dark))]"
                disabled={
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
              >
                {t("updatePasswordButton")}
              </Button>
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
              <Button
                onClick={handleSaveNotificationSettings}
                className="bg-[hsl(var(--vodafone-red))] hover:bg-[hsl(var(--vodafone-red-dark))]"
              >
                {t("savePreferences")}
              </Button>
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
                <p className="text-sm text-muted-foreground mt-1">
                  مثال: {formatCurrency(1234.56)}
                </p>
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
              <Button
                onClick={handleSaveDisplaySettings}
                className="bg-[hsl(var(--vodafone-red))] hover:bg-[hsl(var(--vodafone-red-dark))]"
              >
                {t("saveSettings")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
