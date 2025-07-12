import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Share, Bookmark, Flag, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header, VoteButtons } from '@/components/shared';
import { RichTextEditor } from '@/components/RichTextEditor';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockQuestion = {
  id: '1',
  title: 'How to implement authentication in React with JWT tokens?',
  content: `I'm building a React application and need to implement user authentication using JWT tokens. Here's what I'm trying to achieve:

## What I need:
- User login/logout functionality
- Protected routes that require authentication  
- Automatic token refresh
- Secure token storage

## What I've tried:
I've looked into localStorage for token storage, but I'm concerned about XSS attacks. I've also considered httpOnly cookies but I'm not sure how to implement them properly with a React frontend.

## My current setup:
- React 18 with TypeScript
- Node.js/Express backend
- MongoDB database

Any guidance on best practices would be greatly appreciated!`,
  author: {
    name: 'sarah_dev',
    reputation: 1250,
    joinDate: new Date('2023-05-15')
  },
  tags: ['react', 'javascript', 'authentication', 'jwt'],
  votes: 15,
  views: 342,
  createdAt: new Date('2024-01-10T10:30:00Z'),
  answers: [
    {
      id: 'a1',
      content: `Great question! Here's a comprehensive approach to JWT authentication in React:

## 1. Token Storage
For security, I recommend using httpOnly cookies instead of localStorage:

\`\`\`javascript
// Backend - set httpOnly cookie
res.cookie('token', jwt.sign(payload, secret), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
\`\`\`

## 2. Axios Interceptors
Use interceptors to automatically include tokens and handle refresh:

\`\`\`javascript
axios.interceptors.request.use((config) => {
  // Token automatically included with httpOnly cookies
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
      try {
        await axios.post('/auth/refresh');
        return axios.request(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
\`\`\`

## 3. Protected Routes
Create a PrivateRoute component:

\`\`\`jsx
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return user ? children : <Navigate to="/login" />;
};
\`\`\`

This approach provides better security than localStorage while maintaining a good user experience.`,
      author: {
        name: 'auth_expert',
        reputation: 4850
      },
      votes: 23,
      isAccepted: true,
      createdAt: new Date('2024-01-10T14:20:00Z')
    },
    {
      id: 'a2',
      content: `I'd also add that you should consider using a library like **React Query** or **SWR** for handling authentication state and API calls. Here's why:

## Benefits:
- Automatic background refetching
- Built-in error handling  
- Caching and synchronization
- Loading states

## Example with React Query:
\`\`\`jsx
const useAuth = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get('/auth/me'),
    retry: false,
    refetchOnWindowFocus: false
  });
};
\`\`\`

This pairs really well with the httpOnly cookie approach mentioned in the accepted answer!`,
      author: {
        name: 'react_guru',
        reputation: 3200
      },
      votes: 8,
      isAccepted: false,
      createdAt: new Date('2024-01-11T09:15:00Z')
    }
  ]
};

export const QuestionDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [question, setQuestion] = useState(mockQuestion);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const handleVote = async (type: 'up' | 'down', targetType: 'question' | 'answer', targetId?: string) => {
    // Mock vote handling
    toast({
      title: "Vote registered",
      description: `Your ${type}vote has been recorded.`,
    });
  };

  const handleAcceptAnswer = async (answerId: string) => {
    setQuestion(prev => ({
      ...prev,
      answers: prev.answers.map(answer => ({
        ...answer,
        isAccepted: answer.id === answerId
      }))
    }));
    
    toast({
      title: "Answer accepted",
      description: "This answer has been marked as the accepted solution.",
    });
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setIsSubmittingAnswer(true);
    
    // Mock answer submission
    setTimeout(() => {
      const answer = {
        id: `a${Date.now()}`,
        content: newAnswer,
        author: {
          name: 'current_user',
          reputation: 150
        },
        votes: 0,
        isAccepted: false,
        createdAt: new Date()
      };

      setQuestion(prev => ({
        ...prev,
        answers: [...prev.answers, answer]
      }));
      
      setNewAnswer('');
      setIsSubmittingAnswer(false);
      
      toast({
        title: "Answer posted!",
        description: "Your answer has been published successfully.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/questions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Link>
          </Button>

          {/* Question */}
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Vote Section */}
                <div className="flex-shrink-0">
                  <VoteButtons
                    votes={question.votes}
                    onVote={(type) => handleVote(type, 'question')}
                    orientation="vertical"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-4">
                      {question.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Viewed {question.views} times
                      </div>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: question.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`(.*?)`/g, '<code>$1</code>')
                        .replace(/^## (.+)/gm, '<h2>$1</h2>')
                        .replace(/^- (.+)/gm, '<li>$1</li>')
                        .replace(/\n/g, '<br>')
                    }} />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <Link key={tag} to={`/questions?tag=${tag}`}>
                        <Badge variant="secondary" className="tag">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>

                  {/* Author and Actions */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4 mr-1" />
                        Flag
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <Link 
                          to={`/users/${question.author.name}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {question.author.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {question.author.reputation} reputation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answers */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
            </h2>

            {question.answers.map((answer) => (
              <Card key={answer.id} className={`glass-card ${answer.isAccepted ? 'ring-2 ring-success/50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Vote Section */}
                    <div className="flex-shrink-0">
                      <VoteButtons
                        votes={answer.votes}
                        onVote={(type) => handleVote(type, 'answer', answer.id)}
                        isAccepted={answer.isAccepted}
                        onAccept={() => handleAcceptAnswer(answer.id)}
                        canAccept={true} // In real app, check if current user is question author
                        orientation="vertical"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      {answer.isAccepted && (
                        <div className="flex items-center gap-2 text-success text-sm font-medium">
                          <Crown className="h-4 w-4" />
                          Accepted Answer
                        </div>
                      )}

                      <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ 
                          __html: answer.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/`(.*?)`/g, '<code>$1</code>')
                            .replace(/^## (.+)/gm, '<h2>$1</h2>')
                            .replace(/^- (.+)/gm, '<li>$1</li>')
                            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
                            .replace(/\n/g, '<br>')
                        }} />
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Flag className="h-4 w-4 mr-1" />
                            Flag
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">
                            answered {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                          </span>
                          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <Link 
                              to={`/users/${answer.author.name}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {answer.author.name}
                            </Link>
                            <div className="text-xs text-muted-foreground">
                              {answer.author.reputation} reputation
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-8" />

          {/* Answer Form */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <RichTextEditor
                  value={newAnswer}
                  onChange={setNewAnswer}
                  placeholder="Write your answer here. Be clear and provide examples when possible..."
                  minHeight="250px"
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingAnswer || !newAnswer.trim()}
                    variant="premium"
                  >
                    {isSubmittingAnswer ? 'Posting...' : 'Post Your Answer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};