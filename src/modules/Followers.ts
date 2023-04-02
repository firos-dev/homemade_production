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

@Entity("followers")
export class Followers extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Users, (user) => user.followers)
  @JoinColumn({ name: "follow_id" })
  follow: Users;

  @Column()
  follow_id: String;

  @ManyToOne(() => Users, (user) => user.following)
  @JoinColumn({ name: "followed_by_id" })
  followed_by: Users;

  @Column()
  followed_by_id: String;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
