import { Like, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
const SEPARATOR = '~'
const ASC_VAL = 'a'
const DESC_VAL = 'd'
const START_FIELD = 's'
const COUNT_FIELD = 'c'

export function parseQueryParam(params: any) {
    const skip = params[START_FIELD]
    const take = params[COUNT_FIELD]
    const order: any = {}
    const where: any = {}

    for (const k of Object.keys(params).filter(x => x !== START_FIELD && x !== COUNT_FIELD)) {
        const val: string = params[k]
        if (val === ASC_VAL || val === DESC_VAL) {
            order[k] = val === ASC_VAL ? 'ASC' : 'DESC'
        } else {
            if (val.includes(SEPARATOR)) {
                const arr = val.split(SEPARATOR)
                console.log(arr)
                if (arr[0].length > 0 && arr[1].length > 0) {
                    where[k] = Between(arr[0],arr[1])
                }else if (arr[1].length > 0) {
                    where[k] = LessThanOrEqual(arr[1])
                }else if (arr[0].length > 0){
                    where[k] = MoreThanOrEqual(arr[0])
                }
            } else {
                if (val.startsWith('%') || val.endsWith('%')) {
                    where[k] = Like(`${val}`)
                } else {
                    where[k] = val
                }
            }
        }
    }
    return { order, skip, take, where }
}

