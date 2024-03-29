import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";

class ListRentalsByUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const listRentalsByUSerUseCase = container.resolve(
      ListRentalsByUserUseCase
    );

    const rentals = await listRentalsByUSerUseCase.execute(id);

    return res.json(rentals);
  }
}

export { ListRentalsByUserController };
