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
} from "typeorm";

import { Chefs } from "./Chefs";

@Entity("banners")
export class Banners extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true,
  })
  name: string;

  @ManyToOne(() => Chefs, (chef) => chef.items)
  @JoinColumn({
    name: "chef_id",
  })
  chef: Chefs;

  @Column({
    nullable: true,
  })
  chef_id: string;

  @Column({
    type: "text",
    array: true,
    nullable: true,
  })
  image: string;

  @Column({
    type: "text",
    array: true,
    nullable: true,
  })
  image_key: string;

  @Column({
    type: "enum",
    enum: BannerType,
  })
  banner_type: BannerType;

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
