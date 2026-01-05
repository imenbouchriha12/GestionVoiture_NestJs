import { Injectable, NotFoundException } from '@nestjs/common';
import { Voiture } from './voiture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateVoitureDto } from 'src/dto/create-voiture.dto';
import { ObjectId } from 'mongodb';
import { UpdateVoitureDto } from 'src/dto/update-voiture.dto';

@Injectable()
export class VoituresService {
      constructor(
    @InjectRepository(Voiture)
    private readonly voitureRepo: MongoRepository<Voiture>,
  ) {}

  // CREATE
  async create(dto: CreateVoitureDto): Promise<Voiture> {
    const voiture = this.voitureRepo.create(dto);
    return this.voitureRepo.save(voiture);
  }

  // READ ALL
  async findAll(): Promise<Voiture[]> {
    return this.voitureRepo.find();
  }

  async findAvailable() {
  return this.voitureRepo.find({
    where: { isAvailable: true },
  });
}

  // READ ONE (✅ CORRIGÉ)
  async findOne(id: string): Promise<Voiture> {
    const voiture = await this.voitureRepo.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!voiture) {
      throw new NotFoundException('voiture not found');
    }

    return voiture;
  }

  // UPDATE
  async update(id: string, dto: UpdateVoitureDto): Promise<Voiture> {
    const voiture = await this.findOne(id);
    Object.assign(voiture, dto);
    return this.voitureRepo.save(voiture);
  }

  // DELETE
  async remove(id: string) {
    return this.voitureRepo.delete(new ObjectId(id));
  }


async calculAge(id: string): Promise<{ age: number }> {
  const car = await this.findOne(id); // méthode findOne existante
  const currentYear = new Date().getFullYear();

  const age = currentYear - car.year;

  return { age };
}


}
