package com.jhelper.jserve.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

public class Doc2TextConverter {

    public static String xlsxToText(File file) throws IOException {
        StringBuilder buffer = new StringBuilder();
        try (FileInputStream fis = new FileInputStream(file); Workbook workbook = new XSSFWorkbook(fis);) {

            workbook.sheetIterator().forEachRemaining(sheet -> {

                buffer.append(sheet.getSheetName());

                // 모든 행을 순차적으로 읽어 텍스트 출력
                for (Row row : sheet) {
                    for (Cell cell : row) {
                        // 셀의 데이터 타입에 따라 텍스트를 출력
                        switch (cell.getCellType()) {
                        case STRING:
                            buffer.append(cell.getStringCellValue() + "\t");
                            break;
                        case NUMERIC:
                            buffer.append(cell.getNumericCellValue() + "\t");
                            break;
                        case BOOLEAN:
                            buffer.append(cell.getBooleanCellValue() + "\t");
                            break;
                        default:
                            buffer.append("\t");
                            break;
                        }
                    }
                    buffer.append("\n");
                }

                buffer.append("\n");
            });

            workbook.close(); // 리소스 해제
        }

        return buffer.toString();
    }

    public static String docxToText(File file) throws IOException {
        StringBuilder buffer = new StringBuilder();
        try (XWPFDocument document = new XWPFDocument(new FileInputStream(file))) {
            List<XWPFParagraph> paragraphs = document.getParagraphs();
            for (org.apache.poi.xwpf.usermodel.XWPFParagraph paragraph : paragraphs) {
                buffer.append(paragraph.getText());
                buffer.append("\n");
            }
        }

        return buffer.toString();
    }

    public static String pptxToText(File file) throws IOException {
        StringBuilder buffer = new StringBuilder();
        try (XMLSlideShow ppt = new XMLSlideShow(new FileInputStream(file))) {
            for (XSLFSlide slide : ppt.getSlides()) {
                for (XSLFShape sh : slide.getShapes()) {
                    if (sh instanceof XSLFTextShape) {
                        XSLFTextShape shape = (XSLFTextShape) sh;
                        buffer.append(shape.getText());
                        buffer.append("\n");
                    }
                }
                buffer.append("\n");
            }
        }

        return buffer.toString();
    }

    public static String pdfToText(File file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file);) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            return text;
        }
    }
}
