import { Items } from './Items';
import { OrderChefStatus, OrderDeliveryStatus } from './../helpers/enums';
import { OrderStatus, Status } from "../helpers/enums";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Users } from "./User";

@Entity("cart")
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Items)
  @JoinColumn({ name: "item_id" })
  item: Items;

  @Column()
  item_id: String;

  @ManyToOne(() => Users,
  (user) => user.cart_items)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @Column()
  user_id: String;

  @Column({
    nullable: true
  })
  quantity: String;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}