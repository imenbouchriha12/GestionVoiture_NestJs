import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { UpdateVoitureDto } from 'src/dto/update-voiture.dto';
import { VoituresService } from './voitures.service';
import { CreateVoitureDto } from 'src/dto/create-voiture.dto';
import { SimpleInterceptor } from 'src/interceptors/simple/simple.interceptor';
import { MongoIdPipe } from 'src/common/pipes/mongo-id.pipe';
import { YearValidationPipe } from 'src/common/pipes/year-validation.pipe';
import { PriceValidationPipe } from 'src/common/pipes/price-validation.pipe';
import { SearchPipe } from 'src/common/pipes/search-pipe.pipe';
import {  StringNormalizePipe } from 'src/common/pipes/string-normalize.pipe';
import { BooleanPipe } from 'src/common/pipes/boolean.pipe';

@UseInterceptors(SimpleInterceptor)
@Controller('voitures')
export class VoituresController {
      constructor(private readonly voitureService: VoituresService) {}

  // CREATE
 @Post()
  create(@Body() dto: CreateVoitureDto) {
    return this.voitureService.create(dto);
  }

@Get('available')
findAvailable() {
  return this.voitureService.findAvailable();
}





  @Get()
  findAll() {
    return this.voitureService.findAll();
  }




  @Get(':id')
  findOne(@Param('id' , MongoIdPipe) id: string) {
    return this.voitureService.findOne(id);
  }

 

 /* @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVoitureDto,
  ) {
    return this.voitureService.update(id, dto);
  }*/

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voitureService.remove(id);
  }


  // Calcul de l'âge de la voiture
  @Get(':id/age')
  calculAge(@Param('id') id: string) {
    return this.voitureService.calculAge(id);
  }



  @Get('search')
search(@Query('q',SearchPipe) q: string) {
  return this.voitureService.search(q);
}


@Patch(':id')
update(
  @Param('id', MongoIdPipe) id: string,

  @Body('brand', StringNormalizePipe) brand?: string,
  @Body('model', StringNormalizePipe) model?: string,
  @Body('year', YearValidationPipe) year?: number,
  @Body('price', PriceValidationPipe) price?: number,
  @Body('mileage') mileage?: number,
  @Body('isAvailable', BooleanPipe) isAvailable?: boolean,
) {
  return this.voitureService.update(id, {
    brand,
    model,
    year,
    price,
    mileage,
    isAvailable,
  });
}


}
