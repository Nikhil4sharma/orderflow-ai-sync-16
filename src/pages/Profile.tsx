
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Profile = () => {
  const { currentUser, logout } = useUsers();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt={currentUser.name} />
              <AvatarFallback className="text-2xl">{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-2 flex-1">
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              <p className="text-muted-foreground">{currentUser.email}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{currentUser.department}</Badge>
                <Badge variant="outline">{currentUser.role}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentUser.permissions.map(permission => (
              <Badge key={permission} variant="outline">
                {permission.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Account Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="ghost" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Notification Preferences
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
