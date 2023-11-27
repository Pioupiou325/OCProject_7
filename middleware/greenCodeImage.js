const sharp = require("sharp");
const fs = require("fs");

function downSizing(req, res, next) {
  // Obtenir les métadonnées de l'image
  sharp(req.file.path).metadata((err, metadata) => {
    // si erreur lors de la récupération des métadonnées
    if (err) {
      return res
        .status(500)
        .send("Erreur de récupération des métadonnées : " + err.message);
    }
    // sinon on continue
    // on redimensionne l'image de 50%
    sharp(req.file.path)
      .resize(
        Math.round(metadata.width * 0.5),
        Math.round(metadata.height * 0.5)
      )
      // on se sert de toBuffer au lieu de toFile car on enregistre le fichier au même endroit
      .toBuffer((err, downSizedBuffer) => {
        // si erreur lors du resize de l'image
        if (err) {
          return res
            .status(500)
            .send("Erreur de redimensionnement : " + err.message);
        }

        // On écrit le fichier redimensionné dans le chemin d' origine
        fs.writeFile(req.file.path, downSizedBuffer, (writeErr) => {
          //   si  erreur lors de l'écriture du fichier
          if (writeErr) {
            return res
              .status(500)
              .send("Erreur d'écriture de fichier : " + writeErr.message);
            }
            next();
        });
      });
  });
}

module.exports = downSizing;
