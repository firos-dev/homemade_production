import { SpicyLevels } from './SpicyLevels';
import { Cuisines } from './Cuisines';
import { Users } from './User';
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
import { Dietries } from './Dietries';
@Entity("chefs")
export class Chefs extends BaseEntity {
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

  @ManyToOne(() => Cuisines)
  @JoinColumn({
    name: 'cuisine_id'
  })
  cuisine: Cuisines

  @Column({
    nullable: true
  })
  cuisine_id: String;

  @ManyToOne(() => Dietries)
  @JoinColumn({
    name: 'dietry_id'
  })
  dietry: Dietries

  @Column({
    nullable: true
  })
  dietry_id: String;

  @ManyToOne(() => SpicyLevels)
  @JoinColumn({
    name: 'spicy_level_id'
  })
  spicy_level: SpicyLevels;

  @Column({
    nullable: true
  })
  spicy_level_id: String;

  @Column({
    type: 'text',
    nullable: true
  })
  description: String;

  @Column({
    type: 'text',
    nullable: true
  })
  facebook: String;

  @Column({
    type: 'text',
    nullable: true
  })
  instagram: String;

  @Column({
    type: 'text',
    nullable: true
  })
  youtube: String;

  @Column({
    type: 'text',
    nullable: true
  })
  twitter: String;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
