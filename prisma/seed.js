const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

const MANAGER_COUNT = 100;
const COMPANY_COUNT = 100;
const EMPLOYEE_COUNT = 100000;
const COURSE_COUNT = 1000;
const BATCH_SIZE = 1000;
const ADMIN_EMAIL = "admin@skillforge.com";
const ADMIN_PASSWORD = "admin";
const DEFAULT_PASSWORD = "Password123!";

faker.seed(20260414);

function chunk(array, size) {
  const chunks = [];

  for (let index = 0; index < array.length; index += size) {
    chunks.push(array.slice(index, index + size));
  }

  return chunks;
}

function buildPhoneNumber() {
  return faker.helpers.fromRegExp("\\+52-55-[0-9]{4}-[0-9]{4}");
}

async function resetDatabase() {
  await prisma.organizationCourse.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.completedCourse.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
}

async function createAdmin(hashedPassword) {
  return prisma.user.create({
    data: {
      name: "Skill Forge Admin",
      displayName: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      phone: buildPhoneNumber(),
      userType: "ADMIN",
      status: "ACTIVE",
    },
  });
}

async function createManagers(hashedPassword) {
  const managers = Array.from({ length: MANAGER_COUNT }, (_, index) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    return {
      name: fullName,
      displayName: firstName,
      email: `manager${index + 1}@seed.skillforge.local`,
      password: hashedPassword,
      phone: buildPhoneNumber(),
      userType: "MANAGER",
      status: "ACTIVE",
    };
  });

  await prisma.user.createMany({
    data: managers,
  });

  return prisma.user.findMany({
    where: {
      userType: "MANAGER",
      email: {
        endsWith: "@seed.skillforge.local",
      },
    },
    orderBy: {
      email: "asc",
    },
  });
}

async function createOrganizations(managers) {
  const organizations = Array.from({ length: COMPANY_COUNT }, (_, index) => ({
    name: `${faker.company.name()} ${faker.company.buzzNoun()}`,
    employeeId: managers[index].id,
    status: "ACTIVE",
  }));

  await prisma.organization.createMany({
    data: organizations,
  });

  const createdOrganizations = await prisma.organization.findMany({
    orderBy: {
      id: "asc",
    },
  });

  await Promise.all(
    createdOrganizations.map((organization) =>
      prisma.user.update({
        where: {
          id: organization.employeeId,
        },
        data: {
          organizationId: organization.id,
        },
      }),
    ),
  );

  return createdOrganizations;
}

async function createEmployees(organizations, hashedPassword) {
  let createdEmployees = 0;

  while (createdEmployees < EMPLOYEE_COUNT) {
    const currentBatchSize = Math.min(
      BATCH_SIZE,
      EMPLOYEE_COUNT - createdEmployees,
    );

    const employees = Array.from(
      { length: currentBatchSize },
      (_, batchIndex) => {
        const employeeNumber = createdEmployees + batchIndex + 1;
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const organization = faker.helpers.arrayElement(organizations);

        return {
          organizationId: organization.id,
          name: `${firstName} ${lastName}`,
          displayName: firstName,
          email: `employee${employeeNumber}@seed.skillforge.local`,
          password: hashedPassword,
          phone: buildPhoneNumber(),
          userType: "EMPLOYEE",
          status: "ACTIVE",
        };
      },
    );

    await prisma.user.createMany({
      data: employees,
    });

    createdEmployees += currentBatchSize;
    console.log(`Created ${createdEmployees}/${EMPLOYEE_COUNT} employees`);
  }
}

async function createCourses() {
  const courses = Array.from({ length: COURSE_COUNT }, (_, index) => ({
    name: `Course ${index + 1}: ${faker.company.buzzPhrase()}`,
    summary: faker.lorem.paragraph(),
    content: faker.lorem.paragraph(10),
    status: "ACTIVE",
  }));

  for (const batch of chunk(courses, BATCH_SIZE)) {
    await prisma.course.createMany({
      data: batch,
    });
  }
}

async function main() {
  console.log("Resetting database...");
  await resetDatabase();

  const hashedAdminPassword = await hash(ADMIN_PASSWORD, 12);
  const hashedPassword = await hash(DEFAULT_PASSWORD, 12);

  console.log("Creating admin...");
  await createAdmin(hashedAdminPassword);

  console.log("Creating managers...");
  const managers = await createManagers(hashedPassword);

  console.log("Creating organizations...");
  const organizations = await createOrganizations(managers);

  console.log("Creating employees...");
  await createEmployees(organizations, hashedPassword);

  console.log("Creating courses...");
  await createCourses();

  console.log("Seed complete");
  console.log(
    JSON.stringify(
      {
        admins: 1,
        managers: MANAGER_COUNT,
        organizations: COMPANY_COUNT,
        employees: EMPLOYEE_COUNT,
        courses: COURSE_COUNT,
        adminEmail: ADMIN_EMAIL,
        adminPassword: ADMIN_PASSWORD,
        defaultPassword: DEFAULT_PASSWORD,
      },
      null,
      2,
    ),
  );
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
