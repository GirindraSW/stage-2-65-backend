import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // clear old data (order matters because of relations)
    await prisma.stock.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.user.deleteMany();

    // create Users
    const alice = await prisma.user.create({
        data: { name: "Alice", email: "alice@gmail.com", points: 100 },
    });
    const ayu = await prisma.user.create({
        data: { name: "Ayu", email: "ayu@gmail.com", points: 50 },
    });
    const andini = await prisma.user.create({
        data: { name: "Andini", email: "andini@gmail.com", points: 30 },
    });

    // create Suppliers
    const supplierA = await prisma.supplier.create({ data: { name: "Supplier A" } });
    const supplierB = await prisma.supplier.create({ data: { name: "Supplier B" } });

    // create Products
    const keyboard = await prisma.product.create({
        data: { name: "Keyboard", price: 350_000 },
    });
    const mouse = await prisma.product.create({
        data: { name: "Mouse", price: 30_000 },
    });
    const monitor = await prisma.product.create({
        data: { name: "Monitor", price: 700_000 },
    });
    const laptop = await prisma.product.create({
        data: { name: "Laptop", price: 8_050_000 },
    });

    // create Stocks (product-supplier)
    await prisma.stock.createMany({
        data: [
            { productId: keyboard.id, supplierId: supplierA.id, quantity: 10 },
            { productId: mouse.id, supplierId: supplierA.id, quantity: 15 },
            { productId: monitor.id, supplierId: supplierB.id, quantity: 20 },
            { productId: laptop.id, supplierId: supplierB.id, quantity: 5 },
        ],
    });

    // create Orders
    await prisma.order.createMany({
        data: [
            { userId: alice.id, productId: keyboard.id, quantity: 2 },
            { userId: alice.id, productId: mouse.id, quantity: 1 },
            { userId: ayu.id, productId: monitor.id, quantity: 1 },
            { userId: andini.id, productId: laptop.id, quantity: 4 },
        ],
    });
}

main()
    .then(()=>{
        console.log("seeding completed");
    })
    .catch((e)=>{
        console.error(e);
    })
    .finally(async()=>{
        await prisma.$disconnect()
    })
