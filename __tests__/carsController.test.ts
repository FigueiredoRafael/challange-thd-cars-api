import { PrismaClient } from "@prisma/client";
import CarsController from "../src/controllers/CarsController";
import { Request, Response, NextFunction } from "express";

// Mocking Express request and response objects
const registerMockRequest = () => {
  const req = {} as Request;
  req.body = {
    make: "FORD",
    model: "f10",
    package: "Base",
    color: "Silver",
    category: "Truck",
    mileage: "231.23",
    price: "3999.23",
    year: "2010",
  };
  return req;
};

describe("CarsController", () => {
  describe("create", () => {
    test("Should create a car in database", async () => {
      const createCar = await CarsController.create(
        registerMockRequest() as Request
      );
      console.log("createCar: ", createCar);
    });
  });

  describe("index", () => {
    test("Should show all cars in database", async () => {
      const testCars = await CarsController.index();
      console.log(testCars);
    });
  });

  describe("show", () => {
    test("Should show a specific car from the database", async () => {
      // Call the index method to get a list of cars
      const cars = await CarsController.index();

      // If there are cars in the list, proceed with testing show
      if (cars.data.length > 0) {
        // Choose a few cars to test (up to 3)
        const carsToTest = cars.data.slice(0, 3);

        for (const car of carsToTest) {
          const req = {} as Request;
          req.params = { id: car.id } as Record<string, string>;
          const showCar = await CarsController.show(req as Request);
          console.log("showCar:", showCar);
        }
      } else {
        console.log("No cars to test");
      }
    });
  });
});
