import { Header } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
    AlertTriangle,
    Ban,
    CheckCircle,
    Download,
    Eye,
    MessageSquare,
    MoreHorizontal,
    Settings,
    Shield,
    TrendingUp,
    Users,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data for admin dashboard
const dashboardStats = {
  totalUsers: 2847,
  totalQuestions: 1293,
  pendingReports: 24,
  activeUsers: 156,
  weeklyGrowth: 12.5,
  monthlyQuestions: 347
};

const recentReports = [
  {
    id: '1',
    type: 'inappropriate',
    content: 'This answer contains offensive language',
    questionTitle: 'How to implement Redux?',
    reportedBy: 'user123',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'pending'
  },
  {
    id: '2',
    type: 'spam',
    content: 'Promotional content not related to question',
    questionTitle: 'Best practices for React?',
    reportedBy: 'developer456',
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'pending'
  },
  {
    id: '3',
    type: 'duplicate',
    content: 'This question is a duplicate',
    questionTitle: 'What is JavaScript?',
    reportedBy: 'moderator789',
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'resolved'
  }
];

const recentUsers = [
  {
    id: '1',
    username: 'new_developer',
    email: 'dev@example.com',
    joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    questionsCount: 3,
    reputation: 25,
    status: 'active'
  },
  {
    id: '2',
    username: 'code_enthusiast',
    email: 'enthusiast@example.com',
    joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    questionsCount: 7,
    reputation: 150,
    status: 'active'
  },
  {
    id: '3',
    username: 'suspicious_user',
    email: 'spam@example.com',
    joinedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    questionsCount: 15,
    reputation: -10,
    status: 'flagged'
  }
];

export const AdminDashboard = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState(recentReports);

  const handleReportAction = (reportId: string, action: 'approve' | 'reject') => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? { ...report, status: action === 'approve' ? 'resolved' : 'rejected' }
          : report
      )
    );

    toast({
      title: `Report ${action}d`,
      description: `The report has been ${action}d successfully.`,
    });
  };

  const handleUserAction = (userId: string, action: 'ban' | 'unban') => {
    toast({
      title: `User ${action}ned`,
      description: `The user has been ${action}ned successfully.`,
    });
  };

  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Platform activity report has been generated and will be downloaded shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, moderate content, and monitor platform activity
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <Button onClick={generateReport} variant="outline">
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
            <Button asChild>
              <Link to="/admin/settings">
                <Settings className="h-4 w-4" />
                Platform Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{dashboardStats.weeklyGrowth}% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalQuestions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{dashboardStats.monthlyQuestions} this month
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{dashboardStats.pendingReports}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{dashboardStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Currently online
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Content moderation queue</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/reports">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {reports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={
                        report.type === 'spam' ? 'destructive' :
                        report.type === 'inappropriate' ? 'destructive' :
                        'secondary'
                      }>
                        {report.type}
                      </Badge>
                      <Badge variant={
                        report.status === 'pending' ? 'secondary' :
                        report.status === 'resolved' ? 'default' :
                        'destructive'
                      }>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-1">{report.questionTitle}</p>
                    <p className="text-xs text-muted-foreground mb-2">{report.content}</p>
                    <p className="text-xs text-muted-foreground">
                      Reported by {report.reportedBy} • {report.reportedAt.toLocaleDateString()}
                    </p>
                  </div>
                  
                  {report.status === 'pending' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleReportAction(report.id, 'approve')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReportAction(report.id, 'reject')}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>New user registrations</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/users">Manage Users</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {user.questionsCount} questions
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className={`text-xs ${user.reputation >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {user.reputation} rep
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      user.status === 'active' ? 'default' :
                      user.status === 'flagged' ? 'destructive' :
                      'secondary'
                    }>
                      {user.status}
                    </Badge>
                    
                    {user.status === 'flagged' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'ban')}>
                            <Ban className="h-4 w-4 mr-2" />
                            Ban User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Review Activity
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/admin/users">
                    <Users className="h-6 w-6 mb-2" />
                    User Management
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/admin/content">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    Content Moderation
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/admin/reports">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    Review Reports
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/admin/analytics">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Analytics
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 