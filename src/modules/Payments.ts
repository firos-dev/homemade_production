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
import { Invoices } from "./Invoices";

export enum PayStatus {
  PAID = "Paid",
  UNPAID = "Unpaid",
}

export enum PayType {
  PAYMENT = "Payment",
  REFUND = "Refund",
}
@Entity("payments")
export class Payments extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Invoices, (invoice) => invoice.payments)
  @JoinColumn({ name: "invoice_id" })
  invoice: Invoices;

  @Column({
    name: "invoice_id",
  })
  invoice_id: string;

  @Column()
  amount: string;

  @Column()
  payment_method: string;

  @Column({
    nullable: true,
  })
  payment_method_ar: string;

  @Column()
  payment_method_id: string;

  @Column({
    type: "enum",
    enum: PayStatus,
    default: PayStatus.PAID,
  })
  status: PayStatus;

  @Column({
    type: "enum",
    enum: PayType,
    default: PayType.PAYMENT,
  })
  type: PayType;

  @Column({
    nullable: true,
    default: "SAR",
  })
  currency: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
