import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { UpdateVoitureDto } from 'src/dto/update-voiture.dto';
import { VoituresService } from './voitures.service';
import { CreateVoitureDto } from 'src/dto/create-voiture.dto';
import { SimpleInterceptor } from 'src/interceptors/simple/simple.interceptor';

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
  findOne(@Param('id') id: string) {
    return this.voitureService.findOne(id);
  }

 

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVoitureDto,
  ) {
    return this.voitureService.update(id, dto);
  }

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



  
}
