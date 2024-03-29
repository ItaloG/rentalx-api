import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import dayjs from "dayjs";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: IRentalsRepository;
let carsRepositoryInMemory: ICarsRepository;
let dayjsDateProvider: DayjsDateProvider;
const dayAdd24Hours = dayjs().add(1, "day").toDate();

describe("Create Rental", () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "test",
      description: "Car test",
      daily_rate: 100,
      license_plate: "test",
      fine_amount: 40,
      category_id: "1234",
      brand: "brand",
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "211212",
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    const rental = await createRentalUseCase.execute({
      car_id: "211212",
      user_id: "211212",
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: rental.car_id,
        user_id: rental.user_id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    const rental = await createRentalUseCase.execute({
      car_id: "test",
      user_id: "123",
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: rental.car_id,
        user_id: rental.user_id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it("should not be able to create a new rental with invalid return time", async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: "test",
        user_id: "123",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError("Invalid return time!"));
  });
});
