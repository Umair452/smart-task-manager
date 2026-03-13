import { create } from 'zustand'
import api from '../services/api'

const useTaskStore = create((set, get) => ({
    tasks: [],
    loading: false,
    error: null,

    // Fetch all tasks
    fetchTasks: async () => {
        set({ loading: true, error: null })
        try {
            const res = await api.get('/tasks')
            console.log('📅 Raw tasks from backend:', res.data.data.map(t => ({
                title: t.title,
                dueDate: t.dueDate,
                dueDateFormatted: t.dueDateFormatted
            })))
            set({ tasks: res.data.data, loading: false })
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || 'Failed to fetch tasks'
            })
        }
    },

    // Create task
    createTask: async (data) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post('/tasks', data)
            // Add task directly to THIS tab's store
            set((state) => ({
                tasks: [res.data.data, ...state.tasks],
                loading: false
            }))
            return res.data.data
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || 'Failed to create task'
            })
            throw error
        }
    },
    // Update task
    updateTask: async (id, data) => {
        try {
            const res = await api.patch(`/tasks/${id}`, data)
            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? res.data.data : task
                )
            }))
            return res.data.data
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update task' })
            throw error
        }
    },

    // Delete task
    deleteTask: async (id) => {
        try {
            await api.delete(`/tasks/${id}`)
            set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== id)
            }))
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete task' })
            throw error
        }
    },

    // Add task from WebSocket event
    addTaskFromSocket: (task) => {
        set((state) => ({
            tasks: [task, ...state.tasks]
        }))
    },

    // Update task from WebSocket event
    updateTaskFromSocket: (updatedTask) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            )
        }))
    },

    // Remove task from WebSocket event
    removeTaskFromSocket: (taskId) => {
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId)
        }))
    },

    clearError: () => set({ error: null })
}))

export default useTaskStore