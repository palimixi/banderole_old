// Déclaration des constantes

const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(cors()); // Pour autoriser les requêtes cross-origin

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});

// Routes
// app.get("/generate-banner", (req, res) => {
// Extrait les paramètres de la requête
//   const { text, textColor, bgColor, font } = req.query;

// Générez le GIF
//   const gifBuffer = createBannerGif(text, textColor, bgColor, font);

// Retourne le GIF comme réponse
//   res.setHeader("Content-Type", "image/gif");
//   res.send(gifBuffer);
// });

app.get("/generate-banner", (req, res) => {
  // Extrait les paramètres de la requête avec des valeurs par défaut
  const text = req.query.text || "This is your banner";
  const textColor = req.query.textColor || "FFFFFF"; // blanc
  const bgColor = req.query.bgColor || "000000"; // noir
  const font = req.query.font || "Arial"; // Mettez la police par défaut que vous souhaitez ici

  // Générez le GIF
  const gifBuffer = createBannerGif(text, textColor, bgColor, font);

  // Retourne le GIF comme réponse
  res.setHeader("Content-Type", "image/gif");
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
  ctx.font = `24px ${font}`;
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
