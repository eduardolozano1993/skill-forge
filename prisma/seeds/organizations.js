const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function loadMockCourses() {
  const filePath = path.join(__dirname, "..", "..", "lib", "mock-courses.ts");
  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/export const mockCourses: MockCourse\[] = (\[[\s\S]*?\n\]);/);

  if (!match) {
    throw new Error("Could not load mockCourses from lib/mock-courses.ts");
  }

  return vm.runInNewContext(match[1]);
}

async function main() {
  const manager = await prisma.user.findUnique({
    where: { email: "manager@skillforge.com" },
  });

  if (!manager) {
    throw new Error("Manager user not found. Run the users seed first.");
  }

  const organization = await prisma.organization.upsert({
    where: { id: 1 },
    update: {
      name: "Skill Forge HQ",
      employeeId: manager.id,
    },
    create: {
      name: "Skill Forge HQ",
      employeeId: manager.id,
    },
  });

  await prisma.user.update({
    where: { id: manager.id },
    data: {
      organizationId: organization.id,
    },
  });

  await prisma.user.updateMany({
    where: { userType: "EMPLOYEE" },
    data: {
      organizationId: organization.id,
    },
  });

  const mockCourses = loadMockCourses();

  for (const mockCourse of mockCourses) {
    let course = await prisma.course.findFirst({
      where: { name: mockCourse.title },
    });

    if (course) {
      course = await prisma.course.update({
        where: { id: course.id },
        data: {
          summary: mockCourse.summary,
          content: mockCourse.overview,
        },
      });
    } else {
      course = await prisma.course.create({
        data: {
          name: mockCourse.title,
          summary: mockCourse.summary,
          content: mockCourse.overview,
        },
      });
    }

    if (mockCourse.isAssigned) {
      await prisma.organizationCourse.upsert({
        where: {
          organizationId_courseId: {
            organizationId: organization.id,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          organizationId: organization.id,
          courseId: course.id,
        },
      });
    }
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
