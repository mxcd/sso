import {prisma} from "../util";
import {sendRegistrationMail} from "../mail-controller";
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const VALIDATE_MAIL = process.env.VALIDATE_MAIL === 'true'
const LOCKED_BY_DEFAULT = process.env.LOCKED_BY_DEFAULT === 'true'

const ADMIN_PW = process.env.ADMIN_PW
const ADMIN_MAIL = process.env.ADMIN_MAIL || ''

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

export enum USER_VALIDATION_RESULT {
    INVALID,
    ALREADY_VALID,
    VALIDATED
}

export async function validateUser(uid, code) {
    const user = await prisma.user.findUnique({where: {id: uid}});
    if(!user) return false;
    if(user.validated) {
        return USER_VALIDATION_RESULT.ALREADY_VALID;
    }
    else if(user.validationCode === code) {
        await prisma.user.update({
            where: {id: uid},
            data: {
                validationCode: '',
                validated: true
            }
        })
        return USER_VALIDATION_RESULT.VALIDATED;
    }
    else {
        return USER_VALIDATION_RESULT.INVALID;
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

export async function initAdminUser() {
    const adminUser = await prisma.user.findUnique({where: {email: ADMIN_MAIL}})
    if(!adminUser) {
        const passwordHash = await bcrypt.hash(ADMIN_PW, SALT_ROUNDS);
        // @ts-ignore
        const user = await prisma.user.create({data: {
                email: ADMIN_MAIL,
                passwordHash,
                validated: true,
                locked: false,
                createdBy: 'seed',
                modifiedBy: 'seed',
                groups: {
                    connect: [{name: 'sudo'}]
                }
            }});
    }
}
