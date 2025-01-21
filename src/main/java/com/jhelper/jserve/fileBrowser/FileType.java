package com.jhelper.jserve.fileBrowser;

public enum FileType {
    DIR, FILE;

    static boolean isDir(String type) {
        if (type == null || type.length() == 0) {
            return false;
        }

        return valueOf(type) == DIR;
    }

    static boolean isFile(String type) {
        if (type == null || type.length() == 0) {
            return false;
        }

        return valueOf(type) == FILE;
    }
}
