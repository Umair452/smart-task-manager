import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma.js'

export const registerUser = async (name, email, password) => {
    //check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    //if user exists throw error

    if (existingUser) {
        throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    //create user now

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    //return user without passsword field

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword

}

export const loginUser = async (email, password) => {
    //find user by email

    const user = await prisma.user.findUnique({
        where: { email }
    })

    //if user not found throw an error

    if (!user) {
        throw new Error('Invalid credentials')
    }

    //compre password with hashed password in db because you have hashed it before saving
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new Error('Invalid credentials')
    }

    //cretae JWT token 
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    const { password: _, ...userWithoutPassword } = user

    return {
        token,
        user: userWithoutPassword
    }

}