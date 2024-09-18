const express = require("express")
const session = require("express-session")
const { checkLoggedIn, bypassLogin } = require("./middleware")

//Initialize express
const app = express()

//Configure ejs view engine
app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: "my_session_secret",
  resave: true,
  saveUninitialized: false,
  name: "Pat",
  cookie: {
    maxAge: 10000
  }
}))

app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

//Configure routes
app.get("/", checkLoggedIn, (req, res) => {
  res.render("home")
})

app.get("/login", bypassLogin, (req, res) => {
  res.render("login", { error: null })
})

app.post("/login", (req, res) => {
  if(req.body.username === "John" && req.body.password === "123") {
    //create session nad store user logged details
    req.session.user = { id: 1, username: "John", name: "John Doe"}

    res.redirect("/")
  }else {
    res.render("login", { error: "Wrong credentials"})
  }
})

app.get("/logout", (req, res) => {
  req.session.destroy()
  res.clearCookie("Pat")
  res.redirect("/")
})

app.listen(3000, () => console.log("Server started on port 3000"))