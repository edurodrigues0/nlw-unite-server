import { prisma } from '../src/services/prisma'

async function seed() {
  await prisma.event.create({
    data: {
      id: '158a4fbe-fb41-4487-bfd1-d2a12a2765d4',
      title: 'gdg uberlandia',
      slug: 'gdg-uberlandia',
      details: 'Um evento p/ devs aparaixonados(as) por codings',
      maximumAttendees: 120,
    },
  })
}

seed().then(() => {
  console.log('Database seeded!')
})
