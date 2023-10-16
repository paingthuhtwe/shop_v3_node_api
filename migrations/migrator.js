require("dotenv").config();
const fs = require("fs").promises;
const express = require("express");
const mongoose = require("mongoose");
const Helper = require("../utils/helper");
const UserDB = require("../models/user");
const RoleDB = require("../models/role");
const PermitDB = require("../models/permit");

const app = express();
const port = 4444;

async function backupUsers() {
  try {
    console.log("\n\x1b[32m----- Backup Process Started -----\x1b[0m\n\n");
    await fs.mkdir(__dirname + "/backup", { recursive: true });

    const backupUsers = await UserDB.find();
    await fs.writeFile(
      __dirname + "/backup/users.json",
      JSON.stringify(backupUsers)
    );

    console.log("\x1b[32m1. User Backup Completed.\x1b[0m\n");
    console.log(
      "\n\x1b[32m----- Backup Process Completed Successfully -----\x1b[0m\n"
    );
  } catch (error) {
    console.error("\n\x1b[31mError while creating the backup:\x1b[0m\n", error);
  }
}

async function migrate() {
  try {
    await mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await backupUsers();

    console.log("\n\x1b[32m----- Migration Process Started -----\x1b[0m\n\n");

    const [userData, roleData, permitData] = await Promise.all([
      fs.readFile(__dirname + "/users.json", "utf8"),
      fs.readFile(__dirname + "/roles.json", "utf8"),
      fs.readFile(__dirname + "/permits.json", "utf8"),
    ]);

    const users = JSON.parse(userData);
    const roles = JSON.parse(roleData);
    const permits = JSON.parse(permitData);

    await Promise.all([
      UserDB.deleteMany({}),
      RoleDB.deleteMany({}),
      PermitDB.deleteMany({}),
    ]);

    // Migrate Users
    await Promise.all(
      users.map(async (user) => {
        user.password = Helper.encode(user.password);
        await UserDB.create(user);
      })
    );

    console.log("\x1b[32m1. User Migration Completed.\x1b[0m\n");

    // Migrate Roles
    await RoleDB.insertMany(roles);
    console.log("\x1b[32m2. Role Migration Completed.\x1b[0m\n");

    // Migrate Permits
    await PermitDB.insertMany(permits);
    console.log("\x1b[32m3. Permit Migration Completed.\x1b[0m\n");

    const role = await RoleDB.findOne({name: 'Owner'});
    await UserDB.findOneAndUpdate({name: 'Owner'}, { role: role._id });

    const dbPermits = await PermitDB.find();
    const defaultPermits = dbPermits.map((permit) => permit._id);
    await RoleDB.updateMany({_id: role._id}, { $set: { permits: defaultPermits } });

    console.log(
      "\n\x1b[32m----- Migration Process Completed Successfully -----\x1b[0m\n"
    );
  } catch (error) {
    console.error("\n\x1b[31mError During Migration:\x1b[0m\n", error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

app.listen(port, () => {
  migrate();
});
