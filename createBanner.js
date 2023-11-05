// Déclaration des constantes

const path = require("path");
const express = require("express");
const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, "public")));

// For local only
// app.listen(3001, () => {
//  console.log("Server running on http://localhost:3001");
// });

app.use(
  cors({
    origin: "*", // ou remplacez "*" par votre domaine frontend si vous voulez le restreindre
    methods: "GET",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/generate-banner", async (req, res) => {
  // Valeurs par défaut

  const text = req.query.text || "This is your banner";
  const textColor = req.query.textColor || "FFFFFF";
  const bgColor = req.query.bgColor || "000000";
  const font = req.query.font || "Arial";
  const fontSize = req.query.fontSize || "18";

  // Génère le GIF
  const gifBuffer = createBannerGif(text, textColor, bgColor, font, fontSize);

  // Retourne le GIF comme réponse
  // res.set("Content-Type", "image/gif");
  res.send(gifBuffer);
});

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
});

process.on("uncaughtException", function (err) {
  console.error("Caught exception:", err);
});

const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");

const createBannerGif = (text, textColor, bgColor, font, fontSize) => {
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

  const fs = require("fs");
  fs.writeFileSync("test.gif", encoder.out.getData());

  if (!gifBuffer || gifBuffer.length === 0) {
    console.log("GIF Buffer is empty");
  }

  console.log("GIF Buffer:", gifBuffer);

  return gifBuffer;
};

console.log("Script executed");
