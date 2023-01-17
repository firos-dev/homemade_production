import { Status } from "src/helpers/enums";
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("items")
export class Items extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  unit: string;

  @Column()
  portion_size: string;

  @Column()
  price: string;

  @Column()
  image: string;

  @Column({
    type: "boolean",
    default: false,
  })
  available: boolean;

  @Column()
  description: string;

  @Column({
    nullable: true
  })
  ingredients: string;

  @Column({
    nullable: true
  })
  type: string;

  @Column({
    type: "enum",
  })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
