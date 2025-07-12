import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import {
    Bell,
    CheckCircle,
    MessageSquare,
    ThumbsUp,
    User,
    X
} from 'lucide-react';
import React, { useState } from 'react';

interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'mention' | 'vote' | 'accepted';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  questionId?: string;
  userId?: string;
  userName?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'answer',
    title: 'New answer on your question',
    message: 'Someone answered your question "How to implement authentication in React?"',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    questionId: '123',
    userName: 'john_doe'
  },
  {
    id: '2',
    type: 'mention',
    title: 'You were mentioned',
    message: '@current_user mentioned you in a comment',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    questionId: '456',
    userName: 'sarah_dev'
  },
  {
    id: '3',
    type: 'vote',
    title: 'Your answer was upvoted',
    message: 'Your answer received an upvote',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    questionId: '789'
  },
  {
    id: '4',
    type: 'accepted',
    title: 'Your answer was accepted',
    message: 'Your answer was marked as the accepted solution',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    questionId: '321'
  }
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'answer':
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case 'mention':
      return <User className="h-4 w-4 text-purple-500" />;
    case 'vote':
      return <ThumbsUp className="h-4 w-4 text-orange-500" />;
    case 'accepted':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

interface NotificationDropdownProps {
  notifications?: Notification[];
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications = mockNotifications
}) => {
  const [notificationList, setNotificationList] = useState<Notification[]>(notifications);
  
  const unreadCount = notificationList.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotificationList(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotificationList(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:scale-105">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-96">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-auto p-1"
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-80">
          {notificationList.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {notificationList.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-foreground truncate">
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                        </span>
                        {notification.userName && (
                          <span className="text-xs text-primary">
                            by {notification.userName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {index < notificationList.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notificationList.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-xs h-8" size="sm">
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 