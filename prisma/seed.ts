import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // clear old data
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // create Users
    const user = await prisma.user.createMany({
        data:[
            {name: "Alice", email:"alice@gmail.com"},
            {name: "Ayu", email:"ayu@gmail.com"},
            {name: "Andini", email:"andini@gmail.com"},
        ]
    });

    // create Products
    const products = await prisma.product.createMany({
        data:[
            {name: "Keyboard", price: 350_000, stock:10},
            {name: "Mouse", price: 30_000, stock:15},
            {name: "Monitor", price: 700_000, stock:20},
            {name: "Laptop", price: 8_050_000, stock:5},
        ]
    });

    // create Orders
    await prisma.order.createMany({
        data:[
            {userId:1, productId:1, quantity:2},
            {userId:1, productId:2, quantity:1},
            {userId:2, productId:3, quantity:1},
            {userId:3, productId:4, quantity:4},
        ]
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