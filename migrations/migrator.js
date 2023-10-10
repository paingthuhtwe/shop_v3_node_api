require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const Helper = require("../utils/helper");
const mongoose = require("mongoose");
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);
const UserDB = require("../models/user");
const RoleDB = require("../models/role");
const PermitDB = require("../models/permit");

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("\n\x1b[32m----- Migration Process Started -----\x1b[0m\n\n");
});

const migrate = async () => {
  try {
    const userData = await fs.promises.readFile(
      __dirname + "/users.json",
      "utf8"
    );
    const users = JSON.parse(userData);
    const roleData = await fs.promises.readFile(
      __dirname + "/roles.json",
      "utf8"
    );
    const roles = JSON.parse(roleData);
    const permitData = await fs.promises.readFile(
      __dirname + "/permits.json",
      "utf8"
    );
    const permits = JSON.parse(permitData);

    // Clear the collections
    await UserDB.deleteMany({});
    await RoleDB.deleteMany({});
    await PermitDB.deleteMany({});

    // Migrate Users
    for (const user of users) {
      user.password = Helper.encode(user.password);
      await new UserDB(user).save();
    }
    console.log("\x1b[32m1. User Migration Completed.\x1b[0m\n");

    // Migrate Roles
    await RoleDB.insertMany(roles);
    console.log("\x1b[32m2. Role Migration Completed.\x1b[0m\n");

    // Migrate Permits
    await PermitDB.insertMany(permits);
    console.log("\x1b[32m3. Permit Migration Completed.\x1b[0m\n");

    server.close(() => {
      console.log(
        "\n\x1b[32m----- Migration Process Completed Successfully -----\x1b[0m\n"
      );
      process.exit(0);
    });
  } catch (error) {
    console.log("\n\x1b[31m----- Error During Migration -----\x1b[0m\n");
    process.exit(1);
  }
};

migrate();
