import {prisma} from "../util";
import {sendRegistrationMail} from "../mail-controller";
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const VALIDATE_MAIL = process.env.VALIDATE_MAIL === 'true'
const LOCKED_BY_DEFAULT = process.env.LOCKED_BY_DEFAULT === 'true'

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

    let validated = !VALIDATE_MAIL;
    let locked = LOCKED_BY_DEFAULT;

    // @ts-ignore
    const user = await prisma.user.create({data: {
            email,
            passwordHash,
            validated,
            locked,
            createdBy: 'rp',
            modifiedBy: 'rp',
        }});

    if(VALIDATE_MAIL) {
        await sendRegistrationMail({user})
    }

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
