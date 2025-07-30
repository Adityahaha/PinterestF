// migrate-post-images.js
const mongoose = require('mongoose');
const postModel = require('./routes/post'); // adjust path as needed

async function migrate() {
  await mongoose.connect('mongodb://127.0.0.1:27017/pin');
  const postsWithOld = await postModel.find({ image: { $exists: true } });
  for (let p of postsWithOld) {
    p.postimage = p.image;
    p.image = undefined;
    await p.save();
  }
  console.log(`Migrated ${postsWithOld.length} posts.`);
  mongoose.disconnect();
}

migrate().catch(console.error);