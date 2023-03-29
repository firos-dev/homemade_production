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

  @OneToOne(() => Users, (user) => user.customer)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @Column()
  user_id: String;

  @Column({
    type: "text",
    nullable: true,
  })
  image: String;

  @Column({
    type: "text",
    nullable: true,
  })
  image_key: String;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.INACTIVE,
  })
  status: Status;

  @Column({
    type: "boolean",
    default: false,
  })
  terms_accepted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
