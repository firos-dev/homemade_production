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

@Entity("card_details")
export class CardDetails extends BaseEntity {
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
  name_on_card: string;

  @Column({
    nullable: true,
  })
  card_number: string;

  @Column({
    nullable: true,
  })
  expiry_date: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
