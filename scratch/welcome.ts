import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://elesquad:Ele%2FSq9%3FuA.d3Z%236%21yR@cluster0.ssmpl.mongodb.net/elesquad?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(MONGODB_URI);

async function sendWelcomeMessages() {
  try {
    await client.connect();
    const db = client.db('elesquad');
    const users = db.collection('users');
    const messages = db.collection('messages');

    const admin = await users.findOne({ email: 'thenaimrana@gmail.com' });
    if (!admin) {
      console.error('Admin not found');
      return;
    }

    const allUsers = await users.find({}).toArray();
    console.log(`Found ${allUsers.length} total users.`);

    const welcomeText = "Welcome to the EleSquad family! 🚀 We're thrilled to have you with us. This is your premium space to manage projects, collaborate with our elite squad, and track your digital growth. If you need any assistance, feel free to reach out. Let's build something extraordinary together!";

    let count = 0;
    for (const user of allUsers) {
      if (user._id.toString() === admin._id.toString()) continue;

      const room = [admin._id.toString(), user._id.toString()].sort().join('_');
      
      // Check if welcome message already sent (optional but good)
      const existing = await messages.findOne({ room, senderId: admin._id.toString(), text: welcomeText });
      
      if (!existing) {
        await messages.insertOne({
          room,
          senderId: admin._id.toString(),
          senderName: admin.name,
          text: welcomeText,
          timestamp: new Date(),
          isRead: false
        });
        count++;
      }
    }

    console.log(`Successfully sent welcome messages to ${count} new users.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

sendWelcomeMessages();
