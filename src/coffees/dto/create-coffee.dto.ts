import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Flavor } from "../entities/flavors.entity";

export class CreateCoffeeDto {
    @ApiProperty({description: 'The name of the coffee'})
    @IsString()
    readonly name : string;
    
    @ApiProperty({description: 'Brand of the coffee'})
    @IsString()
    readonly brand : string;
    
    @ApiProperty({description: 'shijet bre burr'})
    @IsString({each: true})
    readonly flavors : string[];
}
