import { PrismaClient, KeywordType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profile.upsert({
    where: { name: "McDonald's" },
    update: {},
    create: {
      name: "McDonald's",
      keywords: {
        create: [
          { pattern: "McDonald's", type: KeywordType.include },
          { pattern: 'McDonalds', type: KeywordType.include },
          { pattern: 'McD', type: KeywordType.include }
        ]
      }
    }
  });

  const [sustainability, quality, workforce] = await Promise.all([
    prisma.driver.upsert({
      where: { name: 'Bærekraft' },
      update: {},
      create: {
        name: 'Bærekraft',
        keywords: {
          create: [{ value: 'bærekraft' }, { value: 'klima' }, { value: 'miljø' }]
        }
      }
    }),
    prisma.driver.upsert({
      where: { name: 'Matkvalitet' },
      update: {},
      create: {
        name: 'Matkvalitet',
        keywords: {
          create: [{ value: 'kvalitet' }, { value: 'smak' }, { value: 'meny' }]
        }
      }
    }),
    prisma.driver.upsert({
      where: { name: 'Kundeservice og arbeidsliv' },
      update: {},
      create: {
        name: 'Kundeservice og arbeidsliv',
        keywords: {
          create: [{ value: 'ansatt' }, { value: 'kunde' }, { value: 'service' }]
        }
      }
    })
  ]);

  await prisma.spokesperson.upsert({
    where: { name: 'Johanne Fjellestad' },
    update: {},
    create: {
      name: 'Johanne Fjellestad',
      aliases: {
        create: [{ value: 'Fjellestad' }, { value: 'J. Fjellestad' }]
      }
    }
  });

  await prisma.spokesperson.upsert({
    where: { name: 'Espen Nilsen' },
    update: {},
    create: {
      name: 'Espen Nilsen',
      aliases: {
        create: [{ value: 'E. Nilsen' }, { value: 'Nilsen' }]
      }
    }
  });

  console.log('Seed complete', { profile, sustainability, quality, workforce });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
