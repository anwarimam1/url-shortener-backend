const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ CONNECT MONGODB
mongoose.connect("mongodb+srv://admin:admin123@cluster0.lphb9i5.mongodb.net/urlshortener")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ✅ Schema
const Url = mongoose.model("Url", {
  originalUrl: String,
  shortCode: String,
});

// ✅ Generate code
const generateCode = () =>
  Math.random().toString(36).substring(2, 7);

// ✅ Shorten API
app.post("/shorten", async (req, res) => {
  const { url } = req.body;

  const code = generateCode();

  await Url.create({
    originalUrl: url,
    shortCode: code,
  });

  res.json({
    shortUrl: `https://url-shortener-api-dvi0.onrender.com/${code}`,
  });
});

// ✅ Redirect
app.get("/:code", async (req, res) => {
  const data = await Url.findOne({ shortCode: req.params.code });

  if (data) {
    let url = data.originalUrl;

    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    return res.redirect(url);
  }

  res.status(404).send("Not found");
});

// ✅ Start server
app.listen(process.env.PORT || 5000, () =>
  console.log("Server running")
);