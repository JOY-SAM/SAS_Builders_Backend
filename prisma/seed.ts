import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create or update a test user. 
  // We use upsert to avoid errors if the user already exists.
  // We want to ensure a user exists that might have ID 1 on a fresh DB.
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123', // required field
      phoneNumber: '555-0123',   // required field
      isDriver: 0,               // required BigInt
      isAdmin: 0,                // required BigInt
    },
  });

  console.log('User created:', user);

  // Create a vehicle.
  // Since there is no unique constraint on vehicle number in the schema shown earlier (only ID is ID),
  // we cannot easily upsert without an ID. We will check if one exists or create it.
  const existingVehicle = await prisma.vehicle.findFirst();
  let vehicle;

  if (!existingVehicle) {
    vehicle = await prisma.vehicle.create({
      data: {
        name: 'Test Truck',
        number: 'TEST-01',
        category: 'Logistics',
        description: 'Primary delivery vehicle',
      },
    });
    console.log('Vehicle created:', vehicle);
  } else {
    vehicle = existingVehicle;
    console.log('Vehicle already exists:', vehicle);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
