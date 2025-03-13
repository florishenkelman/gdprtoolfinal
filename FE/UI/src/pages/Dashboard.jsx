import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import { taskService } from '../services/taskService';
import { gdprService } from '../services/gdprService';
import { authService } from '../services/authService';
import DashboardReport from '../components/report/DashboardReport';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Users, CheckCircle, Clock, BookOpen } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import './Dashboard.css'; // CSS file for styling

const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getAllTasks,
  });

  const { data: gdprArticles, isLoading: gdprLoading } = useQuery({
    queryKey: ['gdprArticles'],
    queryFn: gdprService.getAllArticles,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: authService.getAllUsers,
  });

  if (tasksLoading || gdprLoading || usersLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  const taskStats = {
    total: tasks?.length || 0,
    completed: tasks?.filter((task) => task.status === 'CLOSED').length || 0,
    pending: tasks?.filter((task) => task.status === 'IN_PROGRESS').length || 0,
    open: tasks?.filter((task) => task.status === 'OPEN').length || 0,
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      lightBg: '#E3F2FD',
      darkBg: '#0D47A1',
      lightTextColor: '#0D47A1',
      darkTextColor: '#FFFFFF',
    },
    {
      title: 'Completed Tasks',
      value: taskStats.completed,
      icon: CheckCircle,
      lightBg: '#E8F5E9',
      darkBg: '#1B5E20',
      lightTextColor: '#1B5E20',
      darkTextColor: '#FFFFFF',
    },
    {
      title: 'Pending Tasks',
      value: taskStats.pending,
      icon: Clock,
      lightBg: '#FFF8E1',
      darkBg: '#FF6F00',
      lightTextColor: '#FF6F00',
      darkTextColor: '#FFFFFF',
    },
    {
      title: 'GDPR Articles',
      value: gdprArticles?.length || 0,
      icon: BookOpen,
      lightBg: '#F3E5F5',
      darkBg: '#6A1B9A',
      lightTextColor: '#6A1B9A',
      darkTextColor: '#FFFFFF',
    },
  ];

  const taskActivityData = calculateTaskActivity(tasks || []);
  const taskStatusData = [
    { name: 'Completed', value: taskStats.completed },
    { name: 'In Progress', value: taskStats.pending },
    { name: 'Not Started', value: taskStats.open },
  ];

  const COLORS = ['#10B981', '#3B82F6', '#EF4444'];

  return (
      <div className={`dashboard-container ${isDark ? 'dark' : ''}`}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <PDFDownloadLink
                document={
                  <DashboardReport
                      stats={statsCards}
                      taskActivityData={taskActivityData}
                      taskStatusData={taskStatusData}
                      recentTasks={tasks.slice(0, 3)}
                  />
                }
                fileName="dashboard-report.pdf"
            >
              {({ loading }) => (
                  <button className="export-button" disabled={loading}>
                    {loading ? 'Preparing...' : 'Export Report'}
                  </button>
              )}
            </PDFDownloadLink>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {statsCards.map((stat) => (
                <div
                    key={stat.title}
                    className="stats-card"
                    style={{
                      backgroundColor: isDark ? stat.darkBg : stat.lightBg,
                      color: isDark ? stat.darkTextColor : stat.lightTextColor,
                    }}
                >
                  <div className="stats-icon">
                    <stat.icon />
                  </div>
                  <div className="stats-info">
                    <p className="stats-title">{stat.title}</p>
                    <p className="stats-value">{stat.value}</p>
                  </div>
                </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            {/* Task Activity Chart */}
            <div className="chart-card">
              <h2 className="chart-title">Task Activity</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taskActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasks" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Task Status Distribution */}
            <div className="chart-card">
              <h2 className="chart-title">Task Status Distribution</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="recent-activity">
            <h2 className="recent-activity-title">Recent Activity</h2>
            <div className="recent-activity-list">
              {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="recent-activity-item">
                    <p>{task.title}</p>
                    <p>{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

const calculateTaskActivity = (tasks) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  return [...Array(7)].map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];
    const tasksForDay = tasks.filter((task) => new Date(task.createdAt).toDateString() === date.toDateString());
    return { name: dayName, tasks: tasksForDay.length };
  });
};

export default Dashboard;