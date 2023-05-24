import { Orders } from "./Orders";
import { SpicyLevels } from "./SpicyLevels";
import { Cuisines } from "./Cuisines";
import { Users } from "./User";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Status } from "./../helpers/enums";
import { Reviews } from "./Reviews";
@Entity("delivery_partners")
export class DeliveryPartners extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Users)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @Column()
  user_id: String;

  @Column({
    type: "text",
    nullable: true,
  })
  image: String;

  @Column({
    type: "text",
    nullable: true,
  })
  image_key: String;

  @Column({
    type: "text",
    nullable: true,
  })
  bio: string;

  @OneToMany(() => Orders, (order) => order.delivery_partner)
  orders: Orders[];

  @Column({
    type: "text",
    nullable: true,
  })
  licence_front: String;

  @Column({
    type: "text",
    nullable: true,
  })
  licence_front_key: String;

  @Column({
    type: "text",
    nullable: true,
  })
  licence_back: String;

  @Column({
    type: "text",
    nullable: true,
  })
  licence_back_key: String;

  @Column({
    type: "text",
    nullable: true,
  })
  licence_key: String;

  @Column({
    nullable: true,
  })
  licence_number: String;

  @Column({
    type: "text",
    nullable: true,
  })
  id_card_front: String;

  @Column({
    type: "text",
    nullable: true,
  })
  id_card_front_key: String;

  @Column({
    type: "text",
    nullable: true,
  })
  id_card_back: String;

  @Column({
    type: "text",
    nullable: true,
  })
  id_card_back_key: String;

  @Column({
    type: "text",
    nullable: true,
  })
  car_front_image: String;

  @Column({
    type: "text",
    nullable: true,
  })
  car_front_image_key: String;

  @Column({
    type: "text",
    nullable: true,
  })
  car_back_image: String;

  @Column({
    type: "text",
    nullable: true,
  })
  car_back_image_key: String;

  @Column({
    type: "text",
    nullable: true,
  })
  description: String;

  @Column({
    type: "text",
    nullable: true,
  })
  nationality: String;

  @Column({
    type: "text",
    nullable: true,
  })
  car_registration: String;

  @Column({
    type: "text",
    default: "10",
  })
  delivery_charge: String;
  
  @Column({
    type: "boolean",
    default: true,
  })
  charge_single_change: Boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  online: boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  terms_accepted: boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  verified: Boolean;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.INACTIVE,
  })
  status: Status;

  @OneToMany(() => Reviews, (reviews) => reviews.delivery_partner, {
    cascade: true,
  })
  reviews: Reviews[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
