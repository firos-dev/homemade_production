import { Status } from "../helpers/enums";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("id_master")
export class IdMaster extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  field_name: string;

  @Column()
  table: string;

  @Column({
    nullable: true,
  })
  prefix: string;

  @Column({
    nullable: true,
  })
  suffix: string;

  @Column({
    type: "numeric",
  })
  start_value: number;

  @Column({
    type: "numeric",
    nullable: true,
  })
  end_value: number;

  @Column({
    type: "numeric",
  })
  current_value: number;

  @Column({
    type: "numeric",
  })
  next_value: number;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
