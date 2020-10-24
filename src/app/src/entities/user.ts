import { Authorize  } from "typeorm-json-api";
import {Entity, Column, PrimaryGeneratedColumn,ManyToOne} from "typeorm";
import { Group } from "./group";
@Entity()
@Authorize({role:'admin'})
@Authorize({role:'common', operation:'read', columns:'groupId'})
@Authorize({role:'common', operation:'update', columns:'userId'})
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    userName: string
    @Column()
    password: string
    @Column()
    firstName: string
    @Column()
    lastName: string
    @Column()
    role:'admin'|'common'
    @Column({nullable:true})
    groupId:number
    @ManyToOne(()=>Group)
    group:Group
}