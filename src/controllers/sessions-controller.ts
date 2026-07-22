import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email({ message: "E-mail inválido" }),
      password: z.string().min(6, { message: "Senha inválida" }),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("E-mail ou senha inválidos");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("E-mail ou senha inválidos");
    }

    response.json({ email, password });
  }
}

export { SessionsController };
