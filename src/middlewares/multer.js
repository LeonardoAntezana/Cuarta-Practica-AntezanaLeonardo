import multer from "multer";
import __dirname from "../utils.js";

const pathsAccordingWithFilenames = {
  profile: `${__dirname}/public/img/profiles`,
  product: `${__dirname}/public/img/products`,
  document: `${__dirname}/public/img/documents`,
}

const destination = (_req, file, cb) => {
  if (file.originalname.includes('document')) cb(null, pathsAccordingWithFilenames.document);
  else if (file.originalname.includes('profile')) cb(null, pathsAccordingWithFilenames.profile);
  else if (file.originalname.includes('product')) cb(null, pathsAccordingWithFilenames.product);
  else cb(null, pathsAccordingWithFilenames.document);
};

const filename = (_req, file, cb) => cb(null, file.originalname)

// const fileFilter = (_req, file, cb) => {
//   if (!file.originalname.includes('document') || !file.originalname.includes('profile') || !file.originalname.includes('product')){
//     cb(null, false);
//   };
//   cb(null, true);
// }

const storage = multer.diskStorage({ destination, filename })

export const uploader = multer({ storage })