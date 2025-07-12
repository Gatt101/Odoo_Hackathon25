import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
    ArrowDown,
    ArrowUp,
    Check,
    Clock,
    Eye,
    LogOut,
    Menu,
    MessageSquare,
    Plus,
    Search,
    Settings,
    User,
    X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationDropdown } from './NotificationDropdown';

// Header Component
export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 hover:scale-105">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center bounce-in">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="gradient-text text-xl font-bold">StackIt</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4 sm:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary transition-all duration-300 hover:shadow-md"
              />
            </div>
          </form>

          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <Button asChild variant="accent" size="sm" className="hidden sm:flex transition-all duration-300 hover:scale-105">
                  <Link to="/ask">
                    <Plus className="h-4 w-4" />
                    Ask Question
                  </Link>
                </Button>

                <NotificationDropdown />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:scale-105">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 fade-in">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">john@example.com</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild variant="default" size="sm" className="transition-all duration-300 hover:scale-105">
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}

            <Button variant="ghost" size="icon" className="sm:hidden transition-all duration-300 hover:scale-105">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Vote Buttons Component
interface VoteButtonsProps {
  votes: number;
  userVote?: 'up' | 'down' | null;
  onVote: (voteType: 'up' | 'down') => void;
  isAccepted?: boolean;
  onAccept?: () => void;
  canAccept?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  votes,
  userVote,
  onVote,
  isAccepted = false,
  onAccept,
  canAccept = false,
  orientation = 'vertical'
}) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isVoting) return;
    setIsVoting(true);
    await onVote(voteType);
    setIsVoting(false);
  };

  const containerClasses = cn(
    "flex items-center gap-1",
    orientation === 'vertical' ? 'flex-col' : 'flex-row'
  );

  return (
    <div className={containerClasses}>
      <Button
        variant="vote"
        size="vote"
        onClick={() => handleVote('up')}
        disabled={isVoting}
        className={cn(
          "vote-button",
          userVote === 'up' && "border-success bg-success/10 text-success hover:border-success"
        )}
      >
        <ArrowUp className={cn(
          "h-4 w-4 transition-colors",
          userVote === 'up' ? "text-success" : "text-muted-foreground"
        )} />
      </Button>

      <span className={cn(
        "font-medium text-sm min-w-[2rem] text-center",
        votes > 0 ? "text-success" : votes < 0 ? "text-destructive" : "text-muted-foreground"
      )}>
        {votes}
      </span>

      <Button
        variant="vote"
        size="vote"
        onClick={() => handleVote('down')}
        disabled={isVoting}
        className={cn(
          "vote-button",
          userVote === 'down' && "border-destructive bg-destructive/10 text-destructive hover:border-destructive"
        )}
      >
        <ArrowDown className={cn(
          "h-4 w-4 transition-colors",
          userVote === 'down' ? "text-destructive" : "text-muted-foreground"
        )} />
      </Button>

      {canAccept && (
        <Button
          variant="vote"
          size="vote"
          onClick={onAccept}
          className={cn(
            "vote-button mt-2",
            isAccepted && "border-success bg-success/20 text-success hover:border-success"
          )}
          title={isAccepted ? "Accepted answer" : "Accept this answer"}
        >
          <Check className={cn(
            "h-4 w-4 transition-colors",
            isAccepted ? "text-success" : "text-muted-foreground"
          )} />
        </Button>
      )}
    </div>
  );
};

// Tag Input Component
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  suggestions?: string[];
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = "Add tags...",
  maxTags = 5,
  suggestions = [
    'javascript', 'react', 'typescript', 'node.js', 'python', 'css', 'html',
    'database', 'api', 'frontend', 'backend', 'mobile', 'web-development',
    'algorithms', 'data-structures', 'debugging', 'performance', 'testing'
  ]
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(suggestion)
        )
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setActiveSuggestionIndex(-1);
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue, suggestions, tags]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
      setFilteredSuggestions([]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
        addTag(filteredSuggestions[activeSuggestionIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setFilteredSuggestions([]);
      setActiveSuggestionIndex(-1);
      inputRef.current?.blur();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const canAddMoreTags = tags.length < maxTags;

  return (
    <div className="space-y-2 stagger-in">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={tag}
              variant="secondary"
              className="tag group flex items-center gap-1 pr-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tag}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <div className={cn(
          "flex items-center border border-border rounded-lg bg-background transition-all duration-300",
          isInputFocused && "ring-2 ring-ring ring-offset-2 shadow-md",
          !canAddMoreTags && "opacity-50"
        )}>
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsInputFocused(false);
                setFilteredSuggestions([]);
              }, 200);
            }}
            placeholder={canAddMoreTags ? placeholder : `Maximum ${maxTags} tags allowed`}
            disabled={!canAddMoreTags}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          
          {inputValue.trim() && canAddMoreTags && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addTag(inputValue)}
              className="mr-2 h-6 w-6 p-0 transition-all duration-200 hover:scale-110"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {filteredSuggestions.length > 0 && isInputFocused && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto fade-in">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-all duration-200",
                  index === activeSuggestionIndex && "bg-accent text-accent-foreground"
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {tags.length}/{maxTags} tags used
        </span>
        <span>
          Press Enter to add, Backspace to remove
        </span>
      </div>
    </div>
  );
};

// Question Card Component
interface QuestionCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  createdAt: Date;
  hasAcceptedAnswer?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  title,
  content,
  author,
  tags,
  votes,
  answers,
  views,
  createdAt,
  hasAcceptedAnswer
}) => {
  const truncatedContent = content.length > 150 ? content.substring(0, 150) + '...' : content;

  return (
    <Card className="question-card glass-card hover:glow-primary">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground min-w-[60px]">
            <div className="flex flex-col items-center">
              <span className={`font-medium ${votes > 0 ? 'text-success' : votes < 0 ? 'text-destructive' : ''}`}>
                {votes}
              </span>
              <span className="text-xs">votes</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className={`font-medium ${hasAcceptedAnswer ? 'text-success' : answers > 0 ? 'text-primary' : ''}`}>
                {answers}
              </span>
              <span className="text-xs">answers</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="font-medium">{views}</span>
              <span className="text-xs">views</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <Link 
              to={`/questions/${id}`}
              className="block group"
            >
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-all duration-300 line-clamp-2">
                {title}
              </h3>
            </Link>

            <p className="text-muted-foreground text-sm line-clamp-2">
              {truncatedContent}
            </p>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Link key={tag} to={`/questions?tag=${tag}`}>
                  <Badge 
                    variant="secondary" 
                    className="tag"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-3 w-3" />
                </div>
                <Link 
                  to={`/users/${author.name}`}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {author.name}
                </Link>
                <span className="text-xs">({author.reputation} rep)</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex sm:hidden justify-between mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <ArrowUp className="h-3 w-3" />
            <span>{votes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-3 w-3" />
            <span>{answers}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{views}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};