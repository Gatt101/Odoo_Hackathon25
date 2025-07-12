import { useEffect, useState } from 'react';
import { getProfile } from '../lib/api';
import { Header } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';

export const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfile();
        if (res.user) {
          setUser(res.user);
        } else {
          setError(res.error || 'Failed to load profile');
        }
      } catch (err) {
        setError('Failed to load profile');
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">No user data</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-xl mx-auto">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-2">{user.username || 'No username'}</h1>
                <p className="text-muted-foreground mb-2">{user.email || 'No email'}</p>
              </div>
              {user.bio && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
              )}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <strong>Joined:</strong>{' '}
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 