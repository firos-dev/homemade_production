import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Roles } from "./Roles";
import { Users } from "./User";
@Entity("permissions")
export class Permissions extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    length: 4,
  })
  permission: string;

  @Column({
    name: "role_id",
    nullable: true,
  })
  role_id: string;

  @ManyToOne(() => Roles)
  @JoinColumn({
    name: "role_id",
  })
  role: Roles;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users)
  @JoinColumn({
    name: "created_id",
  })
  created: string;

  @ManyToOne(() => Users)
  @JoinColumn({
    name: "updated_id",
  })
  updated: String;
}
