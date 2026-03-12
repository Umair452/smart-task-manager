import cron from 'node-cron'
import prisma from '../../lib/prisma.js'

// ─── JOB 1: OVERDUE CHECKER ──────────────────────────────
// Runs every hour at :00
// Finds all tasks past their due date
// and marks them as OVERDUE

const overdueChecker = cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running overdue checker...')

    try {
        // 1. Get current time in UTC
        const now = new Date()

        // 2. Find all tasks that are:
        //    - NOT already overdue or done
        //    - have a due date
        //    - due date is in the past
        const overdueTasks = await prisma.task.findMany({
            where: {
                // status is NOT OVERDUE and NOT DONE
                status: {
                    notIn: ['OVERDUE', 'DONE']
                },
                // dueDate exists
                dueDate: {
                    not: null,
                    // dueDate is less than current time
                    // meaning it's in the past
                    lt: now
                }
            }
        })

        // 3. If no overdue tasks found, log and exit
        if (overdueTasks.length === 0) {
            console.log('✅ No overdue tasks found')
            return
        }

        // 4. Get all the ids of overdue tasks
        const overdueIds = overdueTasks.map(task => task.id)
        // .map() creates a new array with just the ids
        // e.g. ['abc123', 'def456', 'ghi789']

        // 5. Update all overdue tasks at once
        // updateMany = update multiple records in one query
        const updated = await prisma.task.updateMany({
            where: {
                id: { in: overdueIds }
                // in: means id must be in this array
            },
            data: {
                status: 'OVERDUE'
            }
        })

        console.log(`⚠️ Marked ${updated.count} tasks as OVERDUE`)

    } catch (error) {
        console.error('❌ Overdue checker error:', error.message)
    }

}, {
    // This means the job won't run immediately
    // when the server starts, it waits for the
    // scheduled time
    scheduled: true
})

// ─── JOB 2: DAILY DIGEST ─────────────────────────────────
// Runs every day at 8:00am UTC
// Logs a summary of all pending tasks
// In a real app you would send emails here

const dailyDigest = cron.schedule('0 8 * * *', async () => {
    console.log('📋 Running daily digest...')

    try {
        // 1. Count tasks by status
        // groupBy is like SQL GROUP BY
        // it groups tasks by their status and counts them
        const taskCounts = await prisma.task.groupBy({
            by: ['status'],
            // _count counts the records in each group
            _count: { status: true }
        })

        // 2. Log the summary
        console.log('📊 Daily Task Summary:')
        console.log('─────────────────────')

        // taskCounts looks like:
        // [
        //   { status: 'TODO', _count: { status: 5 } },
        //   { status: 'IN_PROGRESS', _count: { status: 3 } },
        //   { status: 'DONE', _count: { status: 10 } },
        //   { status: 'OVERDUE', _count: { status: 2 } }
        // ]
        taskCounts.forEach(item => {
            console.log(`${item.status}: ${item._count.status} tasks`)
        })

        // 3. Find users with pending tasks
        const usersWithPendingTasks = await prisma.user.findMany({
            where: {
                // find users who have tasks assigned to them
                tasksAssigned: {
                    // some = at least one task matches
                    some: {
                        status: {
                            in: ['TODO', 'IN_PROGRESS', 'OVERDUE']
                        }
                    }
                }
            },
            include: {
                // also include their pending tasks
                tasksAssigned: {
                    where: {
                        status: {
                            in: ['TODO', 'IN_PROGRESS', 'OVERDUE']
                        }
                    }
                }
            }
        })

        // 4. Log each user's pending tasks
        // In a real app, you would send an email here
        console.log(`\n👥 ${usersWithPendingTasks.length} users have pending tasks`)
        usersWithPendingTasks.forEach(user => {
            console.log(`📧 ${user.email} has ${user.tasksAssigned.length} pending tasks`)
            // TODO: sendEmail(user.email, user.tasksAssigned)
        })

        console.log('✅ Daily digest complete!')

    } catch (error) {
        console.error('❌ Daily digest error:', error.message)
    }

}, {
    scheduled: true,
    // timezone makes sure 8am means 8am UTC
    timezone: 'UTC'
})

// ─── JOB 3: CLEANUP OLD TASKS ────────────────────────────
// Runs every Sunday at midnight UTC
// Deletes completed tasks older than 30 days
// Keeps the database clean and fast

const cleanupOldTasks = cron.schedule('0 0 * * 0', async () => {
    console.log('🧹 Running cleanup job...')

    try {
        // 1. Calculate date 30 days ago
        const thirtyDaysAgo = new Date()
        // setDate() changes the day of the month
        // current day minus 30 = 30 days ago
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // 2. Delete all DONE tasks older than 30 days
        const deleted = await prisma.task.deleteMany({
            where: {
                status: 'DONE',
                // updatedAt is when the task was last updated
                // lt = less than = older than 30 days ago
                updatedAt: {
                    lt: thirtyDaysAgo
                }
            }
        })

        console.log(`🗑️ Cleaned up ${deleted.count} old completed tasks`)

    } catch (error) {
        console.error('❌ Cleanup error:', error.message)
    }

}, {
    scheduled: true,
    timezone: 'UTC'
})

// ─── START ALL JOBS ──────────────────────────────────────

export const startScheduler = () => {
    overdueChecker.start()
    dailyDigest.start()
    cleanupOldTasks.start()
    console.log('⏰ All scheduled jobs are running!')
}