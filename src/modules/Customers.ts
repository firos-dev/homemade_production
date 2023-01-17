import { Status } from "../helpers/enums";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Users } from "./User";

@Entity("customers")
export class Customers extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Users)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @Column()
  user_id: String;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
