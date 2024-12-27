import httpClient from "../../common/httpClient";
import Jsql from "./jsql";

export const jsqlInstance = new Jsql({
  url: "/api/sql",
});

export const fetchSql = async (query: string, params: any) => {
  try {
    let res: any = await httpClient.post("/api/sql", { query, ...params });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const runSql = async (
  query: string,
  { name, fetchSize }: { name: string; fetchSize: number },
) => {
  query = query.trim();
  if (query.endsWith(";")) {
    query = query.substring(0, query.lastIndexOf(";"));
  }

  console.log("runSql %s", query);

  try {
    return await fetchSql(query, { name: name, fetchSize: fetchSize });
  } catch (e: any) {
    console.error(e);

    let sqlState = "";
    let errorMessage = "";

    const response = e.response;

    if (response) {
      const data = response.data;

      if (data && data.sqlState) {
        sqlState = data.sqlState;
        errorMessage = data.errorMessage;
      } else {
        sqlState = "-1";
        errorMessage = e.toString();
      }
    } else {
      sqlState = "-1";
      errorMessage = e.toString();
    }

    throw {
      sqlState,
      errorMessage,
    };
  }
};
