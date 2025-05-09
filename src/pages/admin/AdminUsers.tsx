import React, { useEffect, useState } from 'react';

const AdminUsers: React.FC = () => {
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (department) {
      switch (department) {
        case 'Design':
          setRole('Designer');
          break;
        case 'Prepress':
          setRole('Prepress');
          break;
        case 'Sales':
          setRole('Sales');
          break;
        case 'Production':
          setRole('Production');
          break;
        default:
          setRole('');
      }
    }
  }, [department]);

  return (
    <div>
      {/* Add department dropdown: */}
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Department</option>
        <option value="Design">Design</option>
        <option value="Prepress">Prepress</option>
        <option value="Sales">Sales</option>
        <option value="Production">Production</option>
      </select>
    </div>
  );
};

export default AdminUsers; 