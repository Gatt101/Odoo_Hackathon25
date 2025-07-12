import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, TrendingUp, Clock, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header, QuestionCard } from '@/components/shared';

// Mock data
const mockQuestions = [
  {
    id: '1',
    title: 'How to implement authentication in React with JWT tokens?',
    content: 'I\'m building a React application and need to implement user authentication using JWT tokens. What\'s the best approach for handling token storage, refresh tokens, and protecting routes?',
    author: {
      name: 'sarah_dev',
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
    title: 'Optimizing database queries for large datasets',
    content: 'Working with a PostgreSQL database containing millions of records. Query performance is becoming an issue. What are the best practices for optimization?',
    author: {
      name: 'db_master',
      reputation: 2850
    },
    tags: ['postgresql', 'database', 'performance', 'optimization'],
    votes: 23,
    answers: 12,
    views: 567,
    createdAt: new Date('2024-01-09T14:20:00Z'),
    hasAcceptedAnswer: false
  },
  {
    id: '3',
    title: 'CSS Grid vs Flexbox: When to use which?',
    content: 'I often get confused about when to use CSS Grid versus Flexbox for layouts. Can someone explain the key differences and provide practical examples?',
    author: {
      name: 'css_ninja',
      reputation: 890
    },
    tags: ['css', 'flexbox', 'grid', 'layout'],
    votes: 8,
    answers: 5,
    views: 234,
    createdAt: new Date('2024-01-08T09:15:00Z'),
    hasAcceptedAnswer: true
  },
  {
    id: '4',
    title: 'Understanding TypeScript generics with practical examples',
    content: 'TypeScript generics seem powerful but I\'m struggling to understand when and how to use them effectively. Looking for clear, practical examples.',
    author: {
      name: 'type_enthusiast',
      reputation: 1650
    },
    tags: ['typescript', 'generics', 'javascript'],
    votes: 19,
    answers: 9,
    views: 445,
    createdAt: new Date('2024-01-07T16:45:00Z'),
    hasAcceptedAnswer: false
  },
  {
    id: '5',
    title: 'Implementing real-time features with WebSockets',
    content: 'Need to add real-time notifications and live updates to my web application. What\'s the best approach using WebSockets, and are there any alternatives?',
    author: {
      name: 'realtime_dev',
      reputation: 2100
    },
    tags: ['websockets', 'realtime', 'node.js', 'socket.io'],
    votes: 12,
    answers: 6,
    views: 298,
    createdAt: new Date('2024-01-06T11:30:00Z'),
    hasAcceptedAnswer: false
  }
];

export const QuestionsPage = () => {
  const [questions, setQuestions] = useState(mockQuestions);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'active', label: 'Active' },
    { value: 'votes', label: 'Most Votes' },
    { value: 'views', label: 'Most Views' },
    { value: 'unanswered', label: 'Unanswered' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Questions' },
    { value: 'answered', label: 'Answered' },
    { value: 'unanswered', label: 'Unanswered' },
    { value: 'accepted', label: 'Has Accepted Answer' }
  ];

  const filteredAndSortedQuestions = React.useMemo(() => {
    let filtered = [...questions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'answered':
        filtered = filtered.filter(q => q.answers > 0);
        break;
      case 'unanswered':
        filtered = filtered.filter(q => q.answers === 0);
        break;
      case 'accepted':
        filtered = filtered.filter(q => q.hasAcceptedAnswer);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'votes':
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'active':
        // For demo, just use creation date
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'unanswered':
        filtered = filtered.filter(q => q.answers === 0).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      default: // newest
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return filtered;
  }, [questions, sortBy, filterBy, searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">All Questions</h1>
            <p className="text-muted-foreground">
              {filteredAndSortedQuestions.length} questions found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <Button asChild variant="accent" className="flex-1 sm:flex-none">
              <Link to="/ask">
                <Plus className="h-4 w-4" />
                Ask Question
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Search & Filter
              </h3>
              <div className="space-y-3">
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background/50"
                />
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <h3 className="font-semibold">Community Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Answers</span>
                  <span className="font-medium">3,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-medium">567</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tags</span>
                  <span className="font-medium">89</span>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="space-y-3">
              <h3 className="font-semibold">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['javascript', 'react', 'typescript', 'node.js', 'python', 'css'].map(tag => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm(tag)}
                    className="text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Tabs (Mobile) */}
            <div className="flex lg:hidden gap-2 mb-6 overflow-x-auto pb-2">
              {sortOptions.map(option => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option.value)}
                  className="whitespace-nowrap"
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredAndSortedQuestions.length > 0 ? (
                filteredAndSortedQuestions.map(question => (
                  <QuestionCard key={question.id} {...question} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterBy !== 'all' 
                      ? 'Try adjusting your search or filters.' 
                      : 'Be the first to ask a question!'
                    }
                  </p>
                  <Button asChild variant="default">
                    <Link to="/ask">Ask the First Question</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination (placeholder) */}
            {filteredAndSortedQuestions.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};