import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Status {
  OPEN = 1,
  CLOSE = 0
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @Column({ type: "uuid" })
  edited_by: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column()
  file_name: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CLOSE
  })
  status: Status;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
};
