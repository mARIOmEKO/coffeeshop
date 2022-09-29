import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, SetMetadata, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService){}
    
    @ApiForbiddenResponse({description: 'Forbidden.'})
    @Public()
    @Get()
     findAll(@Query() paginationQuery){
        //const{ limit, offset } = paginationQuery;
        return this.coffeesService.findAll(paginationQuery)
    }

    @Public()
    @Get(':id')
    findone(@Param('id') id:string){
        return this.coffeesService.findOne(id);
    }

    @Public()
    @Post()
    create(@Body() createCoffeeDto : CreateCoffeeDto){
        console.log(createCoffeeDto instanceof CreateCoffeeDto)
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id:string, @Body() updateCoffeeDto: UpdateCoffeeDto){
       return this.coffeesService.update(id, updateCoffeeDto);
    }
 
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.coffeesService.remove(id);
    }
}
