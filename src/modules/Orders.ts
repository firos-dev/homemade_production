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

@Entity("orders")
export class Orders extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @Column()
  user_id: String;

  @ManyToOne(() => Chefs, (chef) => chef.orders)
  @JoinColumn({ name: "chef_id" })
  chef: Users;

  @Column({
    nullable: true,
  })
  chef_id: String;

  @ManyToOne(() => DeliveryPartners, (delvery) => delvery.orders)
  @JoinColumn({ name: "delivery_partner_id" })
  delivery_partner: Users;

  @Column({
    nullable: true,
  })
  delivery_partner_id: String;

  @OneToMany(() => OrderItems, (items) => items.order)
  items: OrderItems[];

  @Column({
    type: "enum",
    enum: OrderStatus,
  })
  order_status: OrderStatus;

  @Column({
    type: "enum",
    enum: OrderChefStatus,
  })
  order_chef_status: OrderChefStatus;

  @Column({
    type: "enum",
    enum: OrderDeliveryStatus,
  })
  order_delivery_status: OrderDeliveryStatus;

  @Column({
    nullable: true,
  })
  delivery_charge: string;

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
