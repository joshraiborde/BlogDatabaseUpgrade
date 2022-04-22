//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const port = 3000;
const now = new Date();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// create a new database
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

// create a new schema called postSchema
const postSchema = {
  title: String,
  content: String
};

// create a new mongoose based on the postSchema
const Post = mongoose.model("Post", postSchema);

// Delete the existing posts array.
// let posts = [];

app.get("/", (req, res) => {
// Find all the posts in the posts collection and render that in the home.ejs file.
Post.find({}, (err, posts) => {
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});
});

app.get("/compose", (req, res) => {
  res.render("compose");
});


app.post("/compose", (req, res) => {
  // create a new post document using the mongoose model.
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  // save the document to the database instead of pushing to the posts array.
  // posts.push(post);
  post.save((err) => {
    if (!err){
        res.redirect("/");
    }
  });
});

// changed the express route parameter to postId instead postName
app.get("/posts/:postId", (req, res) => {
  // const requestedTitle = _.lowerCase(req.params.postName);

  // create a const to store the postId parameter value
  // const requestedPostId = _.lowerCase(req.params.postId);
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, (err, post) => {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

  // posts.forEach(function (post) {
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });
});

app.get("/about",  (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact",  (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.listen(port, () => {
  console.log("Server is running on Port " + port + " on " + now.toUTCString());
});
