import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Hapus data lama (opsional, sesuaikan jika ingin mempertahankan data)
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Buat Kategori (simpan ID hasil create)
  const categoryTech = await prisma.category.create({ data: { name: "Technology" } });
  const categoryLife = await prisma.category.create({ data: { name: "Lifestyle" } });
  const categoryEdu = await prisma.category.create({ data: { name: "Education" } });

  // Buat Pengguna (simpan ID hasil create)
  const alice = await prisma.user.create({
    data: { username: "alice", email: "alice@example.com", password: "password1" },
  });
  const bob = await prisma.user.create({
    data: { username: "bob", email: "bob@example.com", password: "password2" },
  });
  const charlie = await prisma.user.create({
    data: { username: "charlie", email: "charlie@example.com", password: "password3" },
  });

  // Buat Postingan (simpan ID hasil create)
  const post1 = await prisma.post.create({
    data: {
      title: "First post about tech",
      content: "This is a post about technology trends.",
      categoryId: categoryTech.id,
      authorId: alice.id,
    },
  });
  const post2 = await prisma.post.create({
    data: {
      title: "Healthy living tips",
      content: "Some tips on healthy lifestyle.",
      categoryId: categoryLife.id,
      authorId: bob.id,
    },
  });
  const post3 = await prisma.post.create({
    data: {
      title: "Learning resources for beginners",
      content: "Best platforms to start learning programming.",
      categoryId: categoryEdu.id,
      authorId: charlie.id,
    },
  });

  // Buat Komentar
  await prisma.comment.createMany({
    data: [
      {
        postId: post1.id,
        authorId: bob.id,
        content: "Great post on technology!",
      },
      {
        postId: post2.id,
        authorId: alice.id,
        content: "Thanks for the healthy tips!",
      },
      {
        postId: post3.id,
        authorId: charlie.id,
        content: "Very helpful for beginners!",
      },
      {
        postId: post1.id,
        authorId: charlie.id,
        content: "I agree, tech is evolving fast!",
      },
    ],
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
