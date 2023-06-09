import { Status } from "../helpers/enums";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from "typeorm";
import { Orders } from "./Orders";
import { OrderItems } from "./OrderItems";
import { Payments } from "./Payments";

@Entity("invoices")
export class Invoices extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Orders, (order) => order.invoice)
  @JoinColumn({ name: "order_id" })
  order: Orders;

  @Column({
    name: "order_id",
  })
  order_id: string;

  @OneToMany(() => OrderItems, (items) => items.invoice)
  items: OrderItems[];

  @OneToMany(() => Payments, (pay) => pay.invoice)
  payments: Payments[];

  @Column({
    type: "timestamp",
    default: Timestamp,
  })
  invoice_datetime: string;

  @Column({
    nullable: true,
  })
  delivery_charge: string;

  @Column({
    type: "boolean",
    default: false,
  })
  delivery_charge_excluded: Boolean;

  @Column({
    nullable: true,
  })
  taxes: string;

  @Column({
    nullable: true,
  })
  deductions: string;

  @Column()
  item_total: string;

  @Column({
    nullable: true,
  })
  discount_amount: string;

  @Column({
    nullable: true,
  })
  offer_amount: string;

  @Column({
    nullable: true,
  })
  commission: string;

  @Column({
    nullable: true,
    default: "SAR",
  })
  currency: string;

  @Column({
    nullable: true,
  })
  grand_total: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
