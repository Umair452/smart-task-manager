import { useEffect } from 'react'
import { getSocket } from '../services/socket'
import useTaskStore from '../store/taskStore'

const useSocket = () => {
    const { fetchTasks, updateTaskFromSocket, removeTaskFromSocket } = useTaskStore()

    useEffect(() => {
        const socket = getSocket()
        if (!socket) {
            console.log('❌ No socket found!')
            return
        }

        console.log('✅ Socket hook connected, listening for events...')

        // When task created → just refetch all tasks
        // simplest and most reliable approach
        socket.on('task:created', (data) => {
            console.log('📝 task:created event received!', data)
            fetchTasks()
        })

        socket.on('task:assigned', (data) => {
            console.log('👤 task:assigned event received!', data)
            fetchTasks()
        })

        socket.on('task:updated', (data) => {
            console.log('✏️ task:updated event received!', data)
            updateTaskFromSocket(data.task)
        })

        socket.on('task:deleted', (data) => {
            console.log('🗑️ task:deleted event received!', data)
            removeTaskFromSocket(data.taskId)
        })

        return () => {
            socket.off('task:created')
            socket.off('task:assigned')
            socket.off('task:updated')
            socket.off('task:deleted')
        }
    }, [])
}

export default useSocket