import { Status } from "../helpers/enums";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Users } from "./User";

@Entity("locations")
export class Locations extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @Column({
    name: "user_id",
  })
  user_id: string;

  @Column({
    type: 'text'
  })
  address: string;

  @Column({
    type: 'text'
  })
  second_address: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;
  
  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  suburb: string;

  @Column()
  zip_code: string;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
