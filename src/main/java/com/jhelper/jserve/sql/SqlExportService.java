package com.jhelper.jserve.sql;

import java.io.File;
import java.io.IOException;

public interface SqlExportService {
    public File export(QueryDto queryDto) throws IOException;
}
