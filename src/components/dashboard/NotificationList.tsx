import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { t } from "@/locales";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "موعد تسليم المشروع قريب",
    message: "فيديو العلامة التجارية للشركة يستحق في 5 أيام",
    type: "warning",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: "n2",
    title: "تم استلام الدفعة",
    message: "تم استلام دفعة بقيمة 1,200$ لمشروع تصوير المنتجات",
    type: "success",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: false,
  },
  {
    id: "n3",
    title: "تعليق جديد",
    message: "ترك العميل تعليقًا على مشروع إعادة تصميم الموقع الإلكتروني",
    type: "info",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true,
  },
  {
    id: "n4",
    title: "تجاوز الميزانية",
    message: "تجاوزت مصاريف حملة وسائل التواصل الاجتماعي الميزانية بمقدار 200$",
    type: "error",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    read: true,
  },
];

export default function NotificationList() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true })),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("notificationsTitle")}
          </h1>
          <p className="text-muted-foreground">
            {unreadCount === 1
              ? t("unreadNotifications", { count: unreadCount })
              : t("unreadNotificationsPlural", { count: unreadCount })}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            {t("markAllAsRead")}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? "opacity-70" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(notification.type)}
                    <CardTitle className="text-lg">
                      {notification.title}
                    </CardTitle>
                    {!notification.read && (
                      <Badge variant="default" className="mr-2">
                        {t("new")}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {formatDistanceToNow(new Date(notification.date), {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
              </CardContent>
              <CardFooter className="flex justify-start gap-2">
                {!notification.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    {t("markAsRead")}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNotification(notification.id)}
                >
                  {t("dismiss")}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">{t("noNotifications")}</h3>
            <p className="text-muted-foreground">{t("allCaughtUp")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
