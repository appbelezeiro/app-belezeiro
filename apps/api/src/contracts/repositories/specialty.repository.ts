import { Specialty } from '../../domain/catalog/specialty/specialty.aggregate';

export interface ISpecialtyRepository {
  create(specialty: Specialty): Promise<Specialty>;
  findById(id: string): Promise<Specialty | null>;
  findGlobal(): Promise<Specialty[]>;
  findByProfessionalId(professionalProfileId: string): Promise<Specialty[]>;
  update(specialty: Specialty): Promise<Specialty>;
}
