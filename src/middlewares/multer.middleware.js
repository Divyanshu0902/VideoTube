import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + raw.toString('hex'))    
  }
})

export const upload = multer({ 
    storage, 
})