import express from 'express';
import multer from 'multer';
import {
    uploadController, validateController,
} from '../controllers/validation'

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        callback(null, `upload_${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/submit', upload.single('file'), uploadController);
router.post('/validate', upload.single('file'), validateController);

export default router;
