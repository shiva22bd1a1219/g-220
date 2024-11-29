const express = require("express");
const mongoDB = require("./db");
const apiRouter = require("./Routes/api");
const cors = require("cors")
const app = express();
const port = 5000;

// Connect to mongoDB
mongoDB();

// Middleware
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
app.use(cors({
  origin: "http://localhost:3000", // Allow only this origin to access the API
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));
app.use(express.json());

// Add Routes
app.use("/api", apiRouter);

// Checking if Server is listening at port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
