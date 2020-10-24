import { Authorize } from "typeorm-json-api";
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Group } from "./group";
import { User } from "./user";

@Entity()
@Authorize({role:'admin'})
@Authorize({role:'common', operation:'read', columns:['groupId']})
@Authorize({role:'common', operation:'create', columns:['groupId','userId']})
@Authorize({role:'common', operation:'update', columns:['userId']})
@Authorize({role:'common', operation:'delete', columns:['userId']})

export class Post {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    subject: string
    @Column()
    content: string

    @Column()
    userId: number
    @ManyToOne(()=>User)
    user:User

    @Column()
    groupId:number
    @ManyToOne(()=>Group)
    group:Group
}