import { Request, Response } from "express";
import z from "zod";
import uploadConfig from "@/configs/upload";

class UploadsController {
  async create(request: Request, response: Response) {
    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, "Arquivo e obrigatorio"),
          mimetype: z
            .string()
            .refine(
              (type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
              "Formato de arquivo invalido. Formatos aceitos:" +
                uploadConfig.ACCEPTED_IMAGE_TYPES,
            ),
          size: z
            .number()
            .positive()
            .refine(
              (size) => uploadConfig.MAX_FILE_SIZE,
              "Arquivo excede o tamanho maximo de " +
                uploadConfig.MAX_SIZE +
                "MB",
            ),
        })
        .passthrough();

      const { file } = fileSchema.parse(request.file);

      response.json({ message: "OK" });
    } catch (error) {
      throw error;
    }
  }
}

export { UploadsController };
