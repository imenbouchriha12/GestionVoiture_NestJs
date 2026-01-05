import { Module } from '@nestjs/common';
import { VoituresController } from './voitures.controller';
import { VoituresService } from './voitures.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voiture } from './voiture.entity';
import { VoituresGateway } from './voitures.gateway';

@Module({
   imports: [TypeOrmModule.forFeature([Voiture])],
  controllers: [VoituresController],
  providers: [VoituresService, VoituresGateway]
})
export class VoituresModule {}
