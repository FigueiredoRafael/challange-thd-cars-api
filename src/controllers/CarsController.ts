const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import { Request, Response } from "express";

class CarsController {
  static async index(req: Request, res: Response) {
    try {
      const cars = await prisma.car.findMany();

      if (cars.length <= 0) {
        return res.status(200).json({
          success: true,
          msg: "⚠️ No cars registered! You can start by creating some.",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "✔️ cars recovered successfully!",
        data: cars,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, msg: "✖️ An error occurred!" });
    }
  }

  static async create(req: Request, res: Response) {
    const payload = req.body;

    try {
      const car = await prisma.car.create({
        data: {
          make: payload.make,
          model: payload.model,
          package: payload.package,
          color: payload.color,
          category: payload.category,
          mileage: payload.mileage,
          price: payload.price,
          year: payload.year,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "✔️ Car created successfully!",
        data: car,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, msg: "✖️ An error occurred!" });
    }
  }

  static async show(req: Request, res: Response) {
    try {

      const car = await prisma.car.findFirst({
        where: {
          id: req.params.id,
        },
      });

      if (car) {
        return res.json({ success: true, data: car });
      } else {
        return res.status(404).json({ success: false, msg: "Car not found" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, msg: "✖️ An error occurred!" });
    }
  }
}

export default CarsController;
