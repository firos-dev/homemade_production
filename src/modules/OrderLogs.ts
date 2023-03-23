import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Orders } from "./Orders";

export enum Activity {
  CREATED = "Created",
  START_PREPARING = "Start Preparing",
  ASSIGN_DELIVERY = "Assign Delivery",
  HANDOVER_TO_DELIVERY = "Handover to Delivery",
  DELIVERY_ACCEPTED = "Delivery Accepted",
  REACHED_PICKUP_POINT = "Reached Pickup Point",
  ITEM_COLLECTED = "Item Collected",
  REACHED_DROP_POINT = "Reached Drop Point",
  HANDOVER = "Handover",
}
@Entity("order_logs")
export class OrderLogs extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Orders, (order) => order.logs)
  @JoinColumn({ name: "order_id" })
  order: Orders;

  @Column()
  order_id: String;

  @Column({
    type: "enum",
    enum: Activity,
  })
  activity: Activity;

  @Column({
    type: "timestamp",
  })
  datetime: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
