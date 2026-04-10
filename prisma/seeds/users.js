const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

const users = [
  {
    name: "Admin User",
    displayName: "Admin",
    email: "admin@skillforge.com",
    password: "admin",
    phone: "+52-555-000-0001",
    userType: "ADMIN",
  },
  {
    name: "Manager User",
    displayName: "Manager",
    email: "manager@skillforge.com",
    password: "manager",
    phone: "+52-555-000-0002",
    userType: "MANAGER",
  },
  {
    name: "Employee User",
    displayName: "Employee",
    email: "employee@skillforge.com",
    password: "employee",
    phone: "+52-555-000-0003",
    userType: "EMPLOYEE",
  },
  {
    name: "Employee User Two",
    displayName: "Employee Two",
    email: "employee2@skillforge.com",
    password: "employee2",
    phone: "+52-555-000-0004",
    userType: "EMPLOYEE",
  },
  {
    name: "Employee User Three",
    displayName: "Employee Three",
    email: "employee3@skillforge.com",
    password: "employee3",
    phone: "+52-555-000-0005",
    userType: "EMPLOYEE",
  },
];

async function main() {
  for (const user of users) {
    const hashedPassword = await hash(user.password, 12);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        displayName: user.displayName,
        password: hashedPassword,
        phone: user.phone,
        userType: user.userType,
      },
      create: {
        ...user,
        password: hashedPassword,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
