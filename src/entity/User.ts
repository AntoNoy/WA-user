import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, OneToMany
} from "typeorm";
import {RefreshTocken} from "./refreshToken";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    username: string;

    @Column({
        select: false
    })
    password: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    nom: string;

    @Column()
    prenom: string;

    @Column({nullable: true})
    civilite: string;

    @Column({nullable: true})
    actif: boolean;

    @Column({nullable: true})
    avatar: string;

    @OneToMany(type => RefreshTocken, refreshToken=> refreshToken.user)
    refreshTocken: RefreshTocken[];

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;


}