import {
  Entity,
  ObjectIdColumn,
  Column,
  BeforeInsert,
  AfterLoad,
  BeforeUpdate,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';

@Entity('voiture')
export class Voiture {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: ObjectId;

  @Column()
  brand: string; // ex: Toyota, BMW

  @Column()
  model: string; // ex: Corolla, X5

  @Column()
  year: number; // ex: 2022

  @Column()
  color: string;

  // ===== Données métier =====

  @Column()
  price: number; // prix de base

  @Column()
  mileage: number; // kilométrage

  @Column()
  isAvailable: boolean;

  // ===== Champs calculés (non stockés) =====
  age?: number;

  // ===== Hooks TypeORM =====

  /**
   * Avant insertion
   * Initialisation de valeurs par défaut
   */
  @BeforeInsert()
  beforeInsert() {
    if (this.isAvailable === undefined) {
      this.isAvailable = true;
    }
  }

  /**
   * Après chargement depuis la DB
   * Calcul de l'âge du véhicule
   */
  @AfterLoad()
  afterLoad() {
    const currentYear = new Date().getFullYear();
    this.age = currentYear - this.year;
  }

  /*@BeforeInsert()
@BeforeUpdate()
normalizeModel() {
  if (this.model) {
    this.model = this.model.toUpperCase();
  }
}
*/
}
