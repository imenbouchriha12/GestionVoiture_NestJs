
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


// SEARCH by marque or modele
async search(keyword: string): Promise<Voiture[]> {
  return this.voitureRepo.find({
    where: {
      $or: [
        { marque: { $regex: keyword, $options: 'i' } },
        { modele: { $regex: keyword, $options: 'i' } },
      ],
    },
  });
}


  /**
   * Filtrer par tranche de prix
   */
  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Voiture[]> {
    return await this.voitureRepo.find({
      where: {
        price: { $gte: minPrice, $lte: maxPrice },
      },
    });
  }

  /**
   * Filtrer par année (après une année donnée)
   */
  async findByYearAfter(year: number): Promise<Voiture[]> {
    return await this.voitureRepo.find({
      where: { year: { $gte: year } },
    });
  }

  /**
   * Filtrer par kilométrage maximum
   */
  async findByMaxMileage(maxMileage: number): Promise<Voiture[]> {
    return await this.voitureRepo.find({
      where: { mileage: { $lte: maxMileage } },
    });
  }

    /**
   * Prix moyen de toutes les voitures
   */
  async getAveragePrice(): Promise<{ averagePrice: number }> {
    const voitures = await this.voitureRepo.find();
    if (voitures.length === 0) return { averagePrice: 0 };
    
    const total = voitures.reduce((sum, v) => sum + v.price, 0);
    return { averagePrice: Math.round(total / voitures.length) };
  }

  /**
   * Kilométrage moyen
   */
  async getAverageMileage(): Promise<{ averageMileage: number }> {
    const voitures = await this.voitureRepo.find();
    if (voitures.length === 0) return { averageMileage: 0 };
    
    const total = voitures.reduce((sum, v) => sum + v.mileage, 0);
    return { averageMileage: Math.round(total / voitures.length) };
  }


    /**
   * Appliquer une remise sur le prix
   */
  async applyDiscount(id: string, discountPercentage: number): Promise<Voiture> {
    const voiture = await this.findOne(id);
    const newPrice = Math.round(voiture.price * (1 - discountPercentage / 100));
    return await this.update(id, { price: newPrice });
  }

  /**
   * Marquer comme vendu (indisponible)
   */
  async markAsSold(id: string): Promise<Voiture> {
    return await this.update(id, { isAvailable: false });
  }

    /**
   * Marquer comme disponible
   */
  async markAsAvailable(id: string): Promise<Voiture> {
    return await this.update(id, { isAvailable: true });
  }

  /**
   * Trouver des voitures similaires (même marque, année proche)
   */
  async findSimilar(id: string): Promise<Voiture[]> {
    const voiture = await this.findOne(id);
    
    return await this.voitureRepo.find({
      where: {
        _id: { $ne: new ObjectId(id) },
        brand: voiture.brand,
        year: { $gte: voiture.year - 2, $lte: voiture.year + 2 },
      },
    });
  }
    /**
   * Trier par prix (croissant ou décroissant)
   */
  async sortByPrice(order: 'ASC' | 'DESC' = 'ASC'): Promise<Voiture[]> {
    const voitures = await this.voitureRepo.find();
    return voitures.sort((a, b) => 
      order === 'ASC' ? a.price - b.price : b.price - a.price
    );
  }
}