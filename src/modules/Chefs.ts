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
import { Dietries } from "./Dietries";
import { Locations } from "./Locations";
import { Status } from "./../helpers/enums";
import { Reviews } from "./Reviews";
import { Availabilities } from "./Availabilities";
import { Items } from "./Items";
@Entity("chefs")
export class Chefs extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Users, (user) => user.chef, { cascade: ["insert"] })
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

  @ManyToOne(() => Cuisines)
  @JoinColumn({
    name: "cuisine_id",
  })
  cuisine: Cuisines;

  @OneToOne(() => Availabilities, (avail) => avail.chef)
  availability: Availabilities;

  @Column({
    type: "text",
    nullable: true,
  })
  bio: string;

  @Column({
    nullable: true,
  })
  iban_number: string;

  @Column({
    nullable: true,
  })
  store_name_english: string;

  @Column({
    nullable: true,
  })
  store_name_arabic: string;

  @Column({
    nullable: true,
  })
  cuisine_id: String;

  @ManyToOne(() => Dietries)
  @JoinColumn({
    name: "dietry_id",
  })
  dietry: Dietries;

  @OneToMany(() => Orders, (order) => order.chef)
  orders: Orders[];

  @Column({
    nullable: true,
  })
  dietry_id: String;

  @ManyToOne(() => SpicyLevels)
  @JoinColumn({
    name: "spicy_level_id",
  })
  spicy_level: SpicyLevels;

  @Column({
    nullable: true,
  })
  spicy_level_id: String;

  @ManyToOne(() => Locations)
  @JoinColumn({
    name: "location_id",
  })
  location: Locations;

  @Column({
    nullable: true,
  })
  location_id: String;

  @ManyToOne(() => Locations)
  @JoinColumn({
    name: "drop_off_point_id",
  })
  drop_off_point: Locations;

  @Column({
    nullable: true,
  })
  drop_off_point_id: String;

  @Column({
    type: "text",
    nullable: true,
  })
  certificate_file: String;

  @Column({
    type: "text",
    nullable: true,
  })
  certificate_key: String;

  @Column({
    type: "text",
    nullable: true,
  })
  national_id: String;

  @Column({
    type: "text",
    nullable: true,
  })
  national_id_key: String;

  @Column({
    nullable: true,
  })
  certificate_number: String;

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

  @OneToMany(() => Items, (item) => item.chef)
  items: Items[];

  @Column({
    type: "text",
    nullable: true,
  })
  description: String;

  @Column({
    nullable: true,
    default: "10",
  })
  commission: String;

  @Column({
    type: "boolean",
    default: true,
  })
  commission_single_change: Boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  terms_accepted: boolean;

  @OneToMany(() => Reviews, (reviews) => reviews.chef, { cascade: true })
  reviews: Reviews[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
