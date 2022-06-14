import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum IsAdmin {
  ISADMIN = 1,
  NOTADMIN = 0
}

@Entity()
export class User{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
      unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: IsAdmin,
    default: IsAdmin.NOTADMIN
  })
  is_admin: IsAdmin
};
