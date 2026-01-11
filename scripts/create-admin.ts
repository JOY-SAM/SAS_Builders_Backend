import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function main() {
  try {
    console.log('--- Create Admin User ---');
    
    const name = await question('Full Name: ');
    const email = await question('Email: ');
    const phoneNumber = await question('Phone Number: ');
    const password = await question('Password: ');

    if (!email || !password || !phoneNumber) {
      console.error('Error: Email, Password, and Phone Number are required.');
      process.exit(1);
    }

    console.log(`\nCreating admin user for ${email}...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        isAdmin: true,
        isDriver: false,
      },
    });

    console.log(`\nAdmin user created successfully!`);
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    
  } catch (error) {
    console.error('\nError creating user:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
