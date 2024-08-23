import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        const professor = await prisma.professor.create({
            data: {
                name: 'Jane Doe',
                description: 'Doctor 7yawanet',
                Tag: 'send help',
                Rating: 0, 
            },
        });
        console.log("Professor created:", professor);
    } catch  {
        console.error("An error occurred while creating the professor:");
    } finally {
        await prisma.$disconnect(); 
    }
}

main();
