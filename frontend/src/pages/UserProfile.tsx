import { Header, QuestionCard } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import {
    Award,
    Calendar,
    Clock,
    Link as LinkIcon,
    MapPin,
    MessageSquare,
    Settings,
    Shield,
    ThumbsUp,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Mock user data
const mockUserProfile = {
  id: '1',
  username: 'john_doe',
  displayName: 'John Doe',
  email: 'john@example.com',
  bio: 'Full-stack developer passionate about React, Node.js, and building great user experiences. Always learning and sharing knowledge with the community.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  joinedAt: new Date('2023-06-15'),
  lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
  reputation: 1250,
  questionsCount: 23,
  answersCount: 45,
  acceptedAnswers: 18,
  badges: [
    { name: 'Great Question', count: 3, color: 'gold' },
    { name: 'Good Answer', count: 12, color: 'silver' },
    { name: 'Popular Question', count: 5, color: 'bronze' },
    { name: 'Helpful', count: 8, color: 'bronze' }
  ],
  isVerified: true,
  followers: 45,
  following: 23
};

// Mock user's questions
const mockUserQuestions = [
  {
    id: '1',
    title: 'How to implement authentication in React with JWT tokens?',
    content: 'I\'m building a React application and need to implement user authentication using JWT tokens...',
    author: {
      name: 'john_doe',
      reputation: 1250
    },
    tags: ['react', 'javascript', 'authentication', 'jwt'],
    votes: 15,
    answers: 7,
    views: 342,
    createdAt: new Date('2024-01-10T10:30:00Z'),
    hasAcceptedAnswer: true
  },
  {
    id: '2',
    title: 'Best practices for React component optimization?',
    content: 'What are the recommended approaches for optimizing React components for better performance?',
    author: {
      name: 'john_doe',
      reputation: 1250
    },
    tags: ['react', 'performance', 'optimization'],
    votes: 8,
    answers: 4,
    views: 156,
    createdAt: new Date('2024-01-08T15:20:00Z'),
    hasAcceptedAnswer: false
  }
];

// Mock user's answers
const mockUserAnswers = [
  {
    id: '1',
    questionTitle: 'How to handle state management in large React apps?',
    content: 'For large React applications, I recommend using Redux Toolkit with RTK Query for state management...',
    votes: 12,
    isAccepted: true,
    createdAt: new Date('2024-01-09T12:15:00Z')
  },
  {
    id: '2',
    questionTitle: 'What\'s the difference between useEffect and useLayoutEffect?',
    content: 'The main difference is in the timing of when they run. useEffect runs asynchronously after...',
    votes: 8,
    isAccepted: false,
    createdAt: new Date('2024-01-07T09:30:00Z')
  }
];

export const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<'questions' | 'answers' | 'activity'>('questions');
  const [user] = useState(mockUserProfile);
  const [userQuestions] = useState(mockUserQuestions);
  const [userAnswers] = useState(mockUserAnswers);

  const isOwnProfile = username === 'john_doe'; // In real app, check against current user

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'gold':
        return 'bg-yellow-500';
      case 'silver':
        return 'bg-gray-400';
      case 'bronze':
        return 'bg-orange-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-8">
              <CardContent className="p-6">
                {/* Avatar and Basic Info */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold">{user.displayName}</h1>
                    {user.isVerified && (
                      <Shield className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-2">@{user.username}</p>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-4">
                    <span>{user.followers} followers</span>
                    <span>•</span>
                    <span>{user.following} following</span>
                  </div>
                  
                  {isOwnProfile && (
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                <Separator className="mb-6" />

                {/* Bio */}
                {user.bio && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Joined {user.joinedAt.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Last seen {formatDistanceToNow(user.lastActive, { addSuffix: true })}
                    </span>
                  </div>
                  
                  {user.location && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.location}</span>
                    </div>
                  )}
                  
                  {user.website && (
                    <div className="flex items-center space-x-2 text-sm">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                </div>

                <Separator className="mb-6" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{user.reputation}</div>
                    <div className="text-xs text-muted-foreground">Reputation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.acceptedAnswers}</div>
                    <div className="text-xs text-muted-foreground">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.questionsCount}</div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.answersCount}</div>
                    <div className="text-xs text-muted-foreground">Answers</div>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Badges */}
                <div>
                  <h3 className="font-medium mb-3">Badges</h3>
                  <div className="space-y-2">
                    {user.badges.map((badge, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getBadgeColor(badge.color)}`}></div>
                          <span className="text-sm">{badge.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {badge.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 p-1 bg-muted rounded-lg">
              <Button
                variant={activeTab === 'questions' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('questions')}
                className="flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Questions ({user.questionsCount})
              </Button>
              <Button
                variant={activeTab === 'answers' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('answers')}
                className="flex-1"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Answers ({user.answersCount})
              </Button>
              <Button
                variant={activeTab === 'activity' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('activity')}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Activity
              </Button>
            </div>

            {/* Tab Content */}
            {activeTab === 'questions' && (
              <div className="space-y-6">
                {userQuestions.map((question) => (
                  <QuestionCard key={question.id} {...question} />
                ))}
                {userQuestions.length === 0 && (
                  <Card className="glass-card">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No questions yet</h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile 
                          ? "You haven't asked any questions yet. Start by asking your first question!"
                          : "This user hasn't asked any questions yet."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'answers' && (
              <div className="space-y-6">
                {userAnswers.map((answer) => (
                  <Card key={answer.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Link 
                          to={`/questions/${answer.id}`}
                          className="text-lg font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {answer.questionTitle}
                        </Link>
                        {answer.isAccepted && (
                          <Badge variant="default" className="ml-2">
                            <Award className="h-3 w-3 mr-1" />
                            Accepted
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {answer.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{answer.votes}</span>
                          </div>
                        </div>
                        <span>
                          {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {userAnswers.length === 0 && (
                  <Card className="glass-card">
                    <CardContent className="p-12 text-center">
                      <ThumbsUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No answers yet</h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile 
                          ? "You haven't answered any questions yet. Help the community by answering questions!"
                          : "This user hasn't answered any questions yet."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 border-l-2 border-primary">
                      <ThumbsUp className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Received upvote on answer</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 border-l-2 border-muted">
                      <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Asked a new question</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 border-l-2 border-muted">
                      <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Answer was accepted</p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 