const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Blog = require("./model/blog");
const {configDotenv}  = require("dotenv")


const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
configDotenv();
const port = process.env.PORT;

console.log(port, process.env.mongodb);

mongoose.connect(process.env.mongodb).then(e => { console.log("mongoDB Connected") });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public'))); 

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(port, () => {
    console.log(`server started on ${port}`);
});