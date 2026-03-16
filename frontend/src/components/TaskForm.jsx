import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Wand2, Loader } from 'lucide-react'
import api from '../services/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const TaskForm = ({ task, onSave, onCancel }) => {
    const { t } = useTranslation()
    const { user } = useAuthStore()

    const [form, setForm] = useState({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'MEDIUM',
        status: task?.status || 'TODO',
        dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
        assignedToId: task?.assignedToId || ''
    })

    const [aiLoading, setAiLoading] = useState(false)
    const [aiSuggestion, setAiSuggestion] = useState(null)
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users')
                setUsers(res.data.data)
            } catch (error) {
                console.error('Failed to fetch users:', error)
            }
        }
        fetchUsers()
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSuggestPriority = async () => {
        if (!form.title) return
        setAiLoading(true)
        try {
            const res = await api.post('/ai/suggest-priority', {
                title: form.title,
                description: form.description
            })
            const { priority, reason } = res.data.data
            setForm({ ...form, priority })
            setAiSuggestion(`AI suggests: ${priority} — ${reason}`)
        } catch (error) {
            console.error('AI error:', error)
        }
        setAiLoading(false)
    }

    const handleSuggestDescription = async () => {
        if (!form.title) return
        setAiLoading(true)
        try {
            const res = await api.post('/ai/suggest-description', {
                title: form.title
            })
            setForm({ ...form, description: res.data.data.description })
        } catch (error) {
            console.error('AI error:', error)
        }
        setAiLoading(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = { ...form }
        if (formData.dueDate) {
            formData.dueDate = `${formData.dueDate}T12:00:00.000Z`
        }
        if (!formData.assignedToId) {
            delete formData.assignedToId
        } else {
            // Find assigned user name for toast
            const assignedUser = users.find(u => u.id === formData.assignedToId)
            if (assignedUser) {
                toast.success(`Task assigned to ${assignedUser.name}! 🎉`)
            }
        }
        onSave(formData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    {task ? t('edit') : t('createTask')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('title')} *
                        </label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-gray-50 transition"
                            placeholder="Enter task title"
                        />
                    </div>

                    {/* Description with AI button */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                {t('description')}
                            </label>
                            <button
                                type="button"
                                onClick={handleSuggestDescription}
                                disabled={aiLoading || !form.title}
                                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 disabled:opacity-50"
                            >
                                {aiLoading ? <Loader size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                {t('suggestDescription')}
                            </button>
                        </div>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-gray-50 transition"
                            placeholder="Enter task description"
                        />
                    </div>

                    {/* Priority with AI button */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                {t('priority')}
                            </label>
                            <button
                                type="button"
                                onClick={handleSuggestPriority}
                                disabled={aiLoading || !form.title}
                                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 disabled:opacity-50"
                            >
                                {aiLoading ? <Loader size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                {t('suggestPriority')}
                            </button>
                        </div>
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-gray-50 transition"
                        >
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                        </select>
                        {aiSuggestion && (
                            <p className="text-xs text-purple-600 mt-1">{aiSuggestion}</p>
                        )}
                    </div>

                    {/* Status */}
                    {task && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('status')}
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-gray-50 transition"
                            >
                                <option value="TODO">TODO</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="DONE">DONE</option>
                            </select>
                        </div>
                    )}

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('dueDate')}
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-gray-50 transition"
                        />
                    </div>

                    {/* Assign To - only show for ADMIN */}
                    {user?.role === 'ADMIN' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Assign To
                            </label>
                            <select
                                name="assignedToId"
                                value={form.assignedToId}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-gray-50 transition"
                            >
                                <option value="">Select a user</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 gradient-bg text-white py-3 rounded-2xl text-sm font-semibold transition hover:opacity-90 shadow-lg shadow-purple-200"
                        >
                            {t('save')}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl text-sm font-semibold transition"
                        >
                            {t('cancel')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default TaskForm