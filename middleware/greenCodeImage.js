const sharp = require('sharp');

module.exports = (req, res, next) => {
   try {
       console.log(req.file.path)
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};