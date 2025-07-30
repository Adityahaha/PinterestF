const multer = require("multer");
const {v4 : uuidv4}=require("uuid");   // version -> v4
const path =require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')  // destination where to upload file
  },
  filename: function (req, file, cb) {
    const uniquename = uuidv4()  // giving unqiue name to file when it is uploaded
    cb(null, uniquename+path.extname(file.originalname))  // yaha downloaded file me extension ata hai
  }
})

const upload = multer({ storage: storage })

module.exports=upload;