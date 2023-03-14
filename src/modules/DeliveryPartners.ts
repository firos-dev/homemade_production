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
import { Roles } from "./Roles";
import { Dietries } from "./Dietries";
import { Locations } from "./Locations";
import { Status } from "./../helpers/enums";
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
  bio: string;

  @OneToMany(() => Orders, (order) => order.delivery_partner)
  orders: Orders[];

  @Column({
    type: "text",
    nullable: true,
  })
  licence_file: String;

  @Column({
    nullable: true,
  })
  licence_number: String;

  @Column({
    type: "text",
    nullable: true,
  })
  description: String;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
