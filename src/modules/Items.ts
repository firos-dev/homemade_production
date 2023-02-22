import { Status } from "../helpers/enums";
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Chefs } from "./Chefs";
import { Cuisines } from "./Cuisines";

@Entity("items")
export class Items extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true,
  })
  name: string;

  @ManyToOne(() => Chefs)
  @JoinColumn({
    name: "chef_id",
  })
  chef: Chefs;

  @Column()
  chef_id: string;

  @Column({
    nullable: true,
  })
  unit: string;

  @Column({
    nullable: true,
  })
  portion_size: string;

  @Column({
    nullable: true,
  })
  price: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    nullable: true,
  })
  image_key: string;

  @Column({
    type: "boolean",
    default: false,
  })
  available: boolean;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  ingredients: string;

  @ManyToOne(() => Cuisines)
  @JoinColumn({
    name: "cuisine_id",
  })
  cuisine: Cuisines;

  @Column({
    name: "cuisine_id",
    nullable: true,
  })
  cuisine_id: string;

  @Column({
    nullable: true,
  })
  allergic_ingredients: string;

  @Column({
    nullable: true,
  })
  type: string;

  @Column({
    type: "enum",
    enum: Status,
  })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
