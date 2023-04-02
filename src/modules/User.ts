import { Followers } from "./Followers";
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
  OneToMany,
} from "typeorm";
import bcrypt from "bcrypt";
import { Roles } from "./Roles";
import { Customers } from "./Customers";
import { Chefs } from "./Chefs";
import { Locations } from "./Locations";
import { Orders } from "./Orders";
import { Cart } from "./Cart";
import { UserType } from "../helpers/enums";
import { Reviews } from "./Reviews";
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

  @OneToOne(() => Customers, (customer) => customer.user, { cascade: true })
  @JoinColumn({
    name: "customer_id",
  })
  customer: Customers;

  @Column({
    nullable: true,
    name: "customer_id",
  })
  customer_id: string;

  @OneToOne(() => Chefs, (chef) => chef.user, { cascade: true })
  @JoinColumn({
    name: "chef_id",
  })
  chef: Chefs;

  @Column({
    nullable: true,
    name: "chef_id",
  })
  chef_id: string;

  @OneToMany(() => Locations, (location) => location.user)
  locations: Locations[];

  @OneToMany(() => Followers, (follow) => follow.followed_by)
  following: Followers[];

  @OneToMany(() => Followers, (follow) => follow.follow)
  followers: Followers[];

  @OneToMany(() => Orders, (location) => location.user)
  orders: Orders[];

  @OneToMany(() => Cart, (cart) => cart.user)
  cart_items: Cart[];

  @Column({
    nullable: true,
  })
  first_name: string;

  @Column({
    nullable: true,
  })
  middle_name: string;

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

  @Column({
    type: "enum",
    enum: UserType,
    nullable: true,
  })
  user_type: UserType;

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
