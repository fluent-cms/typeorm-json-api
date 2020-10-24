import { Authorize } from "typeorm-json-api";
import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
@Authorize({role:'admin'})
@Authorize({role:'common', operation:'read', columns:'id'})
export class Group {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
}