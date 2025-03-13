import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import { Button, Input, Select, Alert, Loading } from '../components/common/Common';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import './UserManagement.css';

const UserManagement = () => {
  const { theme } = useTheme();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => authService.getAllUsers(),
  });

  const createUserMutation = useMutation({
    mutationFn: (userData) => authService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateModalOpen(false);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) => authService.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedUser(null);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => authService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isLoading) {
    return (
        <div className="loading-container">
          <Loading size="lg" />
        </div>
    );
  }

  return (
      <div className="user-management-container">
        <div className="header">
          <h1 className="title">User Management</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <UserPlus /> Add User
          </Button>
        </div>

        <div className="table-container">
          <table className="user-table">
            <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users?.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div>{user.username}</div>
                      <div>{user.email}</div>
                    </div>
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <div className="action-buttons">
                      <Button onClick={() => setSelectedUser(user)}>
                        <Edit />
                      </Button>
                      <Button onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {isCreateModalOpen && (
            <UserFormModal
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={(data) => createUserMutation.mutate(data)}
            />
        )}

        {selectedUser && (
            <UserFormModal
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onSubmit={(data) =>
                    updateUserMutation.mutate({
                      userId: selectedUser.id,
                      userData: data,
                    })
                }
            />
        )}
      </div>
  );
};

const UserFormModal = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    username: user?.username || '',
    role: user?.role || 'VIEWER',
    jobTitle: user?.jobTitle || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3>{user ? 'Edit User' : 'Create User'}</h3>
            <button onClick={onClose}>&times;</button>
          </div>
          <form onSubmit={handleSubmit}>
            <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <Input
                label="Job Title"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            />
            <Select
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                options={[
                  { value: 'VIEWER', label: 'Viewer' },
                  { value: 'EDITOR', label: 'Editor' },
                  { value: 'ADMIN', label: 'Admin' },
                ]}
            />
            <div className="modal-actions">
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default UserManagement;