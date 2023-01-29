import { AddressType } from "./../helpers/enums";
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

  @ManyToOne(() => Users, (user) => user.locations)
  @JoinColumn({ name: "user_id" })
  user: Users;
  @Column({
    nullable: true,
    name: "user_id",
  })
  user_id: string;

  @Column({
    nullable: true,
    type: "text",
  })
  address_line_one: string;

  @Column({
    nullable: true,
    type: "text",
  })
  address_line_two: string;

  @Column({
    nullable: true,
  })
  latitude: string;

  @Column({
    nullable: true,
  })
  longitude: string;

  @Column({
    nullable: true,
  })
  area: string;

  @Column({
    nullable: true,
  })
  state: string;

  @Column({
    nullable: true,
  })
  city: string;

  @Column({
    nullable: true,
  })
  zip_code: string;

  @Column({
    nullable: true,
  })
  country: string;

  @Column({
    type: "enum",
    enum: AddressType,
  })
  address_type: AddressType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
