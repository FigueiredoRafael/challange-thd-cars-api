const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import { Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import { z } from "zod";

const CreateCarPayload = z.object({
  make: z
    .string({ required_error: "make is required" })
    .min(1, "Make must have at least 1 digits"),
  model: z.string({ required_error: "model is required" }),
  package: z.string({ required_error: "package is required" }),
  color: z
    .string({ required_error: "color is required" })
    .min(1, "Color must have at least 1 digits"),
  category: z.string({ required_error: "category is required" }),
  mileage: z
    .string({ required_error: "mileage is required" })
    .refine(Number, "Mileage must be number")
    .transform(Number),
  price: z
    .string({ required_error: "mileage is required" })
    .refine(Number, "Price must be number")
    .transform(Number),
  year: z
    .string({ required_error: "mileage is required" })
    .refine(Number, "Year must be number")
    .transform(Number),
});

type CreateCarPayload = z.infer<typeof CreateCarPayload>;

class CarsController {
  static async index() {
    try {
      const cars = await prisma.car.findMany();

      if (cars.length <= 0) {
        return {
          success: true,
          msg: "⚠️ No cars registered! You can start by creating some.",
        };
      }

      return {
        success: true,
        msg: "✔️ cars recovered successfully!",
        data: cars,
      };
    } catch (error) {
      console.log(error);
      const message = error instanceof Error ? error.message : "";
      throw new ApiError(
        `✖️ An error occurred!: ${message}`,
        500,
        error as Error
      );
    }
  }

  static async create(req: Request) {
    const payload = CreateCarPayload.parse(req.body);

    try {
      const car = await prisma.car.create({
        data: payload,
      });

      return {
        success: true,
        msg: "✔️ Car created successfully!",
        data: car,
      };
    } catch (error) {
      console.log(error);
      const message = error instanceof Error ? error.message : "";
      throw new ApiError(
        `✖️ An error occurred!: ${message}`,
        500,
        error as Error
      );
    }
  }

  static async show(req: Request) {
    try {
      const car = await prisma.car.findFirst({
        where: {
          id: req.params.id,
        },
      });

      if (car) {
        return { success: true, data: car };
      } else {
        throw new ApiError("Car not found", 404);
      }
    } catch (error) {
      console.log(error);
      const message = error instanceof Error ? error.message : "";
      throw new ApiError(
        `✖️ An error occurred!: ${message}`,
        500,
        error as Error
      );
    }
  }
}

export default CarsController;
