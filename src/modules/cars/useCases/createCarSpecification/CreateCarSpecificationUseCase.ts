import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ISpecificationRepository } from "@modules/cars/repositories/ISpecificationRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  car_id: string;
  specifications_id: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    
    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationRepository
  ) {}

  async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
    const carExits = await this.carsRepository.findById(car_id);

    if (!carExits) throw new AppError("Car does not exists!");

    const specifications = await this.specificationsRepository.findByIds(
      specifications_id
    );

    carExits.specifications = specifications;
    await this.carsRepository.create(carExits);

    return carExits;
  }
}

export { CreateCarSpecificationUseCase };
