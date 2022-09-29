import { Entity,PrimaryGeneratedColumn,Column, JoinTable, ManyToMany} from 'typeorm'
import { Flavor } from './flavors.entity';

@Entity('coffees') //sql table -- coffees
export class Coffee{

    @PrimaryGeneratedColumn()
    id : number;
    
    @Column()
    name : string;
    
    @Column()
    brand : string;

    @Column({default: 0})
    recommendations: number;

    @JoinTable()
    @ManyToMany(type => Flavor,(flavor) =>flavor.coffees, {eager:true, cascade: true})
    flavors : Flavor[];
}