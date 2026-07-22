import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { AppError } from "@/utils/AppError";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2, {
        message: "Nome e obrigatorio e deve ter no minimo 2 caracteres",
      }),
      email: z
        .string()
        .trim()
        .email({
          message: "Email invalido",
        })
        .toLowerCase(),
      password: z.string().trim().min(6, {
        message: "Senha e obrigatoria e deve ter no minimo 6 caracteres",
      }),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    });
    const { name, email, password, role } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("Ja existe um usuario com esse email", 409);
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    response.status(201).json();
  }
}

export { UsersController };
