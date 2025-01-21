package com.jhelper.jserve.common;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;

import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.docx4j.Docx4J;
import org.docx4j.convert.out.HTMLSettings;
import org.docx4j.openpackaging.exceptions.Docx4JException;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;

public class Doc2HtmlConverter {

    public static void docxToHtml(File file, File ouptut) throws IOException {

        try (OutputStream os = Files.newOutputStream(ouptut.toPath());) {
            WordprocessingMLPackage wordMLPackage = Docx4J.load(file);
            HTMLSettings htmlSettings = Docx4J.createHTMLSettings();
            htmlSettings.setOpcPackage(wordMLPackage);
            Docx4J.toHTML(htmlSettings, os, Docx4J.FLAG_NONE);
        } catch (Docx4JException e) {
            throw new IOException(e);
        }
    }

    public static void pptxToHtml(File file, File ouptut) throws IOException {

        try (BufferedWriter bw = Files.newBufferedWriter(ouptut.toPath());
                XMLSlideShow ppt = new XMLSlideShow(
                        new FileInputStream(file))) {
            for (XSLFSlide slide : ppt.getSlides()) {
                bw.write("<div class='slide'>");
                for (XSLFShape sh : slide.getShapes()) {
                    if (sh instanceof XSLFTextShape) {
                        XSLFTextShape shape = (XSLFTextShape) sh;
                        bw.write(String.format("<p class='text-shape'>%s</p>", shape.getText()));
                    }
                }
                bw.write("</div>");
            }
        }
    }

}
