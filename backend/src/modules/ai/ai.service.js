import Groq from 'groq-sdk'
import prisma from '../../lib/prisma.js'

// 1. Initialize Groq client with our API key
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

// Helper function to call Groq API
// We reuse this in all 3 features below
const askGroq = async (prompt) => {

    const completion = await groq.chat.completions.create({
        // model we're using - fast and free
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        // max tokens = max length of response
        // 1000 tokens ≈ 750 words
        max_tokens: 1000
    })

    // completion.choices[0].message.content
    // is the actual text response from AI
    return completion.choices[0].message.content
}

// ─── FEATURE 1: SUGGEST PRIORITY ─────────────────────────

export const suggestPriority = async (title, description) => {

    // Build a prompt that tells AI exactly what we want
    const prompt = `
    You are a task management assistant.
    Analyze this task and suggest a priority level.
    
    Task Title: ${title}
    Task Description: ${description || 'No description provided'}
    
    Reply in this EXACT format and nothing else:
    PRIORITY: HIGH or MEDIUM or LOW
    REASON: (one sentence explanation)
    
    Rules:
    - HIGH = urgent, critical, blocks other work
    - MEDIUM = important but not urgent
    - LOW = nice to have, can wait
  `

    const response = await askGroq(prompt)

    // Parse the response
    // response looks like:
    // "PRIORITY: HIGH\nREASON: This task is critical..."
    const lines = response.trim().split('\n')

    // Find the line that starts with PRIORITY:
    const priorityLine = lines.find(line => line.startsWith('PRIORITY:'))
    const reasonLine = lines.find(line => line.startsWith('REASON:'))

    // Extract just the value after the colon
    // 'PRIORITY: HIGH'.split(': ')[1] = 'HIGH'
    const priority = priorityLine
        ? priorityLine.split(': ')[1].trim()
        : 'MEDIUM'

    const reason = reasonLine
        ? reasonLine.split(': ')[1].trim()
        : 'No reason provided'

    // Make sure priority is a valid value
    const validPriorities = ['HIGH', 'MEDIUM', 'LOW']
    const finalPriority = validPriorities.includes(priority)
        ? priority
        : 'MEDIUM'

    return { priority: finalPriority, reason }
}

// ─── FEATURE 2: SUGGEST DESCRIPTION ─────────────────────

export const suggestDescription = async (title) => {

    const prompt = `
    You are a task management assistant.
    A user has created a task with this title: "${title}"
    
    Write a clear, professional task description for it.
    
    The description should:
    - Be 2-3 sentences long
    - Explain what needs to be done
    - Mention what a successful completion looks like
    - Be written in plain English
    
    Reply with ONLY the description, nothing else.
    No labels, no formatting, just the description text.
  `

    const description = await askGroq(prompt)
    return { description: description.trim() }
}

// ─── FEATURE 3: DAILY SUMMARY ────────────────────────────

export const getDailySummary = async (userId) => {

    // 1. Get all tasks for this user from database
    const tasks = await prisma.task.findMany({
        where: {
            OR: [
                { createdById: userId },
                { assignedToId: userId }
            ]
        },
        // only get tasks from last 7 days
        // so summary is relevant
        where: {
            OR: [
                { createdById: userId },
                { assignedToId: userId }
            ],
            createdAt: {
                // gte = greater than or equal
                // new Date(Date.now() - 7 days)
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        }
    })

    // 2. If no tasks found
    if (tasks.length === 0) {
        return { summary: 'You have no tasks in the last 7 days. Great job staying on top of things!' }
    }

    // 3. Format tasks into a simple list for the AI
    // We don't send the whole task object to AI
    // Just the relevant fields
    const taskList = tasks.map(task =>
        `- ${task.title} | Status: ${task.status} | Priority: ${task.priority}`
    ).join('\n')
    // .join('\n') joins array items with newline
    // Result:
    // "- Fix bug | Status: TODO | Priority: HIGH
    //  - Write docs | Status: DONE | Priority: LOW"

    // 4. Build the prompt
    const prompt = `
    You are a task management assistant.
    Here are a user's tasks from the last 7 days:
    
    ${taskList}
    
    Write a brief, friendly daily summary that:
    - Mentions how many tasks are in each status
    - Highlights any HIGH priority or OVERDUE tasks
    - Gives one motivational suggestion
    - Is 3-4 sentences max
    - Sounds conversational and encouraging
    
    Reply with ONLY the summary text, nothing else.
  `

    const summary = await askGroq(prompt)
    return {
        summary: summary.trim(),
        taskCount: tasks.length
    }
}