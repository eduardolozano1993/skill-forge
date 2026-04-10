const { PrismaClient } = require("@prisma/client");
const courseCatalog = require("./course-catalog");

const prisma = new PrismaClient();

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

  for (const courseSeed of courseCatalog) {
    let course = await prisma.course.findFirst({
      where: { name: courseSeed.title },
    });

    if (course) {
      course = await prisma.course.update({
        where: { id: course.id },
        data: {
          summary: courseSeed.summary,
          content: courseSeed.content,
        },
      });
    } else {
      course = await prisma.course.create({
        data: {
          name: courseSeed.title,
          summary: courseSeed.summary,
          content: courseSeed.content,
        },
      });
    }

    if (courseSeed.assignedToOrganization) {
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
