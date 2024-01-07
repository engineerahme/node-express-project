const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const Customer = require("./models/customerSchema");
var moment = require("moment");
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

//======= auto refresh =========
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

//========= المسارات للصفحات ==========
// Get Request ======================

app.get("/", (req, res) => {
  Customer.find()
    .then((result) => {
      res.render("index", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user/add.ejs", (req, res) => {
  res.render("user/add");
});

app.get("/edit/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user/:id", (req, res) => {
  console.log(req.params.id);
  Customer.findById(req.params.id)
    .then((result) => {
      console.log(result);
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Post Request ============================

app.post("/user/add.ejs", (req, res) => {
  console.log(req.body);
  Customer.create(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/search", (req, res) => {
  console.log(req.body.searchText);
  Customer.find({firstName: req.body.searchText})
    .then((result) => {
      res.render("user/search" , {arr:result});
    })
    .catch((err) => {
      console.log(err);
    });
});




// put Request

app.put("/edit/:id", (req, res) => {
  Customer.updateOne({ _id: req.params.id }, req.body)

    .then((params) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// delete Request

app.delete("/delete/:id", (req, res) => {
  Customer.deleteOne({ _id: req.params.id })

    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});





 






mongoose
  .connect(
    "mongodb+srv://saraemadmokhtar:QiEXzT1tE2ywF4oN@cluster0.lpbancy.mongodb.net/all-data?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
