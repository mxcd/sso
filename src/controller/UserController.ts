import {prisma} from "../util";
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

export async function createUser(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({where: {email}})
    if(existingUser !== null) {
        return {
            error: true,
            message: `User with email ${email} already exists!`,
            user: null
        }
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({data: {
            email,
            passwordHash,
            validated: true,
            locked: false,
            createdBy: 'rp',
            modifiedBy: 'rp',
        }});
    return {
        error: false,
        message: '',
        user
    }
}

export async function checkUserLogin(email, password) {
    const user = await prisma.user.findUnique({where: {email}});
    if(user === null) {
        return {valid: false, user: null};
    }
    else {
        const match = await bcrypt.compare(password, user.passwordHash);
        return {valid: match, user};
    }
}
