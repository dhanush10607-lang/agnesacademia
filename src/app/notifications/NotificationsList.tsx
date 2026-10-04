"use client";

import { useState } from "react";
import { formatDistanceToNow } from "@/lib/date-time";
import { markNotificationReadAction, markAllNotificationsReadAction } from "@/app/actions/notifications";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2, Circle, ExternalLink, Calendar, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotificationsList({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const router = useRouter();

  const handleMarkRead = async (id: string, actionUrl?: string) => {
    await markNotificationReadAction(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    
    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsReadAction();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>No notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark all as read
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {notifications.map((notification) => {
          const isNotice = notification.category === 'notice';
          const isCalendar = notification.category === 'calendar';
          
          return (
            <Card 
              key={notification.id} 
              className={`overflow-hidden transition-colors ${!notification.is_read ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}
            >
              <CardContent className="p-0">
                <button
                  onClick={() => handleMarkRead(notification.id, notification.action_url)}
                  className="w-full text-left p-4 flex gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="shrink-0 mt-1">
                    {!notification.is_read ? (
                      <Circle className="w-3 h-3 fill-primary text-primary" />
                    ) : (
                      <Check className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className={`font-medium truncate ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-2 line-clamp-2 ${!notification.is_read ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs">
                      {isCalendar && <span className="inline-flex items-center text-orange-600 bg-orange-50 px-2 py-0.5 rounded"><Calendar className="w-3 h-3 mr-1"/> Calendar</span>}
                      {isNotice && <span className="inline-flex items-center text-blue-600 bg-blue-50 px-2 py-0.5 rounded"><Bell className="w-3 h-3 mr-1"/> Notice</span>}
                      
                      {notification.action_url && (
                        <span className="inline-flex items-center text-primary font-medium ml-auto">
                          View details <ExternalLink className="w-3 h-3 ml-1" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
