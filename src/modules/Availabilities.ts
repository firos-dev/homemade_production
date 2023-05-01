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
} from "typeorm";
import { Chefs } from "./Chefs";
@Entity("availabilities")
export class Availabilities extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Chefs, (chef) => chef.availability)
  @JoinColumn({ name: "chef_id" })
  chef: Chefs;

  @Column()
  chef_id: String;

  @Column({
    type: "boolean",
    default: false,
  })
  sunday: Boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  monday: Boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  tuesday: Boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  wednesday: Boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  thursday: Boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  friday: Boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  saturday: Boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
