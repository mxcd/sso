import {prisma} from "../util";

export async function initSeedGroups() {
    const seedGroups = [
        {name: 'sudo', displayName: 'SuperUser', description: 'Super User Group. Allowed to do basically everything.'},
        {name: 'group_manager', displayName: 'GroupManager', description: 'Group Manager Group. Allowed to (un)assign and manage groups'},
        {name: 'user_manager', displayName: 'UserManager', description: 'User Manager Group. Allowed to edit, lock, ... users'},
    ]

    for(const group of seedGroups) {
        if(!(await prisma.userGroup.findUnique({where: {name: group.name}}))) {
            await prisma.userGroup.create({data: {
                name: group.name,
                displayName: group.displayName,
                description: group.description,
                createdBy: 'seed',
                modifiedBy: 'seed'
            }})
        }
    }
}
