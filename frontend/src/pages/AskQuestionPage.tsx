import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Lightbulb, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Header, TagInput } from '@/components/shared';
import { useToast } from '@/hooks/use-toast';

export const AskQuestionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title is required",
        description: "Please provide a clear, descriptive title for your question.",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content is required", 
        description: "Please provide details about your question.",
        variant: "destructive"
      });
      return;
    }

    if (tags.length === 0) {
      toast({
        title: "Tags are required",
        description: "Please add at least one tag to help categorize your question.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Question posted successfully!",
        description: "Your question has been published and is now visible to the community.",
      });
      setIsSubmitting(false);
      navigate('/questions');
    }, 1500);
  };

  const writingTips = [
    {
      icon: HelpCircle,
      title: "Be specific and clear",
      description: "Write a title that summarizes your specific problem. Include relevant details in your question."
    },
    {
      icon: Lightbulb,
      title: "Show your research",
      description: "Share what you've tried and what didn't work. This helps others understand your situation better."
    },
    {
      icon: CheckCircle,
      title: "Use proper formatting",
      description: "Format your code, use bullet points for lists, and structure your question for easy reading."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-3xl font-bold gradient-text mb-2">Ask a Public Question</h1>
                <p className="text-muted-foreground">
                  Get help from millions of developers around the world
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">
                    Title
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Be specific and imagine you're asking a question to another person
                  </p>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., How to implement authentication in React with JWT tokens?"
                    className="text-base"
                    maxLength={150}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {title.length}/150 characters
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    What are the details of your problem?
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Introduce the problem and expand on what you put in the title. 
                    Minimum 20 characters.
                  </p>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Describe your problem in detail. Include what you've tried, what you expected to happen, and what actually happened."
                    minHeight="300px"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {content.length} characters (minimum 20)
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    Tags
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Add up to 5 tags to describe what your question is about
                  </p>
                  <TagInput
                    tags={tags}
                    onChange={setTags}
                    placeholder="e.g., javascript react typescript"
                    maxTags={5}
                  />
                </div>

                {/* Review Section */}
                {(title || content || tags.length > 0) && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Review your question:</strong> Make sure your title is clear, 
                      your problem is well-explained, and you've added relevant tags.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !title.trim() || !content.trim() || tags.length === 0}
                    variant="premium"
                    size="lg"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Your Question'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar Tips */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-accent" />
                      Writing a good question
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {writingTips.map((tip, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <tip.icon className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm">{tip.title}</h4>
                            <p className="text-xs text-muted-foreground">{tip.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-base">Step-by-step guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">1</span>
                        Summarize your problem in a one-line title
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">2</span>
                        Describe your problem in more detail
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">3</span>
                        Add tags to help people find your question
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">4</span>
                        Review your question and publish
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};