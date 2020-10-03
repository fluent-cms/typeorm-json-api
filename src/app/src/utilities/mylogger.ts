export function mylog(msg:any, info:string = ''){
        console.log(info + '----' + new Error().stack.split('\n')[2])
        console.log(msg)
    }
