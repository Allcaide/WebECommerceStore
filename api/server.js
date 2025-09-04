const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); //configuring dotenv to use the config.env file

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  //handling unhandled promise rejections
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1); //exiting the application
});

const app = require("./app");

//console.log(app);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
); //replacing the <PASSWORD> in the DATABASE string with the actual password from the environment variable

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    dbName: "milfios",
  })
  .then(() => console.log("DB connection successful"));

const port = process.env.PORT || 3001;
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server is reunning on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  //handling unhandled promise rejections
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");

  server.close(() => {
    process.exit(1); //
  });
});
