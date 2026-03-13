import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Loader, Bot, CheckSquare, Clock, AlertTriangle, ListTodo, X } from 'lucide-react'
import useTaskStore from '../store/taskStore'
import useAuthStore from '../store/authStore'
import useSocket from '../hooks/useSocket'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import api from '../services/api'

const Dashboard = () => {
    const { t } = useTranslation()
    const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTaskStore()
    const { user } = useAuthStore()

    useSocket()

    const [showForm, setShowForm] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [filter, setFilter] = useState('ALL')
    const [aiSummary, setAiSummary] = useState(null)
    const [summaryLoading, setSummaryLoading] = useState(false)

    useEffect(() => {
        fetchTasks()
    }, [])

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'ALL') return true
        return task.status === filter
    })

    const handleSave = async (form) => {
        try {
            if (editingTask) {
                await updateTask(editingTask.id, form)
            } else {
                await createTask(form)
            }
            setShowForm(false)
            setEditingTask(null)
        } catch (error) {
            console.error('Save error:', error)
        }
    }

    const handleEdit = (task) => {
        setEditingTask(task)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await deleteTask(id)
        }
    }

    const handleAiSummary = async () => {
        setSummaryLoading(true)
        try {
            const res = await api.get('/ai/daily-summary')
            setAiSummary(res.data.data.summary)
        } catch (error) {
            console.error('AI error:', error)
        }
        setSummaryLoading(false)
    }

    // Stats
    const stats = [
        {
            label: 'Total',
            value: tasks.length,
            icon: ListTodo,
            color: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            text: 'text-blue-600'
        },
        {
            label: 'In Progress',
            value: tasks.filter(t => t.status === 'IN_PROGRESS').length,
            icon: Clock,
            color: 'from-amber-500 to-amber-600',
            bg: 'bg-amber-50',
            text: 'text-amber-600'
        },
        {
            label: 'Done',
            value: tasks.filter(t => t.status === 'DONE').length,
            icon: CheckSquare,
            color: 'from-green-500 to-green-600',
            bg: 'bg-green-50',
            text: 'text-green-600'
        },
        {
            label: 'Overdue',
            value: tasks.filter(t => t.status === 'OVERDUE').length,
            icon: AlertTriangle,
            color: 'from-red-500 to-red-600',
            bg: 'bg-red-50',
            text: 'text-red-600'
        }
    ]

    const filters = [
        { label: 'All', value: 'ALL' },
        { label: '📋 Todo', value: 'TODO' },
        { label: '⚡ In Progress', value: 'IN_PROGRESS' },
        { label: '✅ Done', value: 'DONE' },
        { label: '⚠️ Overdue', value: 'OVERDUE' }
    ]

    return (
        <div className="min-h-screen" style={{ background: '#f0f2ff' }}>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Good day, {user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Here's what's on your plate today
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleAiSummary}
                            disabled={summaryLoading}
                            className="flex items-center gap-2 bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-400 px-4 py-2.5 rounded-2xl text-sm font-semibold transition shadow-sm"
                        >
                            {summaryLoading
                                ? <Loader size={16} className="animate-spin" />
                                : <Bot size={16} />
                            }
                            AI Summary
                        </button>
                        <button
                            onClick={() => { setEditingTask(null); setShowForm(true) }}
                            className="flex items-center gap-2 gradient-bg text-white px-4 py-2.5 rounded-2xl text-sm font-semibold transition hover:opacity-90 shadow-lg shadow-purple-200"
                        >
                            <Plus size={16} />
                            {t('createTask')}
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
                                <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                    <stat.icon size={18} className={stat.text} />
                                </div>
                            </div>
                            <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* AI Summary */}
                {aiSummary && (
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-5 mb-6 flex gap-4 text-white shadow-lg">
                        <Bot size={24} className="shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-semibold mb-1">✨ AI Daily Summary</p>
                            <p className="text-sm text-purple-100 leading-relaxed">{aiSummary}</p>
                        </div>
                        <button
                            onClick={() => setAiSummary(null)}
                            className="text-white opacity-60 hover:opacity-100 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Filter tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition
                ${filter === f.value
                                    ? 'gradient-bg text-white shadow-lg shadow-purple-200'
                                    : 'bg-white text-gray-500 border border-gray-100 hover:border-purple-200'
                                }`}
                        >
                            {f.label}
                            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
                ${filter === f.value ? 'bg-white bg-opacity-20' : 'bg-gray-100'}`}>
                                {f.value === 'ALL'
                                    ? tasks.length
                                    : tasks.filter(t => t.status === f.value).length
                                }
                            </span>
                        </button>
                    ))}
                </div>

                {/* Tasks */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader size={40} className="animate-spin text-purple-500 mx-auto mb-3" />
                            <p className="text-gray-400">Loading your tasks...</p>
                        </div>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <ListTodo size={36} className="text-white" />
                        </div>
                        <p className="text-xl font-bold text-gray-700 mb-2">{t('noTasks')}</p>
                        <p className="text-gray-400 mb-6">Create your first task to get started!</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="gradient-bg text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition shadow-lg shadow-purple-200"
                        >
                            + Create Task
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* Task Form Modal */}
            {showForm && (
                <TaskForm
                    task={editingTask}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingTask(null) }}
                />
            )}
        </div>
    )
}

export default Dashboard