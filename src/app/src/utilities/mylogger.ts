import { LogLevel } from "routers/repoCrud"

export function mylog(level: LogLevel, msg: any, info: string = '') {
    console.log(info + '----' + new Error().stack.split('\n')[2])
    console.log(msg)

}
