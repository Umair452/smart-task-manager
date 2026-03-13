import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Wand2, Loader } from 'lucide-react'
import api from '../services/api'

const TaskForm = ({ task, onSave, onCancel }) => {
    const { t } = useTranslation()

    // If task is passed → editing, otherwise creating
    const [form, setForm] = useState({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'MEDIUM',
        status: task?.status || 'TODO',
        dueDate: task?.dueDate ? task.dueDate.split('T')[0] : ''
    })

    const [aiLoading, setAiLoading] = useState(false)
    const [aiSuggestion, setAiSuggestion] = useState(null)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // AI suggest priority
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

    // AI suggest description
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

        // If dueDate exists add time to make it
        // noon UTC so it never shifts to previous day
        // regardless of timezone
        if (formData.dueDate) {
            formData.dueDate = `${formData.dueDate}T12:00:00.000Z`
        }

        onSave(formData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    {task ? t('edit') : t('createTask')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('title')} *
                        </label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter task title"
                        />
                    </div>

                    {/* Description with AI button */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter task description"
                        />
                    </div>

                    {/* Priority with AI button */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('status')}
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="TODO">TODO</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="DONE">DONE</option>
                            </select>
                        </div>
                    )}

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('dueDate')}
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
                        >
                            {t('save')}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition"
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