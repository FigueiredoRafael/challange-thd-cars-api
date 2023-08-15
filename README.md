# Challenge Cars API

Challenge Cars API is a test project created for a company.

## Installation

To install the necessary dependencies, use the package manager \`npm\`:

```bash
npm install
```
## Usage
Before you start using the application, make sure to set up your environment by filling in the `.env` file with the required values.

## Environment Variables
Create a `.env` file in the root directory of your project and fill it with the following variables:

```bash
# Specifies the environment for the application
NODE_ENV=development

# Port on which the application will listen
PORT=8082

# Database URL used by Prisma
DATABASE_URL="mongodb+srv://your-username:your-password@your-atlas-cluster-url/cars-challenge"
```

Replace the placeholders (`your-username`, `your-password`, `your-atlas-cluster-url`) in the `DATABASE_URL` with your actual MongoDB Atlas credentials. Ensure that you have a MongoDB Atlas server set up.

## Configuration
To modify the application's behavior, consider checking out morgan.js for logging customization.

## ROUTES

These are the important requested routes

  router.group("/cars", (router) => {
    router.get("/", CarsController.index);
    router.get("/:id", CarsController.show);
    router.post("/", CarsController.create);
  });

WITH GET
  ```bash
  http://baseApiURL/cars #will get all cars
  http://baseApiURL/:id #will get one car detail
  ```

WITH POST
```
http://baseApiURL/
```
To register the user here is an example of the expected data

```
        data: {
          make: payload.make,
          model: payload.model,
          package: payload.package,
          color: payload.color,
          category: payload.category,
          mileage: Number(payload.mileage),
          price: Number(payload.price),
          year: Number(payload.year),
        },
```

## Testing

To test the application, you can use the following command:

```bash
npm run test
