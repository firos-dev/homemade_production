import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeUpdate,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import bcrypt from "bcrypt";
import { Roles } from "./Roles";
import { Customers } from "./Customers";
@Entity("users")
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Roles)
  @JoinColumn({
    name: "role_id",
  })
  role: Roles;

  @Column({
    name: "role_id",
    nullable: true,
  })
  role_id: string;

  @OneToOne(() => Customers, (customer) => customer.user)
  @JoinColumn({
    name: "customer_id",
  })
  customer: Customers;

  @Column({
    nullable: true,
    name: "customer_id",
  })
  customer_id: string;

  @Column({
    nullable: true,
  })
  first_name: string;

  @Column({
    nullable: true,
  })
  last_name: string;

  @Column({
    nullable: true,
  })
  full_name: string;

  @Column({
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  mobile: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    nullable: true,
  })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
