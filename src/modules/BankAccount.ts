import { BannerType, Status } from "../helpers/enums";
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";

import { Users } from "./User";

@Entity("bank_accounts")
export class BankAccounts extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Users, (user) => user.chef, { cascade: ["insert"] })
  @JoinColumn({ name: "user_id" })
  user: Users;

  @Column()
  user_id: String;

  @Column({
    nullable: true,
  })
  account_holder_name: string;

  @Column({
    nullable: true,
  })
  bank_name: string;

  @Column({
    nullable: true,
  })
  account_number: string;

  @Column({
    nullable: true,
  })
  ifsc_code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
