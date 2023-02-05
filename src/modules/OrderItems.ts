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
} from "typeorm";
import { Users } from "./User";
import { Orders } from './Orders';
import { Items } from './Items';

@Entity("order_items")
export class OrderItems extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Orders,
  (order) => order.items)
  @JoinColumn({ name: "order_id" })
  order: Users;

  @Column()
  order_id: String;

  @ManyToOne(() => Items)
  @JoinColumn({ name: "item_id" })
  item: Items;

  @Column()
  item_id: String;

  @Column({
    nullable: true,
  })
  price: string;

  @Column({
    nullable: true,
  })
  quantity: string;

  @Column({
    nullable: true,
  })
  discound_amount: string;

  @Column({
    nullable: true,
  })
  offer_amount: string;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}