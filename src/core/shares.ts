import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {Company} from './company';
import {Bond} from "./bonds";

@Entity()
export class BondShare {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        type => Bond,
        bond => bond.shares,
    )
    bond: Bond;


    @ManyToOne(
        type => Company,
        company => company.shares,
    )
    owner: Company;

    @Column()
    amount: number;

}
