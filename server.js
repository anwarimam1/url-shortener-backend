const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = {};

const generateCode = () =>
  Math.random().toString(36).substring(2, 7);

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

app.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  // reuse existing
  for (let key in db) {
    if (db[key] === url) {
      return res.json({
        shortUrl: `http://localhost:5000/${key}`,
      });
    }
  }

  const code = generateCode();
  db[code] = url;

  res.json({
    shortUrl: `http://localhost:5000/${code}`,
  });
});

app.get("/:code", (req, res) => {
  let url = db[req.params.code];

  if (url) {
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }
    return res.redirect(url);
  }

  res.status(404).send("Not found");
});

app.listen(5000, () => console.log("Server running on 5000"));