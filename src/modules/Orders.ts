import { OrderChefStatus, OrderDeliveryStatus } from "./../helpers/enums";
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
import { OrderItems } from "./OrderItems";
import { Chefs } from "./Chefs";
import { DeliveryPartners } from "./DeliveryPartners";
import { Locations } from "./Locations";
import { OrderLogs } from "./OrderLogs";

@Entity("orders")
export class Orders extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    default: "OD12354"
  })
  order_ref_id: String;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @Column()
  user_id: String;

  @ManyToOne(() => Locations)
  @JoinColumn({ name: "delivery_location_id" })
  delivery_location: Locations;

  @Column({
    nullable: true,
  })
  delivery_location_id: string;

  @ManyToOne(() => Chefs, (chef) => chef.orders)
  @JoinColumn({ name: "chef_id" })
  chef: Chefs;

  @Column({
    nullable: true,
  })
  chef_id: String;

  @ManyToOne(() => DeliveryPartners, (delvery) => delvery.orders)
  @JoinColumn({ name: "delivery_partner_id" })
  delivery_partner: DeliveryPartners;

  @Column({
    nullable: true,
  })
  delivery_partner_id: String;

  @OneToMany(() => OrderItems, (items) => items.order)
  items: OrderItems[];

  @OneToMany(() => OrderLogs, (logs) => logs.order)
  logs: OrderLogs[];

  @Column({
    type: "enum",
    enum: OrderStatus,
  })
  order_status: OrderStatus;

  @Column({
    nullable: true,
    type: "enum",
    enum: OrderChefStatus,
  })
  order_chef_status: OrderChefStatus;

  @Column({
    nullable: true,
    type: "enum",
    enum: OrderDeliveryStatus,
  })
  order_delivery_status: OrderDeliveryStatus;

  @Column({
    nullable: true,
  })
  delivery_charge: string;

  @Column({
    type: "date",
    nullable: true,
  })
  delivery_date: string;

  @Column({
    type: "time",
    nullable: true,
  })
  delivery_time: string;

  @Column({
    type: "text",
    nullable: true,
  })
  instructions: string;

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
