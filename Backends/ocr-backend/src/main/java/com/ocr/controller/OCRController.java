package com.ocr.controller;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/ocr")
@CrossOrigin(origins = "*") // Allows frontend to call backend
public class OcrController {

    @PostMapping("/extract")
    public ResponseEntity<String> extractText(@RequestParam("image") MultipartFile image) {
        try {
            File convFile = File.createTempFile("ocr", image.getOriginalFilename());
            image.transferTo(convFile);

            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath("tessdata"); // Make sure this path exists

            String result = tesseract.doOCR(convFile);
            return ResponseEntity.ok(result);
        } catch (TesseractException e) {
            return ResponseEntity.badRequest().body("OCR Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Server Error: " + e.getMessage());
        }
    }
}
