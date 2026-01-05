import {
  IsString,
  IsNumber,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';

export class CreateVoitureDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  year: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  mileage: number;

  @IsBoolean()
  isAvailable?: boolean;
}
