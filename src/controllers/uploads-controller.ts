import { Request, Response } from "express";
import z,{ZodError} from "zod";
import uploadConfig from "@/configs/upload";
import { DiskStorage } from "@/providers/disk-storage";
import { AppError } from "@/utils/AppError";

class UploadsController {
  async create(request: Request, response: Response) {
    const diskStorage = new DiskStorage();
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

      const file = fileSchema.parse(request.file);

      const filename = await diskStorage.savefile(file.filename);

      response.json({ filename });
    } catch (error) {
      if (error instanceof ZodError) {
        if(request.file?.filename){
          await diskStorage.deleteFile(request.file.filename, "tmp");
        }

        throw new AppError(error.issues[0].message, 400);
      }
      throw error;
    }
  }
}

export { UploadsController };
