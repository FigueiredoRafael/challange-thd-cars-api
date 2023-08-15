import { PrismaClient } from "@prisma/client";
import CarsController from "../src/controllers/CarsController";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Mocking Express request and response objects
const mockRequest = () => {
  const req = {} as Request;
  req.body = {
    make: "FORD",
    model: "f10",
    package: "Base",
    color: "Silver",
    category: "Truck",
    mileage: 231.23,
    price: 3999.23,
    year: 2010,
  };
  req.params = {} as Record<string, string>; // Set any necessary params here
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("CarsController", () => {
  let createdCarId: string | undefined; // Store the created car ID
  let carCreated = false;

  describe("index", () => {
    test("should return a list of cars", async () => {
      const req = mockRequest();
      const res = mockResponse();

      await CarsController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          msg: expect.any(String),
          data: expect.any(Array),
        })
      );
    });
  });

  describe("create", () => {
    test("should create a new car", async () => {
      const req = mockRequest();
      const res = mockResponse();

      // Mock the res.json() function to return the response object
      const response = {
        success: true,
        msg: "✔️ Car created successfully!",
        data: { id: "someId" /* other properties */ },
      };
      (res.json as jest.Mock).mockReturnValue(response);

      await CarsController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          msg: expect.any(String),
          data: expect.any(Object),
        })
      );
      const createdCarIdFromResponse = response.data.id;

      console.log("createdCarIdFromResponse: ", createdCarIdFromResponse); // Example usage
    });

  });

  describe("show", () => {
    test("should return details of a specific car", async () => {
      if (createdCarId) {
        const req = mockRequest();
        req.params.id = createdCarId; // Use the stored car ID
        const res = mockResponse();

        console.log("req: ", req)

        await CarsController.show(req, res);

        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            success: true,
            data: expect.any(Object),
          })
        );
      }
    });
  });
});
