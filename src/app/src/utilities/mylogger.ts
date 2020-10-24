import { LogLevel } from "core/routers/crudRouter"

export function crudLog (level:LogLevel, msg:any){
    console.log(level + '----' + new Error().stack.split('\n')[3])
    console.log(msg)
}
export function mylog(msg: any, info: string = '') {
    console.log(info + '----' + new Error().stack.split('\n')[2])
    console.log(msg)

}
