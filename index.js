require("dotenv").config({ path: "./keys.env" });

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const fs = require("fs");

const axios = require("axios");

const FormData = require("form-data");

const cors = require("cors");

const path = require("path");

const methodOverride = require("method-override");

const mongoose = require("mongoose");
const Admin = require("./models/admin.js");
const Event = require("./models/event.js");
const Log = require("./models/adminLog.js");
const LeaderBoard = require("./models/leaderBoard.js");

main()
  .then((res) => console.log("Connected to DB."))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.mongoURI);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public/uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(methodOverride("_method"));

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, "public/uploads");
    } else {
      cb(new Error("Invalid File type!"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get("/admin", (req, res) => {
  res.render("admin.ejs");
});

app.post("/admin/manage", (req, res) => {
  let { adminName: name, password: pass } = req.body;
  Admin.findOne({ adminName: name, password: pass })
    .then((result) => {
      if (result === null) {
        res.render("invalidPass.ejs");
      } else {
        Event.find().then((data) =>
          res.render("eventsCRUD.ejs", { name, events: data })
        );
      }
    })
    .catch((err) => res.render("contactAdmin.ejs"));
});

app.get("/admin/edit/:adminame/:id", (req, res) => {
  let { adminame: name, id } = req.params;
  Admin.findOne({ adminName: name })
    .then((result) => {
      if (result === null) res.render("unauthorizedAccess.ejs");
      Event.findById(id).then((data) =>
        res.render("editEvent.ejs", { name, id, event: data })
      );
    })
    .catch((err) => res.render("contactAdmin.ejs"));
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.patch(
  "/admin/edit/:adminame/:id",
  upload.fields([
    { name: "imgPath", maxCount: 1 },
    { name: "absImgPath", maxCount: 1 },
  ]),
  (req, res) => {
    let { adminame: name, id } = req.params;
    let {
      eventname,
      venue,
      date,
      time,
      registrationDeadline,
      eventDetails,
      password,
      googleFormLink,
    } = req.body;
    Admin.findOne({ adminName: name, password: password })
      .then(async (result) => {
        if (result === null) res.render("unauthorizedAccess.ejs");
        const NAME = result.Name;
        if (req.files.imgPath && req.files.absImgPath) {
          let { imgPath, absImgPath } = req.files;
          const image1 = fs.readFileSync(imgPath[0].path);
          await axios
            .post(
              "https://api.imgur.com/3/image",
              { image: image1.toString("base64") },
              {
                headers: {
                  Authorization: `Client-ID ${process.env.Client_ID}`,
                },
              }
            )
            .then(async (json1) => {
              if (!json1.data.success) res.render("contactAdmin.ejs");
              fs.unlinkSync(imgPath[0].path);
              const image2 = fs.readFileSync(absImgPath[0].path);
              await axios
                .post(
                  "https://api.imgur.com/3/image",
                  { image: image2.toString("base64") },
                  {
                    headers: {
                      Authorization: `Client-ID ${process.env.Client_ID}`,
                    },
                  }
                )
                .then((json2) => {
                  if (!json2.data.success) res.render("contactAdmin.ejs");
                  fs.unlinkSync(absImgPath[0].path);
                  Event.findByIdAndUpdate(
                    id,
                    {
                      eventname: eventname,
                      venue: venue,
                      date: date,
                      time: time,
                      registrationDeadline: registrationDeadline,
                      eventDetails: eventDetails,
                      googleFormLink: googleFormLink,
                      imgPath: json1.data.data.link,
                      imgPathDeleteHash: json1.data.data.deletehash,
                      absImgPath: json2.data.data.link,
                      absImgPathDeleteHash: json2.data.data.deletehash,
                    },
                    { runValidators: true }
                  ).then(async (data) => {
                    await axios
                      .delete(
                        "https://api.imgur.com/3/image/" +
                          data.imgPathDeleteHash,
                        {
                          headers: {
                            Authorization: `Client-ID ${process.env.Client_ID}`,
                          },
                        }
                      )
                      .then(async (delResponse1) => {
                        await axios
                          .delete(
                            "https://api.imgur.com/3/image/" +
                              data.absImgPathDeleteHash,
                            {
                              headers: {
                                Authorization: `Client-ID ${process.env.Client_ID}`,
                              },
                            }
                          )
                          .then((delResponse2) => {
                            const log = new Log({
                              adminName: NAME,
                              operation: "EDIT",
                              eventname: data.eventname,
                              when: new Date(),
                            });
                            log.save();
                            res.render("editSuccess.ejs", { name });
                          });
                      });
                  });
                });
            });
        } else if (req.files.imgPath) {
          let { imgPath } = req.files;
          const image = fs.readFileSync(imgPath[0].path);
          await axios
            .post(
              "https://api.imgur.com/3/image",
              { image: image.toString("base64") },
              {
                headers: {
                  Authorization: `Client-ID ${process.env.Client_ID}`,
                },
              }
            )
            .then(async (json1) => {
              if (!json1.data.success) res.render("contactAdmin.ejs");
              fs.unlinkSync(imgPath[0].path);
              Event.findByIdAndUpdate(
                id,
                {
                  eventname: eventname,
                  venue: venue,
                  date: date,
                  time: time,
                  registrationDeadline: registrationDeadline,
                  eventDetails: eventDetails,
                  googleFormLink: googleFormLink,
                  imgPath: json1.data.data.link,
                  imgPathDeleteHash: json1.data.data.deletehash,
                },
                { runValidators: true }
              ).then(async (data) => {
                await axios
                  .delete(
                    "https://api.imgur.com/3/image/" + data.imgPathDeleteHash,
                    {
                      headers: {
                        Authorization: `Client-ID ${process.env.Client_ID}`,
                      },
                    }
                  )
                  .then(async (delResponse1) => {
                    const log = new Log({
                      adminName: NAME,
                      operation: "EDIT",
                      eventname: eventname,
                      when: new Date(),
                    });
                    log.save();
                    res.render("editSuccess.ejs", { name });
                  });
              });
            });
        } else if (req.files.absImgPath) {
          let { absImgPath } = req.files;
          const image = fs.readFileSync(absImgPath[0].path);
          await axios
            .post(
              "https://api.imgur.com/3/image",
              { image: image.toString("base64") },
              {
                headers: {
                  Authorization: `Client-ID ${process.env.Client_ID}`,
                },
              }
            )
            .then(async (json1) => {
              if (!json1.data.success) res.render("contactAdmin.ejs");
              fs.unlinkSync(absImgPath[0].path);
              Event.findByIdAndUpdate(
                id,
                {
                  eventname: eventname,
                  venue: venue,
                  date: date,
                  time: time,
                  registrationDeadline: registrationDeadline,
                  eventDetails: eventDetails,
                  googleFormLink: googleFormLink,
                  absImgPath: json1.data.data.link,
                  absImgPathDeleteHash: json1.data.data.deletehash,
                },
                { runValidators: true }
              ).then(async (data) => {
                console.log(data);
                await axios
                  .delete(
                    "https://api.imgur.com/3/image/" +
                      data.absImgPathDeleteHash,
                    {
                      headers: {
                        Authorization: `Client-ID ${process.env.Client_ID}`,
                      },
                    }
                  )
                  .then(async (delResponse1) => {
                    console.log(delResponse1);
                    const log = new Log({
                      adminName: NAME,
                      operation: "EDIT",
                      eventname: eventname,
                      when: new Date(),
                    });
                    log.save();
                    res.render("editSuccess.ejs", { name });
                  });
              });
            });
        } else {
          Event.findByIdAndUpdate(
            id,
            {
              eventname: eventname,
              venue: venue,
              date: date,
              time: time,
              registrationDeadline: registrationDeadline,
              eventDetails: eventDetails,
              googleFormLink: googleFormLink,
            },
            { runValidators: true }
          ).then((result) => {
            const log = new Log({
              adminName: NAME,
              operation: "EDIT",
              eventname: eventname,
              when: new Date(),
            });
            log.save();
            res.render("editSuccess.ejs", { name });
          });
        }
      })
      .catch((err) => res.render("contactAdmin.ejs"));
  }
);

app.get("/admin/delete/:adminame/:id", (req, res) => {
  let { adminame: name, id } = req.params;
  Admin.findOne({ adminName: name })
    .then((result) => {
      if (result === null) res.render("unauthorizedAccess.ejs");
      res.render("deleteEvent.ejs", { name, id });
    })
    .catch((err) => res.render("contactAdmin.ejs"));
});

app.delete("/admin/delete/:adminame/:id", (req, res) => {
  let { adminame: name, id } = req.params;
  let { password: pass } = req.body;
  console.log(req.body);
  Admin.findOne({ adminName: name, password: pass })
    .then((result) => {
      if (result === null) res.render("unauthorizedAccess.ejs");
      const NAME = result.Name;
      Event.findByIdAndDelete(id).then(async (data) => {
        console.log(data);
        await axios
          .delete("https://api.imgur.com/3/image/" + data.imgPathDeleteHash, {
            headers: {
              Authorization: `Client-ID ${process.env.Client_ID}`,
            },
          })
          .then(async (delResponse1) => {
            console.log(delResponse1);
            await axios
              .delete(
                "https://api.imgur.com/3/image/" + data.absImgPathDeleteHash,
                {
                  headers: {
                    Authorization: `Client-ID ${process.env.Client_ID}`,
                  },
                }
              )
              .then((delResponse2) => {
                console.log(delResponse2);
                console.log(data.imgPath);
                console.log(data.absImgPath);
                const log = new Log({
                  adminName: NAME,
                  operation: "DELETE",
                  eventname: data.eventname,
                  when: new Date(),
                });
                log.save();
                res.render("deleteSuccess.ejs", { name });
              });
          });
      });
    })
    .catch((err) => res.render("contactAdmin.ejs"));
});

app.get("/admin/create/:adminame", (req, res) => {
  let { adminame: name } = req.params;
  Admin.findOne({ adminName: name })
    .then((result) => {
      if (result === null) res.render("unauthorizedAccess.ejs");
      res.render("createEvent.ejs", { name });
    })
    .catch((err) => res.render("contactAdmin.ejs"));
});

app.post(
  "/admin/create/:adminame",
  upload.fields([
    { name: "imgPath", maxCount: 1 },
    { name: "absImgPath", maxCount: 1 },
  ]),
  (req, res) => {
    let { adminame: name } = req.params;
    let {
      eventname,
      venue,
      date,
      time,
      registrationDeadline,
      eventDetails,
      password,
      googleFormLink,
    } = req.body;
    Admin.findOne({ adminName: name, password: password })
      .then(async (result) => {
        if (result === null) res.render("unauthorizedAccess.ejs");
        const NAME = result.Name;
        let { imgPath, absImgPath } = req.files;
        const image1 = fs.readFileSync(imgPath[0].path);
        await axios
          .post(
            "https://api.imgur.com/3/image",
            { image: image1.toString("base64") },
            {
              headers: {
                Authorization: `Client-ID ${process.env.Client_ID}`,
              },
            }
          )
          .then(async (json1) => {
            if (!json1.data.success) res.render("contactAdmin.ejs");
            fs.unlinkSync(imgPath[0].path);
            const image2 = fs.readFileSync(absImgPath[0].path);
            await axios
              .post(
                "https://api.imgur.com/3/image",
                { image: image2.toString("base64") },
                {
                  headers: {
                    Authorization: `Client-ID ${process.env.Client_ID}`,
                  },
                }
              )
              .then((json2) => {
                if (!json2.data.success) res.render("contactAdmin.ejs");
                fs.unlinkSync(absImgPath[0].path);
                const event = new Event({
                  eventname: eventname,
                  venue: venue,
                  date: date,
                  time: time,
                  registrationDeadline: registrationDeadline,
                  eventDetails: eventDetails,
                  imgPath: json1.data.data.link,
                  imgPathDeleteHash: json1.data.data.deletehash,
                  absImgPath: json2.data.data.link,
                  absImgPathDeleteHash: json2.data.data.deletehash,
                  googleFormLink: googleFormLink,
                });
                event.save().then((result) => {
                  const log = new Log({
                    adminName: NAME,
                    operation: "CREATE",
                    eventname: eventname,
                    when: new Date(),
                  });
                  log.save();
                  res.render("createSuccess.ejs", { name });
                });
              });
          });
      })
      .catch((err) => res.render("contactAdmin.ejs"));
  }
);

app.post("/admin/view/:adminame", (req, res) => {
  let { adminame: name } = req.params;
  Event.find()
    .then((data) => res.render("eventsCRUD.ejs", { name, events: data }))
    .catch((err) => res.render("contactAdmin.ejs"));
});

app.get("/leaderBoard/:name", (req, res) => {
  LeaderBoard.find({})
    .sort({ score: -1 })
    .then((data) =>
      res.render("leaderBoard.ejs", { name: req.params.name, board: data })
    )
    .catch((err) => res.render("contactAdmin.ejs"));
});

app.post("/updateScore/:name/:id", (req, res) => {
  let { id, name } = req.params;
  let { score: scr } = req.body;
  LeaderBoard.findByIdAndUpdate(
    id,
    { $set: { score: parseInt(scr) } },
    { runValidators: true, returnDocument: "after" }
  )
    .then((data1) => {
      LeaderBoard.find({}).sort({ score: -1 }).then((data) =>
        res.render("leaderBoard.ejs", { name, board: data })
      );
    })
    .catch((err) => res.render("contactAdmin.ejs"));
});

app.get("/admin/view/:adminame", (req, res) => {
  let { adminame: name } = req.params;
  Admin.find({ adminName: name })
    .then((data1) => {
      if (data1 == null) res.render("unauthorizedAccess.ejs");
      Event.find({}).then((data) => {
        res.render("eventsCRUD.ejs", { name, events: data });
    });
    })
    .catch((err) => res.render("contactAdmin.ejs"));
});

app.listen(port, () => {
  console.log(`Listening to request from ${port} port!`);
});
