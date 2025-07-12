import { RichTextEditor } from '@/components/RichTextEditor';
import { Header, VoteButtons } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { acceptAnswer, createAnswer, getQuestionById, voteOnAnswer, deleteQuestion, getProfile } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Bookmark, Clock, Crown, Eye, Flag, Loader2, Share, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export const QuestionDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch question details
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const questionResponse = await getQuestionById(id);
        if (questionResponse.error) {
          throw new Error(questionResponse.error);
        }
        
        setQuestion(questionResponse.question);
        
        // Question data already includes answers from the API
        if (questionResponse.question.answers) {
          setAnswers(questionResponse.question.answers);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch question');
        console.error('Error fetching question:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  // Fetch current user profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        if (res.user) setCurrentUser(res.user);
      } catch {}
    }
    fetchProfile();
  }, []);

  const handleVote = async (type: 'up' | 'down', targetType: 'question' | 'answer', targetId?: string) => {
    if (targetType === 'answer' && targetId) {
      try {
        const response = await voteOnAnswer(targetId, type);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Update the answer in the local state
        setAnswers(prev => prev.map(answer => 
          answer.id === targetId 
            ? { ...answer, voteCount: response.voteCount }
            : answer
        ));
        
        toast({
          title: "Vote registered",
          description: response.message,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : 'Failed to vote',
          variant: "destructive",
        });
      }
    } else {
      // TODO: Implement question voting when backend supports it
    toast({
      title: "Vote registered",
      description: `Your ${type}vote has been recorded.`,
    });
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      const response = await acceptAnswer(answerId);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Update answers to show only this one as accepted
      setAnswers(prev => prev.map(answer => ({
        ...answer,
        isAccepted: answer.id === answerId
      })));
    
    toast({
      title: "Answer accepted",
      description: "This answer has been marked as the accepted solution.",
    });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to accept answer',
        variant: "destructive",
      });
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim() || !id) return;

    setIsSubmittingAnswer(true);
    
    try {
      const response = await createAnswer(id, newAnswer);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Add the new answer to the list
      setAnswers(prev => [...prev, response.answer]);
      setNewAnswer('');
      
      toast({
        title: "Answer posted!",
        description: "Your answer has been published successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to post answer',
        variant: "destructive",
      });
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) return;
    try {
      const res = await deleteQuestion(id);
      if (res.error) throw new Error(res.error);
      toast({ title: 'Question deleted', description: 'Your question has been deleted.' });
      navigate('/questions');
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete question', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading question...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Error loading question</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild variant="default">
              <Link to="/questions">Back to Questions</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Question not found</h3>
            <p className="text-muted-foreground mb-4">The question you're looking for doesn't exist.</p>
            <Button asChild variant="default">
              <Link to="/questions">Back to Questions</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/questions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Question */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Vote Section */}
                <div className="flex-shrink-0">
                  <VoteButtons
                      votes={0} // TODO: Implement voting
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
                          Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                          Viewed 0 times {/* TODO: Implement views */}
                        </div>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                        __html: question.description || 'No description provided.'
                    }} />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                      {question.tags?.map((tag: string) => (
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
                      {currentUser && question.author?.id === currentUser.id && (
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                          Delete
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                        </span>
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <Link 
                            to={`/users/${question.author?.username}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                            {question.author?.username || 'Unknown User'}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                            New member
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
                {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </h2>

              {answers.map((answer) => (
              <Card key={answer.id} className={`glass-card ${answer.isAccepted ? 'ring-2 ring-success/50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Vote Section */}
                    <div className="flex-shrink-0">
                      <VoteButtons
                          votes={answer.voteCount?.total || 0}
                        onVote={(type) => handleVote(type, 'answer', answer.id)}
                        isAccepted={answer.isAccepted}
                        onAccept={() => handleAcceptAnswer(answer.id)}
                          canAccept={true} // TODO: Check if current user is question author
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
                            __html: answer.content || 'No content provided.'
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
                              answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                          </span>
                          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <Link 
                                to={`/users/${answer.author?.username}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                                {answer.author?.username || 'Unknown User'}
                            </Link>
                            <div className="text-xs text-muted-foreground">
                                Member
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
                      variant="default"
                  >
                    {isSubmittingAnswer ? 'Posting...' : 'Post Your Answer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="glass-card">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Question Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Asked</span>
                      <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Viewed</span>
                      <span>0 times</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Answers</span>
                      <span>{answers.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Related Questions</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">No related questions found.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};