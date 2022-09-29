import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavors.entity';
import { Event } from '../events/entities/event.entity';
import { ConfigService } from '@nestjs/config'
@Injectable()
export class CoffeesService {
constructor(
    @InjectRepository(Coffee)
    private readonly coffeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    private readonly configService: ConfigService,
){
    // const databaseHost = this.configService.get<string>('DATABASE_HOST', 'localhost');
    // console.log(databaseHost)
}

     findAll(paginationQuery : PaginationQueryDto){
        const{ limit, offset} = paginationQuery;
         return this.coffeRepository.find({
            //relations: ['flavors'],
            skip: offset,
            take: limit,
         });
    }

    async findOne(id: string){
        const coffee = await this.coffeRepository.findOne({where: {id : +id},
        //relations : ['flavors']
        });
        if(!coffee){
            throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
        }
        return coffee;
    }

     async create(createCoffeeDto:CreateCoffeeDto){
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        );

        const coffee =  this.coffeRepository.create({
            ...createCoffeeDto,
            flavors,
        });
        return this.coffeRepository.save(coffee);
    }
    
    async update(id: string, updateCoffeeDto : UpdateCoffeeDto){
        const flavors =updateCoffeeDto && (await Promise.all(
            updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        ));
        const coffee =  await this.coffeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
        });
        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found!`);
        }
        return this.coffeRepository.save(coffee);
        
    }
    
    async remove(id:string){
       const coffee = await this.findOne(id);
       return this.coffeRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: string): Promise<Flavor>{
        const existingFlavor = await this.flavorRepository.findOne({where : {name: name}})
        if(existingFlavor){
            return existingFlavor;
        }
        return this.flavorRepository.create({name})
    }

    async recommendCoffee(coffee: Coffee){
        const queryRuner = this.connection.createQueryRunner();

        await queryRuner.connect();
        await queryRuner.startTransaction();
        try{
            coffee.recommendations++;

            const recommendEvent= new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload= {coffeeId: coffee.id};

            await queryRuner.manager.save(coffee);
            await queryRuner.manager.save(recommendEvent);

            await queryRuner.commitTransaction();
        } catch(err){
            await queryRuner.rollbackTransaction();
        }finally{
            await queryRuner.release();
        }
    }
}
