import { Header } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
    AlertTriangle,
    Ban,
    Calendar,
    Eye,
    MessageSquare,
    MoreHorizontal,
    Search,
    Shield,
    ThumbsUp,
    Users
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock user data
const mockUsers = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    joinedAt: new Date('2023-06-15'),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reputation: 1250,
    questionsCount: 23,
    answersCount: 45,
    status: 'active',
    role: 'user',
    warningsCount: 0,
    isVerified: true
  },
  {
    id: '2',
    username: 'sarah_dev',
    email: 'sarah@example.com',
    joinedAt: new Date('2023-03-20'),
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    reputation: 2850,
    questionsCount: 56,
    answersCount: 89,
    status: 'active',
    role: 'moderator',
    warningsCount: 0,
    isVerified: true
  },
  {
    id: '3',
    username: 'spam_user',
    email: 'spam@example.com',
    joinedAt: new Date('2024-01-10'),
    lastActive: new Date(Date.now() - 10 * 60 * 1000),
    reputation: -25,
    questionsCount: 15,
    answersCount: 3,
    status: 'suspended',
    role: 'user',
    warningsCount: 3,
    isVerified: false
  },
  {
    id: '4',
    username: 'new_developer',
    email: 'dev@example.com',
    joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 5 * 60 * 1000),
    reputation: 85,
    questionsCount: 5,
    answersCount: 2,
    status: 'active',
    role: 'user',
    warningsCount: 0,
    isVerified: false
  },
  {
    id: '5',
    username: 'flagged_user',
    email: 'flagged@example.com',
    joinedAt: new Date('2023-12-01'),
    lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reputation: 150,
    questionsCount: 8,
    answersCount: 12,
    status: 'flagged',
    role: 'user',
    warningsCount: 1,
    isVerified: true
  }
];

export const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleUserAction = (userId: string, action: string) => {
    setUsers(prev =>
      prev.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'ban':
              return { ...user, status: 'banned' };
            case 'suspend':
              return { ...user, status: 'suspended' };
            case 'activate':
              return { ...user, status: 'active' };
            case 'warn':
              return { ...user, warningsCount: user.warningsCount + 1 };
            default:
              return user;
          }
        }
        return user;
      })
    );

    toast({
      title: "Action Completed",
      description: `User ${action} action has been applied successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'suspended':
        return 'secondary';
      case 'banned':
        return 'destructive';
      case 'flagged':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Link to="/admin" className="text-muted-foreground hover:text-primary">
                Admin
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">User Management</span>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, permissions, and moderation actions
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Users ({filteredUsers.length})</span>
              <Button size="sm">
                <Users className="h-4 w-4 mr-2" />
                Export Users
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{user.username}</h3>
                        {user.isVerified && (
                          <Shield className="h-4 w-4 text-blue-500" />
                        )}
                        <Badge variant={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge variant={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Joined {user.joinedAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>Last active {formatLastActive(user.lastActive)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span className={user.reputation >= 0 ? 'text-success' : 'text-destructive'}>
                            {user.reputation} rep
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{user.questionsCount} questions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{user.answersCount} answers</span>
                        </div>
                        {user.warningsCount > 0 && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                            <span className="text-destructive">{user.warningsCount} warnings</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Activity
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      {user.status === 'active' && (
                        <>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'warn')}>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Issue Warning
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {user.status === 'suspended' && (
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                          <Shield className="h-4 w-4 mr-2" />
                          Activate User
                        </DropdownMenuItem>
                      )}
                      
                      {user.status !== 'banned' && (
                        <DropdownMenuItem 
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className="text-destructive focus:text-destructive"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Ban User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 