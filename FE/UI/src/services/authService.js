const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const mockUsers = [
    { id: 1, username: 'johndoe', email: 'john.doe@example.com', role: 'ADMIN', jobTitle: 'Manager' },
    { id: 2, username: 'janedoe', email: 'jane.doe@example.com', role: 'EDITOR', jobTitle: 'Developer' },
    { id: 3, username: 'guestuser', email: 'guest@example.com', role: 'VIEWER', jobTitle: 'Intern' },
];

export const authService = {
    getAllUsers: async () => {
        if (useMock) {
            console.log('Mock getAllUsers called');
            return Promise.resolve(mockUsers);
        }
        // Real API call here
        return api.get('/users');
    },

    createUser: async (userData) => {
        if (useMock) {
            console.log('Mock createUser called:', userData);
            const newUser = { id: mockUsers.length + 1, ...userData };
            mockUsers.push(newUser);
            return Promise.resolve(newUser);
        }
        // Real API call here
        return api.post('/users', userData);
    },

    updateUser: async (userId, userData) => {
        if (useMock) {
            console.log(`Mock updateUser called for ID ${userId}:`, userData);
            const userIndex = mockUsers.findIndex((user) => user.id === userId);
            if (userIndex !== -1) {
                mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
                return Promise.resolve(mockUsers[userIndex]);
            }
            throw new Error('User not found');
        }
        // Real API call here
        return api.put(`/users/${userId}`, userData);
    },

    deleteUser: async (userId) => {
        if (useMock) {
            console.log(`Mock deleteUser called for ID ${userId}`);
            const userIndex = mockUsers.findIndex((user) => user.id === userId);
            if (userIndex !== -1) {
                mockUsers.splice(userIndex, 1);
                return Promise.resolve({ success: true });
            }
            throw new Error('User not found');
        }
        // Real API call here
        return api.delete(`/users/${userId}`);
    },
};