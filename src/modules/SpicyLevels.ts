import { Status } from "src/helpers/enums";
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("spicy_levels")
export class SpicyLevels extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  level: string;

  @Column()
  icon: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    type: 'enum',
  })
  status: Status

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
