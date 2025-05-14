
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, PenSquare, Trash2, ChevronDown } from 'lucide-react';
import { User } from '@/types';
import { useUsers } from '@/contexts/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ManageUsers = () => {
  const navigate = useNavigate();
  const { users, removeUser } = useUsers();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterDepartment, setFilterDepartment] = React.useState<string | null>(null);
  const [filterRole, setFilterRole] = React.useState<string | null>(null);

  // Get unique departments and roles for filters
  const departments = Array.from(new Set(users.map(user => user.department)));
  const roles = Array.from(new Set(users.map(user => user.role)));

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Apply search filter
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply department filter
    if (filterDepartment && user.department !== filterDepartment) {
      return false;
    }
    
    // Apply role filter
    if (filterRole && user.role !== filterRole) {
      return false;
    }
    
    return true;
  });

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getDepartmentColor = (department: string) => {
    const colorMap: Record<string, string> = {
      'Sales': 'bg-blue-100 text-blue-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Prepress': 'bg-amber-100 text-amber-800',
      'Production': 'bg-green-100 text-green-800',
      'Admin': 'bg-gray-100 text-gray-800',
    };
    
    return colorMap[department] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: Record<string, string> = {
      'Admin': 'bg-red-100 text-red-800 border-red-200',
      'Manager': 'bg-green-100 text-green-800 border-green-200',
      'Staff': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    
    return colorMap[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      removeUser(user.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Button onClick={() => navigate('/admin/users/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      {filterDepartment || 'All Departments'}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterDepartment(null)}>
                      All Departments
                    </DropdownMenuItem>
                    {departments.map(dept => (
                      <DropdownMenuItem 
                        key={dept} 
                        onClick={() => setFilterDepartment(dept)}
                      >
                        {dept}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      {filterRole || 'All Roles'}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterRole(null)}>
                      All Roles
                    </DropdownMenuItem>
                    {roles.map(role => (
                      <DropdownMenuItem 
                        key={role} 
                        onClick={() => setFilterRole(role)}
                      >
                        {role}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Users list */}
            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium">
                <div className="col-span-5">User</div>
                <div className="col-span-3">Department</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Actions</div>
              </div>
              
              <div>
                {filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center"
                  >
                    <div className="col-span-5 flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <Badge className={`font-normal ${getDepartmentColor(user.department)}`}>
                        {user.department}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline" className={`font-normal ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredUsers.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No users found matching your filters
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
