package com.jhelper.jserve;

import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import com.jhelper.text.TextTokenizer;

public class TextTokenizerTests {

    public static void main(String[] args) throws Exception {
        Path file = Paths.get(
                "C:\\\\work\\\\vs-workspace\\\\jhelper-react\\\\src\\\\main\\\\java\\\\com\\\\jhelper\\\\jserve\\\\board\\\\service\\\\ElalsticBoardSerivce.java");
        String content = Files.readString(file, Charset.forName("UTF-8"));

        Map<String, String> tokenFilter = new HashMap<>();
        tokenFilter.put("/*", "*/");
        tokenFilter.put("//", "\n");
        tokenFilter.put("\"", "\"");
        TextTokenizer tt = new TextTokenizer(content, tokenFilter);

        while (tt.hasNext()) {
            System.out.println("token: " + tt.next());
        }

    }
}
