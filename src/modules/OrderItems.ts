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
} from "typeorm";
import { Users } from "./User";
import { Orders } from "./Orders";
import { Items } from "./Items";
import { Invoices } from "./Invoices";

@Entity("order_items")
export class OrderItems extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Orders, (order) => order.items)
  @JoinColumn({ name: "order_id" })
  order: Users;

  @Column()
  order_id: String;

  @ManyToOne(() => Invoices, (invoice) => invoice.items)
  @JoinColumn({ name: "invoice_id" })
  invoice: Users;

  @Column({
    nullable: true,
  })
  invoice_id: String;

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

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  portion_size: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  ingredients: string;

  @Column({
    nullable: true,
  })
  type: string;

  @Column({
    nullable: true,
  })
  allergic_ingredients: string;

  @Column({
    nullable: true,
  })
  commission: string;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
