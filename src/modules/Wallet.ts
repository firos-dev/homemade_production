import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Users } from "./User";
import { Payments } from "./Payments";

export enum AmountType {
  DELIVERY_CHARGE = "Delivery Charge",
  COMMISSION = "Commission",
}

@Entity("wallet")
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Payments)
  @JoinColumn({ name: "payment_id" })
  payment: Payments;

  @Column({
    name: "payment_id",
  })
  payment_id: string;

  @ManyToOne(() => Users, (user) => user.wallet)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @Column()
  user_id: String;

  @Column()
  amount: string;

  @Column({
    type: "boolean",
    default: false,
  })
  withdraw: Boolean;

  @Column({
    type: "enum",
    enum: AmountType,
  })
  amount_type: AmountType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
