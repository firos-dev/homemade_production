import { Users } from "./User";
import { Status } from "src/helpers/enums";
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

@Entity("delivery_partners")
export class DeliveryPartners extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Users)
  @JoinColumn({
    name: "user_id",
  })
  user: Users;

  @Column()
  user_id: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    type: "boolean",
    default: false,
  })
  online: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
