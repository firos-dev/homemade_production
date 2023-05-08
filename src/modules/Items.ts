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
  OneToMany,
} from "typeorm";

import { Chefs } from "./Chefs";
import { Cuisines } from "./Cuisines";
import { Reviews } from "./Reviews";

@Entity("items")
export class Items extends BaseEntity {
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
    type: "text",
    array: true,
    nullable: true,
  })
  images: string[];

  @Column({
    type: "text",
    array: true,
    nullable: true,
  })
  image_keys: string[];

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
    type: "boolean",
    default: false,
  })
  express_item: boolean;

  @Column({
    nullable: true,
  })
  cooking_time: string;

  @Column({
    type: "enum",
    enum: Status,
  })
  status: Status;

  @OneToMany(() => Reviews, (reviews) => reviews.item, { cascade: true })
  reviews: Reviews[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
