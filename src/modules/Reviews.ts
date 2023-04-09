import { Chefs } from "./Chefs";
import { DeliveryPartners } from "./DeliveryPartners";
import { Items } from "./Items";
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

@Entity("reviews")
export class Reviews extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: "reviewed_id" })
  reviewed_by: Users;

  @Column({
    name: "reviewed_id",
  })
  reviewed_id: String;

  @ManyToOne(() => Chefs, (chef) => chef.reviews)
  @JoinColumn({ name: "chef_id" })
  chef: Chefs;

  @Column({
    nullable: true,
    name: "chef_id",
  })
  chef_id: String;

  @ManyToOne(() => DeliveryPartners, (delivery) => delivery.reviews)
  @JoinColumn({ name: "delivery_partner_id" })
  delivery_partner: DeliveryPartners;

  @Column({
    nullable: true,
    name: "delivery_partner_id",
  })
  delivery_partner_id: String;

  @ManyToOne(() => Items, (item) => item.reviews)
  @JoinColumn({ name: "item_id" })
  item: Items;

  @Column({
    nullable: true,
    name: "item_id",
  })
  item_id: String;

  @Column({
    type: "text",
    nullable: true,
  })
  item_review: string;

  @Column({
    type: "text",
    nullable: true,
  })
  chef_review: string;

  @Column({
    type: "text",
    nullable: true,
  })
  delivery_review: string;

  @Column({
    type: "numeric"
  })
  star_count: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
