import {
  IsString,
  IsNumber,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class UpdateVoitureDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  year?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mileage?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
