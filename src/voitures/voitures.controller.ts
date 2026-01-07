import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateVoitureDto } from 'src/dto/update-voiture.dto';
import { VoituresService } from './voitures.service';
import { CreateVoitureDto } from 'src/dto/create-voiture.dto';
import { SimpleInterceptor } from 'src/interceptors/simple/simple.interceptor';
import { BooleanPipe } from 'src/common/pipes/boolean.pipe';
import { PriceValidationPipe } from 'src/common/pipes/price-validation.pipe';
import { StringNormalizePipe } from 'src/common/pipes/string-normalize.pipe';
import { MongoIdPipe } from 'src/common/pipes/mongo-id.pipe';
import { YearValidationPipe } from 'src/common/pipes/year-validation.pipe';
import { SearchPipe } from 'src/common/pipes/search-pipe.pipe';

@UseInterceptors(SimpleInterceptor)
@Controller('voitures')
export class VoituresController {
  constructor(private readonly voitureService: VoituresService) {}

  // =================== CREATE ===================

  @Post()
  create(@Body() dto: CreateVoitureDto) {
    return this.voitureService.create(dto);
  }

  // =================== ROUTES SPÉCIFIQUES (AVANT :id) ===================

  // --- Recherche & Filtrage ---

  /**
   * GET /voitures/available
   * Récupère uniquement les voitures disponibles
   */
  @Get('available')
  findAvailable() {
    return this.voitureService.findAvailable();
  }

  /**
   * GET /voitures/search?q=toyota
   * Recherche par marque ou modèle
   */
  @Get('search')
  search(@Query('q', SearchPipe) q: string) {
    return this.voitureService.search(q);
  }

  /**
   * GET /voitures/filter/price?min=10000&max=30000
   * Filtrer par tranche de prix
   */
  @Get('filter/price')
  filterByPrice(
    @Query('min') minPrice: number,
    @Query('max') maxPrice: number,
  ) {
    return this.voitureService.findByPriceRange(+minPrice, +maxPrice);
  }

  /**
   * GET /voitures/filter/year?after=2020
   * Filtrer par année (après une année donnée)
   */
  @Get('filter/year')
  filterByYear(@Query('after') year: number) {
    return this.voitureService.findByYearAfter(+year);
  }

  /**
   * GET /voitures/filter/mileage?max=50000
   * Filtrer par kilométrage maximum
   */
  @Get('filter/mileage')
  filterByMileage(@Query('max') maxMileage: number) {
    return this.voitureService.findByMaxMileage(+maxMileage);
  }

  // --- Statistiques ---

  /**
   * GET /voitures/stats/average-price
   * Prix moyen de toutes les voitures
   */
  @Get('stats/average-price')
  getAveragePrice() {
    return this.voitureService.getAveragePrice();
  }

  /**
   * GET /voitures/stats/average-mileage
   * Kilométrage moyen
   */
  @Get('stats/average-mileage')
  getAverageMileage() {
    return this.voitureService.getAverageMileage();
  }

  // --- Tri ---

  /**
   * GET /voitures/sort/price?order=DESC
   * Trier par prix (croissant ou décroissant)
   */
  @Get('sort/price')
  sortByPrice(@Query('order') order?: 'ASC' | 'DESC') {
    return this.voitureService.sortByPrice(order || 'ASC');
  }

  // =================== ROUTES GÉNÉRIQUES ===================

  /**
   * GET /voitures
   * Récupère toutes les voitures
   */
  @Get()
  findAll() {
    return this.voitureService.findAll();
  }

  /**
   * GET /voitures/:id
   * Récupère une voiture par son ID
   */
  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.voitureService.findOne(id);
  }

  // =================== ROUTES AVEC :id/action ===================

  /**
   * GET /voitures/:id/age
   * Calcule l'âge d'une voiture
   */
  @Get(':id/age')
  calculAge(@Param('id', MongoIdPipe) id: string) {
    return this.voitureService.calculAge(id);
  }

  /**
   * GET /voitures/:id/similar
   * Trouve des voitures similaires (même marque, année proche)
   */
  @Get(':id/similar')
  findSimilar(@Param('id', MongoIdPipe) id: string) {
    return this.voitureService.findSimilar(id);
  }

  /**
   * PATCH /voitures/:id/discount?percentage=10
   * Applique une remise en pourcentage sur le prix
   */
  @Patch(':id/discount')
  applyDiscount(
    @Param('id', MongoIdPipe) id: string,
    @Query('percentage') percentage: number,
  ) {
    return this.voitureService.applyDiscount(id, +percentage);
  }

  /**
   * PATCH /voitures/:id/mark-sold
   * Marque une voiture comme vendue (indisponible)
   */
  @Patch(':id/mark-sold')
  markAsSold(@Param('id', MongoIdPipe) id: string) {
    return this.voitureService.markAsSold(id);
  }

  /**
   * PATCH /voitures/:id/mark-available
   * Marque une voiture comme disponible
   */
  @Patch(':id/mark-available')
  markAsAvailable(@Param('id', MongoIdPipe) id: string) {
    return this.voitureService.markAsAvailable(id);
  }

  // =================== UPDATE & DELETE ===================

  /**
   * PATCH /voitures/:id
   * Met à jour une voiture
   */
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

  /**
   * DELETE /voitures/:id
   * Supprime une voiture
   */
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.voitureService.remove(id);
  }
}