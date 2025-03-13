import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import TaskCard from './TaskCard';
import './TaskList.css';

export default function TaskList() {
    const { data: tasks = [], isLoading, isError } = useQuery({
        queryKey: ['tasks'],
        queryFn: taskService.getAllTasks, // Fetch all tasks
    });

    if (isLoading) {
        return <div>Loading tasks...</div>;
    }

    if (isError) {
        return <div>Error loading tasks. Please try again later.</div>;
    }

    return (
        <div className="task-list">
            {tasks.length === 0 ? (
                <div>No tasks found</div>
            ) : (
                tasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
        </div>
    );
}