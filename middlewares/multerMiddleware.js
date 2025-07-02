import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) { // here file is a new parameter introduced that contains the file data and cb is call back function
    cb(null, "./public/temp") // destination to keep the uploaded file
  },
  filename: function (req, file, cb) {
    // unique file name generation lets consider date only
    const uniqueSuffix = Date.now(); 
    
    // this call back will store the file with following name
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
// now we shall export the functionality
export const upload = multer({ storage: storage })