
export class UnAuthorized extends Error{
    constructor(){
        super('UnAuthorized')
        this.name = 'UnAuthorized'
    }
}