package com.jhelper.export;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.openxml4j.exceptions.OpenXML4JException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler.SheetContentsHandler;
import org.apache.poi.xssf.model.SharedStrings;
import org.apache.poi.xssf.model.StylesTable;
import org.apache.poi.xssf.usermodel.XSSFComment;
import org.springframework.stereotype.Component;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;

@Component
public class ExcelReader {

    SheetHandler sheetHandler;

    public void parse(File file) throws IOException, OpenXML4JException, SAXException {

        OPCPackage pkg = OPCPackage.open(file);
        XSSFReader r = new XSSFReader(pkg);

        StylesTable styles = r.getStylesTable();
        SharedStrings sst = r.getSharedStringsTable();

        sheetHandler = new SheetHandler();

        XMLReader parser = XMLReaderFactory.createXMLReader();
        parser.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        parser.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        parser.setFeature("http://xml.org/sax/features/external-general-entities", false);
        parser.setFeature("http://xml.org/sax/features/external-parameter-entities", false);

        parser.setContentHandler(new XSSFSheetXMLHandler(styles, sst, sheetHandler, false));

        try (InputStream is = r.getSheetsData().next();) {
            InputSource sheetSource = new InputSource(is);

            parser.parse(sheetSource);
        }

    }

    public List<Object[]> getData() {
        return sheetHandler.getData();
    }

    private class SheetHandler implements SheetContentsHandler {

        ArrayList<Object[]> rows = new ArrayList<>();
        ArrayList<Object> cells;

        @Override
        public void startRow(int rowNum) {
            cells = new ArrayList<>();
        }

        @Override
        public void endRow(int rowNum) {
            rows.add(cells.toArray());
            cells = null;
        }

        @Override
        public void cell(String cellReference, String formattedValue, XSSFComment comment) {
            CellReference cellRef = new CellReference(cellReference);

            int cellIndex = cellRef.getCol();

            while (cellIndex > cells.size()) {
                cells.add("");
            }

            cells.add(formattedValue);
        }

        public List<Object[]> getData() {
            return rows;
        }
    }
}
