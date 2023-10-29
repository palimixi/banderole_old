// Déclaration des constantes

const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");

// Configuration SDK AWS

const AWS = require("aws-sdk");

const AWSConfig = require("./config.json");
const s3 = new AWS.S3({
  accessKeyId: AWSConfig.AWS_ACCESS_KEY,
  secretAccessKey: AWSConfig.AWS_SECRET_KEY,
  region: AWSConfig.AWS_REGION,
});

// Middlewares
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*", // ou remplacez "*" par votre domaine frontend si vous voulez le restreindre
    methods: "GET",
  })
);

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});

app.get("/generate-banner", async (req, res) => {
  // Valeurs par défaut

  const text = req.query.text || "This is your banner";
  const textColor = req.query.textColor || "FFFFFF";
  const bgColor = req.query.bgColor || "000000";
  const font = req.query.font || "Arial";
  const fontSize = req.query.fontSize || "18";

  // Gébère le GIF
  const gifBuffer = createBannerGif(text, textColor, bgColor, font);

  const uploadParams = {
    Bucket: "banderolebucket",
    Key: `banners/${Date.now()}.gif`, // un nom de fichier unique
    Body: gifBuffer,
    ContentType: "image/gif",
  };

  // Retourne le GIF comme réponse
  try {
    const data = await s3.upload(uploadParams).promise();
    res.json({ imageUrl: data.Location }); // renvoie l'URL du GIF
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).send("Internal Server Error");
  }
});

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
});

process.on("uncaughtException", function (err) {
  console.error("Caught exception:", err);
});

const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");

const createBannerGif = (text, textColor, bgColor, font) => {
  const width = 400;
  const height = 50;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const encoder = new GIFEncoder(width, height);

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(100);

  // Définir la police AVANT de mesurer le texte
  ctx.font = `${fontSize}px ${font}`;
  const textWidth = ctx.measureText(text).width;
  const textHeight = 24; // puisque vous avez défini la taille de la police à 24px

  let x = width;

  while (x > -textWidth) {
    ctx.fillStyle = `#${bgColor}`; // Ajouter le "#" ici
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = `#${textColor}`; // Ajouter le "#" ici
    ctx.fillText(text, x, (height + textHeight) / 2 - 6); // Ajuster la position en y

    encoder.addFrame(ctx);
    x -= 10;
  }

  encoder.finish();
  const gifBuffer = encoder.out.getData();
  return gifBuffer;
};

console.log("Script executed");
