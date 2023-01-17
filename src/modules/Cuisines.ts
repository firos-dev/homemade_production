import { Status } from "../helpers/enums";
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
  } from "typeorm";
  
@Entity("cuisines")
export class Cuisines extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string
    
    @Column({
        type: 'text'
    })
    image: string

    @Column({
      nullable: true,
    })
    icon: string

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: string

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}