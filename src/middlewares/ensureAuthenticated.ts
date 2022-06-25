import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UsersRepository } from "../modules/accounts/repositories/implementation/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("Token missing");

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      "a7e071b3de48cec1dd24de6cbe6c7bf1"
    ) as IPayload;

    const user = await new UsersRepository().findById(user_id);
    if (!user) throw new Error('User does not exists!')

    next()
  } catch (error) {
    throw new Error("Invalid token!");
  }
}
