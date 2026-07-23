import { Request, Response } from "express";
import { z } from "zod";

const CategoriesEnum = z.enum([
  "food",
  "services",
  "others",
  "transport",
  "accommodation",
]);

class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(1, { message: "Informe o nome da solicitação" }),
      category: CategoriesEnum,
      amount: z.number().positive({ message: "O valor precisa ser positivo" }),
      filename: z.string().min(20),
    });

    const { name } = bodySchema.parse(request.body);
    response.json({ message: "Ok" });
  }
}

export { RefundsController };
