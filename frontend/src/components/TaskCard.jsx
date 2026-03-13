import { useTranslation } from 'react-i18next'
import { Trash2, Edit, Clock, Flag, User } from 'lucide-react'
import useAuthStore from '../store/authStore'

const priorityConfig = {
    HIGH: { color: 'bg-red-100 text-red-600', dot: 'bg-red-500', label: '🔴 HIGH' },
    MEDIUM: { color: 'bg-amber-100 text-amber-600', dot: 'bg-amber-500', label: '🟡 MEDIUM' },
    LOW: { color: 'bg-green-100 text-green-600', dot: 'bg-green-500', label: '🟢 LOW' }
}

const statusConfig = {
    TODO: { color: 'bg-gray-100 text-gray-600', label: '📋 TODO' },
    IN_PROGRESS: { color: 'bg-blue-100 text-blue-600', label: '⚡ IN PROGRESS' },
    DONE: { color: 'bg-green-100 text-green-600', label: '✅ DONE' },
    OVERDUE: { color: 'bg-red-100 text-red-600', label: '⚠️ OVERDUE' }
}

const TaskCard = ({ task, onEdit, onDelete }) => {
    const { t } = useTranslation()
    const { user } = useAuthStore()

    const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM
    const status = statusConfig[task.status] || statusConfig.TODO

    return (
        <div className="bg-white rounded-2xl p-5 card-hover border border-gray-100 shadow-sm cursor-pointer">

            {/* Top bar - priority dot */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${priority.dot}`} />
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priority.color}`}>
                        {task.priority}
                    </span>
                </div>
                <div className="flex gap-1.5">
                    <button
                        onClick={() => onEdit(task)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                    >
                        <Edit size={14} />
                    </button>
                    {(user?.role === 'ADMIN' || task.createdById === user?.id) && (
                        <button
                            onClick={() => onDelete(task.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">
                {task.title}
            </h3>

            {/* Description */}
            {task.description && (
                <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {task.description}
                </p>
            )}

            {/* Status badge */}
            <div className="mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                    {status.label}
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                {task.dueDate ? (
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Clock size={12} />
                        <span>
                            {new Date(task.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                timeZone: 'UTC'
                            })}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-gray-300">No due date</span>
                )}

                {task.assignedTo && (
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <User size={11} />
                        <span>{task.assignedTo.name}</span>
                    </div>
                )}
            </div>

        </div>
    )
}

export default TaskCard