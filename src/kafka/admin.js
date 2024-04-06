import kafka from "../config/kafkaClient.js";

async function init() {
  const admin = kafka.admin();
  console.log("Admin connecting..");
  admin.connect();
  console.log("Admin is connected");

  console.log("Creating topic notifications");
  await admin.createTopics({
    topics: [
      {
        topic: "notifications",
        numPartitions: 2,
      },
    ],
  });
  console.log("Error while creating topics");
  console.log("Topic created Success notifications");
  console.log("Disconnecting admin...");
  await admin.disconnect();
}

init();
