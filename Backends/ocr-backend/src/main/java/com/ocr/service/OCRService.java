package com.ocr.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class OCRService {

    public String extractTextFromImage(MultipartFile file) {
        try {
            File convFile = File.createTempFile("uploaded", file.getOriginalFilename());
            file.transferTo(convFile);

            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath("tessdata"); // Make sure tessdata exists
            tesseract.setLanguage("eng");

            return tesseract.doOCR(convFile);

        } catch (IOException | TesseractException e) {
            e.printStackTrace();
            return "Error occurred: " + e.getMessage();
        }
    }
}
