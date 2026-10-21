const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking orders in database...");
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      status: true,
      createdAt: true,
    },
  });

  console.log(`Found ${orders.length} total orders:`);
  console.table(orders);

  const pendingOrders = orders.filter((o) => o.status === "AWAITING_PAYMENT");
  console.log(`Found ${pendingOrders.length} pending orders to clear.`);

  if (pendingOrders.length > 0) {
    const deleted = await prisma.order.deleteMany({
      where: {
        status: "AWAITING_PAYMENT",
      },
    });
    console.log(`Successfully deleted ${deleted.count} pending orders!`);
  } else {
    console.log("No pending orders found.");
  }
}

main()
  .catch((e) => {
    console.error("Error clearing orders:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
