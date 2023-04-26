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
  label_address: string;

  @Column({
    nullable: true,
  })
  building_name: string;

  @Column({
    nullable: true,
  })
  floor_number: string;

  @Column({
    nullable: true,
  })
  door_number: string;

  @Column({
    nullable: true,
  })
  landmark: string;

  @Column({
    nullable: true,
  })
  contact_number: string;

  @Column({
    nullable: true,
  })
  country: string;

  @Column({
    type: "enum",
    enum: AddressType,
  })
  address_type: AddressType;
  
  @Column({
    type: "enum",
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
