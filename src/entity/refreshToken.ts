import {
    Entity,
    PrimaryGeneratedColumn,
    Column,

    UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn,
} from "typeorm";
import {User} from "./User";


@Entity()
export class RefreshTocken {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.refreshTocken)
    @JoinColumn()
    user: User;

    @Column()
    refreshToken:string;

    @Column()
    validDate:Date;

    @Column({nullable:true})
    ip:string;

    @CreateDateColumn({nullable: true})
    dateCreation: Date;

}