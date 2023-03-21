import { OrderChefStatus, OrderDeliveryStatus } from "./../helpers/enums";
import { OrderStatus, Status } from "../helpers/enums";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from "typeorm";
import { Users } from "./User";
import { Orders } from "./Orders";
import { Items } from "./Items";

export enum Activity {
    CREATED = "Created",
    START_PREPARING = "Start Preparing",
    ASSIGN_DELIVERY = "Assign delivery",
    

}

@Entity("order_items")
export class OrderItems extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Orders)
  @JoinColumn({ name: "order_id" })
  order: Users;
  
  @Column()
  order_id: String;

  @Column()

} 