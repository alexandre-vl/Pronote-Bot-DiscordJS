const MongoClient = require("mongodb").MongoClient;

async function insert_obj(database, collection, object) {
  const db = await MongoClient.connect(process.env.MONGODB);
  var dbo = db.db(database);
  const result = await dbo.collection(collection).insertOne(object);

  db.close();
  return result;
}

async function delete_obj(database, collection, object) {
  const db = await MongoClient.connect(process.env.MONGODB);
  var dbo = db.db(database);
  const result = await dbo.collection(collection).deleteOne(object);

  db.close();
  return result;
}

async function delete_objs(database, collection, object) {
  const db = await MongoClient.connect(process.env.MONGODB);
  var dbo = db.db(database);
  const result = await dbo.collection(collection).deleteMany(object);

  db.close();
  return result;
}

async function update_obj(database, collection, object, new_data) {
  const db = await MongoClient.connect(process.env.MONGODB);
  var dbo = db.db(database);
  const result = await dbo.collection(collection).updateOne(object, new_data);

  db.close();
  return result;
}

async function replace_one(database, collection, object, new_data) {
  const db = await MongoClient.connect(process.env.MONGODB);
  var dbo = db.db(database);
  const result = await dbo.collection(collection).replaceOne(object, new_data);

  db.close();
  return result;
}

async function select_one(database, collection, object) {
  const db = await MongoClient.connect(process.env.MONGODB);
  var dbo = db.db(database);
  const result = await dbo.collection(collection).findOne(object);

  db.close();
  return result;
}

async function select_all(database, collection, object) {
  const db = await MongoClient.connect(process.env.MONGODB);
  var dbo = db.db(database);
  const result = await dbo.collection(collection).find(object).toArray();

  db.close();
  return result;
}

module.exports = {
  insert_obj,
  delete_obj,
  delete_objs,
  update_obj,
  replace_one,
  select_one,
  select_all,
};
