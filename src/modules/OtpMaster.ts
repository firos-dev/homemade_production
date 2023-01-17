import { Status } from "../helpers/enums";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeUpdate,
  BeforeInsert,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Users } from "./User";
@Entity("otp_master")
export class OtpMaster extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Users)
  @JoinColumn({
    name: "user_id",
  })
  user: Users;

  @Column({
    name: "user_id",
  })
  user_id: string;

  @Column()
  mobile: string;

  @Column()
  otp_code: string;

  @Column({
    type: "timestamp",
  })
  otp_datetime: Date;

  @Column()
  otp_duration: string;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.ACTIVE,
  })
  status: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
