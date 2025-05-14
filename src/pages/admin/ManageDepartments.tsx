
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Department } from '@/types';
import { useUsers } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { ArrowUpDown } from 'lucide-react';

const departmentColors: Record<string, string> = {
  'Sales': 'bg-blue-100 text-blue-800',
  'Design': 'bg-purple-100 text-purple-800',
  'Prepress': 'bg-amber-100 text-amber-800',
  'Production': 'bg-green-100 text-green-800',
  'Admin': 'bg-gray-100 text-gray-800',
};

const ManageDepartments = () => {
  const { users } = useUsers();
  const [sort, setSort] = useState<{column: string, direction: 'asc' | 'desc'}>({
    column: 'name',
    direction: 'asc'
  });

  // Count users by department
  const departmentCounts: Record<string, number> = users.reduce((counts, user) => {
    const dept = user.department;
    counts[dept] = (counts[dept] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Get unique departments
  const departments = Array.from(new Set(users.map(user => user.department)));
  
  // Sort departments
  const sortedDepartments = [...departments].sort((a, b) => {
    if (sort.column === 'name') {
      return sort.direction === 'asc' 
        ? a.localeCompare(b)
        : b.localeCompare(a);
    } else { // sort by count
      const countA = departmentCounts[a] || 0;
      const countB = departmentCounts[b] || 0;
      return sort.direction === 'asc'
        ? countA - countB
        : countB - countA;
    }
  });

  const handleSort = (column: string) => {
    setSort(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const [newDepartment, setNewDepartment] = useState('');
  
  const handleAddDepartment = () => {
    if (newDepartment.trim() === '') {
      toast.error('Department name cannot be empty');
      return;
    }
    
    if (departments.includes(newDepartment as Department)) {
      toast.error('Department already exists');
      return;
    }
    
    // In a real app, you would add the department to the database
    toast.success(`Department "${newDepartment}" added successfully`);
    setNewDepartment('');
    
    // Refresh departments list would happen here in a real app
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Departments</h1>
      
      {/* Add New Department */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="departmentName">Department Name</Label>
              <Input 
                id="departmentName"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Enter department name"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddDepartment}>Add Department</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Departments List */}
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] cursor-pointer" onClick={() => handleSort('name')}>
                  Department Name
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('count')}>
                  Users
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDepartments.map((department) => (
                <TableRow key={department}>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded ${departmentColors[department] || 'bg-gray-100'}`}>
                      {department}
                    </span>
                  </TableCell>
                  <TableCell>{departmentCounts[department] || 0}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-800"
                      disabled={departmentCounts[department] > 0}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {departments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No departments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageDepartments;
