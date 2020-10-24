import { In } from "typeorm"
import { UnAuthorized } from "../utilities/errors"

export type OperationType = 'create' | 'read' | 'update' | 'delete'
const authMap = new Map<string, AuthorizeMeta[]>()
export interface AuthorizeMeta {
    role: string
    operation?: OperationType
    columns?: string | (string[])
}

function pushRole(arr: AuthorizeMeta[], item: AuthorizeMeta, overWrite: boolean) {
    const index = arr.findIndex(x => x.role === item.role && x.role === item.operation)
    if (index > 0) {
        if (overWrite) {
            arr.splice(index)
            arr.push(item)
        }
    }
    else {
        arr.push(item)
    }
}
export function Authorize(option: AuthorizeMeta) {
    return (target: any) => {
        const name = target.name
        let authOption: AuthorizeMeta[] = authMap.get(name) ?? []
        if (option.operation) {
            pushRole(authOption, option, true)
        } else {
            pushRole(authOption, { ...option, operation: 'create' }, false)
            pushRole(authOption, { ...option, operation: 'read' }, false)
            pushRole(authOption, { ...option, operation: 'update' }, false)
            pushRole(authOption, { ...option, operation: 'delete' }, false)
        }

        authMap.set(name, authOption)
    }
}

export function getScopeFilter(repoName: string, operation: OperationType, user: any) {
    const scope = {}
    let metas = authMap.get(repoName)
    if (!metas) {
        return scope //no limitation at all
    }

    metas = metas.filter(x => x.operation === operation)
    if (metas.length === 0) {
        return scope //no limitation for this operation
    }

    if (!user) {
        throw new UnAuthorized() // allowed other roles, not allow this role
    }
    const role = user.role
    const roles: string[] = Array.isArray(role) ? role : [role]
    metas = metas.filter(x => roles.includes(x.role))
    if (metas.length === 0) {
        throw new UnAuthorized() // allowed other roles, not allow this role
    }

    if (metas.find(x => !x.columns)) {
        return scope   // any row don't need scope filter
    }

    const meta = metas.find(x => !!x.columns)
    if (meta && user) {
        const columns = Array.isArray(meta.columns) ? meta.columns : [meta.columns]
        for (const column of columns) {
            if(!column){
                throw new UnAuthorized() 
            }
            const item = user[column]
            const items = Array.isArray(item) ? item : [item]
            scope[column] = In(items)
        }
        return scope
    }
    throw new UnAuthorized() 
}