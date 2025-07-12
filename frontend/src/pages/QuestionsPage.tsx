import { Header, QuestionCard } from '@/components/shared';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getQuestions } from '@/lib/api';
import { Filter, Loader2, Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Transform API response to match QuestionCard component interface
const transformApiQuestionToCardProps = (apiQuestion: any) => ({
  id: apiQuestion.id,
  title: apiQuestion.title,
  content: apiQuestion.description,
  author: {
    name: apiQuestion.author?.username || 'Unknown User',
    avatar: apiQuestion.author?.avatar,
    reputation: 0 // Placeholder - could be calculated from user's total votes
  },
  tags: apiQuestion.tags || [],
  votes: apiQuestion.totalVotes || 0, // Now using real vote counts from backend
  answers: apiQuestion._count?.answers || 0,
  views: 0, // Placeholder - views would need to be implemented in the backend
  createdAt: new Date(apiQuestion.createdAt),
  hasAcceptedAnswer: apiQuestion.hasAcceptedAnswer || false // Now using real accepted status
});

export const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

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

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '10');
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Map frontend sort values to backend sort values
      let backendSortBy = 'createdAt';
      let sortOrder = 'desc';
      
      switch (sortBy) {
        case 'newest':
          backendSortBy = 'createdAt';
          sortOrder = 'desc';
          break;
        case 'active':
          backendSortBy = 'updatedAt';
          sortOrder = 'desc';
          break;
        case 'votes':
          backendSortBy = 'votes'; // Now properly implemented
          sortOrder = 'desc';
          break;
        case 'views':
          backendSortBy = 'createdAt'; // Placeholder - views not implemented yet
          sortOrder = 'desc';
          break;
        case 'unanswered':
          backendSortBy = 'createdAt';
          sortOrder = 'desc';
          break;
      }
      
      params.append('sortBy', backendSortBy);
      params.append('sortOrder', sortOrder);
      
      // Add filter parameter
      params.append('filter', filterBy);
      
      const response = await getQuestions(`?${params.toString()}`);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Transform API data to match QuestionCard component interface
      const transformedQuestions = response.questions.map(transformApiQuestionToCardProps);
      
      // Server-side filtering is now handled by the backend
      setQuestions(transformedQuestions);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalCount(response.pagination?.totalCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions when component mounts or when dependencies change
  useEffect(() => {
    fetchQuestions();
  }, [currentPage, sortBy, filterBy]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchQuestions();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilterBy: string) => {
    setFilterBy(newFilterBy);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">All Questions</h1>
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${totalCount} questions found`}
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

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-destructive/50 text-destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="bg-background/50"
                />
                
                <Select value={sortBy} onValueChange={handleSortChange}>
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

                <Select value={filterBy} onValueChange={handleFilterChange}>
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
                  <span className="font-medium">{totalCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Answers</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tags</span>
                  <span className="font-medium">-</span>
                </div>
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
                  onClick={() => handleSortChange(option.value)}
                  className="whitespace-nowrap"
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading questions...</span>
              </div>
            )}

            {/* Questions List */}
            {!loading && (
              <div className="space-y-4">
                {questions.length > 0 ? (
                  questions.map((question: any) => (
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
            )}

            {/* Pagination */}
            {!loading && questions.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};