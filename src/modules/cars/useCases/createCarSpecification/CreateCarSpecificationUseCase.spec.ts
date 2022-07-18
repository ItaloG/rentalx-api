import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe("Create Car", () => {
  beforeAll(() => {});

  beforeEach(() => {
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase();
  });

  it("should be able to create a new car", async () => {
    await createCarSpecificationUseCase.execute();
  });
});
