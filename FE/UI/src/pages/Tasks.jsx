import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext'; // Theme context
import { taskService } from '../services/taskService';
import TaskList from '../components/tasks/TaskList';
import './Tasks.css';

const Tasks = () => {
    const { theme } = useTheme(); // Get theme from context
    const [filters, setFilters] = useState({
        status: 'ALL',
        priority: 'ALL',
        search: '',
    });

    // Apply the theme to the body
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks', filters.search, filters.status, filters.priority],
        queryFn: () =>
            taskService.searchTasks(filters.search, filters.status, filters.priority),
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="tasks-page">
            <h1 className="page-title">Task Management</h1>
            <div className="filters-container">
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="filter-input"
                    placeholder="Search Tasks"
                />
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="ALL">All</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                </select>
                <select
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="ALL">All</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
            </div>

            {/* Task List */}
            <TaskList tasks={tasks || []} isLoading={isLoading} />
        </div>
    );
};

export default Tasks;