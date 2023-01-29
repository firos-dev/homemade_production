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
import { Roles } from "./Roles";
import { Dietries } from "./Dietries";
import { Locations } from "./Locations";
import { Chefs } from "./Chefs";
@Entity("availabilities")
export class Availabilities extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Chefs)
  @JoinColumn({ name: "chef_id" })
  chef: Chefs;

  @Column()
  chef_id: String;

  @Column({
    type: "date",
  })
  date: String;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
