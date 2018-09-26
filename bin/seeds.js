// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Item = require("../models/Item");
const Status = require("../models/Status");

const bcryptSalt = 10;

mongoose
  .connect(
    process.env.DB_URL,
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

let users = [
  {
    username: "Laura",
    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(bcryptSalt)),
    email: "handmedownapp@gmail.com",
    karma: 0,
    itemsOwned: ["patata"],
    itemsKept: ["coliflor"]
  },
  {
    username: "Raul",
    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(bcryptSalt)),
    email: "handmedownapp@gmail.com",
    karma: 100,
    itemsOwned: ["patata"],
    itemsKept: ["coliflor"]
  }
];

let items = [
  {
    name: "Favourite book",
    tag: "Please return it",
  },
  {
    name: "Croquetas",
    tag: "I hope you enjoy it",
  }
];

let statuses = [
  {
    currentLocation: "40.3925362,-3.7004556",
    indications: "At home from 3PM" //notes for pick up
  },
  {
    currentLocation: "40.3925362,-3.7004556",
    indications: "Keep them at room temperature" //notes for pick up
  }
];

User.deleteMany()
  .then(() => {
    return User.create(users);
  })
  .then(usersCreated => {
    console.log(`${usersCreated.length} users created with the following id:`);
    console.log(usersCreated.map(u => u._id));
    return usersCreated;
  })
  .then((usersCreated) => {
    Status.collection.drop();
    return usersCreated;
  })
  .then((usersC) => {
    statuses[0].giverID = usersC[0]._id;
    statuses[0].takerID = usersC[1]._id;
    statuses[0].currentHolderID = usersC[0]._id;
    statuses[1].giverID = usersC[1]._id;
    statuses[1].takerID = usersC[0]._id;
    statuses[1].currentHolderID = usersC[1]._id;
    console.log(statuses);
    return Status.create(statuses);
  })
  .then(statusesCreated => {
    console.log(
      `${statusesCreated.length} statuses created with the following id:`
    );
    console.log(statusesCreated.map(s => s._id));
    return statusesCreated;
  })
  .then((statusesCreated) => {
    Item.collection.drop();
    return statusesCreated;
  })
  .then((statusesC) => {
    items[0].statusID = statusesC[0]._id;
    items[1].statusID = statusesC[1]._id;
    return Item.create(items);
  })
  .then(itemsCreated => {
    console.log(`${itemsCreated.length} items created with the following id:`);
    console.log(itemsCreated.map(i => i._id));
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });
