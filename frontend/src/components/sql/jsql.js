import axios from "axios";
import Mustache from "mustache";

export default function Jsql(options) {
  var _url = "/api/sql",
    _cacheUrl = "/api/cache";

  if (options.url) {
    _url = options.url;
  }

  this.query = function (query, params) {
    query = query.trim();

    if (query.endsWith(";")) {
      query = query.substr(0, query.length - 1);
    }

    //sql = window.encodeURIComponent(sql);

    return axios
      .post(_url, {
        ...params,
        query,
      })
      .then(function (res) {
        return res.data;
      })
      .catch(function (response) {
        alert("오류가 발생하였습니다.");
        return response;
      });
  };

  this.loadTemplate = function (vendor) {
    var that = this;

    return axios.get("vendor/" + vendor + ".xml").then(function (res) {
      var sqlNode = document.createElement("div");
      sqlNode.innerHTML = res.data;

      var tableQuery = sqlNode.querySelector("#table").innerHTML,
        columnQuery = sqlNode.querySelector("#columns").innerHTML,
        indexesQuery = sqlNode.querySelector("#indexes").innerHTML;

      that.tableTmpl = function () {
        return tableQuery;
      };
      that.columnsTmpl = function () {
        return columnQuery;
      };
      that.indexesTmpl = function () {
        return indexesQuery;
      };
    });
  };

  this.findTableInfo = function (data, params) {
    var tmpl = this.tableTmpl();
    var sql = Mustache.render(tmpl, data);

    return this.query(sql, params);
  };

  this.findColumnInfo = function (data, params) {
    var tmpl = this.columnsTmpl();
    var sql = Mustache.render(tmpl, data);

    return this.query(sql, params);
  };

  this.findIndexesInfo = function (data, params) {
    var tmpl = this.indexesTmpl();
    var sql = Mustache.render(tmpl, data);

    return this.query(sql, params);
  };

  this.tableTmpl = function () {
    return "";
  };

  this.columnsTmpl = function () {
    return "";
  };

  this.indexesTmpl = function () {
    return "";
  };

  this.selectQuery = function (data) {
    if (!data.owner || !data.tableName) {
      alert("owner, tableName을 입력해주세요.");
      return;
    }

    var that = this;

    return Promise.all([
      this.findColumnInfo(data),
      this.findIndexesInfo(data),
    ]).then(function (returnValue) {
      var columns = returnValue[0].result,
        indexes = returnValue[1].result;

      var coltext = columns
        .map(function (arr, idx) {
          return arr[1] + " /* " + arr[2] + " */";
        })
        .join("\n      ,");

      var idxtext = indexes
        .map(function (arr, idx) {
          return arr[0] + " = #{" + arr[0] + "}";
        })
        .join("\n   AND ");

      var tmplData = {
        columns: coltext,
        indexes: " WHERE " + idxtext,
        tableName: data.tableName,
      };

      return Mustache.render(that.selectQueryTmpl(), tmplData);
    });
  };

  this.insertQuery = function (data) {
    if (!data.owner || !data.tableName) {
      alert("owner, tableName을 입력해주세요.");
      return;
    }

    var that = this;

    return this.findColumnInfo(data).then(function (columns) {
      columns = columns.result;

      var coltext = columns
        .map(function (arr, idx) {
          return arr[1] + " /* " + arr[2] + " */";
        })
        .join("\n   ,");

      var values = columns
        .map(function (arr, idx) {
          return "#{" + arr[1] + "}";
        })
        .join("\n   ,");

      var tmplData = {
        columns: coltext,
        values: values,
        tableName: data.tableName,
      };

      return Mustache.render(that.insertQueryTmpl(), tmplData);
    });
  };

  this.updateQuery = function (data) {
    if (!data.owner || !data.tableName) {
      alert("owner, tableName을 입력해주세요.");
      return;
    }

    var that = this;

    return Promise.all([
      this.findColumnInfo(data),
      this.findIndexesInfo(data),
    ]).then(function (returnValue) {
      var columns = returnValue[0].result,
        indexes = returnValue[1].result;

      var coltext = columns
        .map(function (arr, idx) {
          return arr[1] + " = #{" + arr[1] + "}" + " /* " + arr[2] + " */";
        })
        .join("\n      ,");

      var idxtext = indexes
        .map(function (arr, idx) {
          return arr[0] + " = #{" + arr[0] + "}";
        })
        .join("\n   AND ");

      var tmplData = {
        columns: coltext,
        indexes: " WHERE " + idxtext,
        tableName: data.tableName,
      };

      return Mustache.render(that.updateQueryTmpl(), tmplData);
    });
  };

  this.deleteQuery = function (data) {
    if (!data.owner || !data.tableName) {
      alert("owner, tableName을 입력해주세요.");
      return;
    }

    var that = this;

    return this.findIndexesInfo(data).then(function (indexes) {
      indexes = indexes.result;

      var idxtext = indexes
        .map(function (arr, idx) {
          return arr[0] + " = #{" + arr[0] + "}";
        })
        .join("\n   AND ");

      var tmplData = {
        indexes: " WHERE " + idxtext,
        tableName: data.tableName,
      };

      return Mustache.render(that.deleteQueryTmpl(), tmplData);
    });
  };

  this.selectQueryTmpl = function () {
    var result = `
SELECT /* comment */
       {{&columns}}
  FROM {{tableName}}
{{&indexes}}
`;
    return result;
  };

  this.insertQueryTmpl = function () {
    var result = `
INSERT /* comment */
  INTO {{tableName}}
(
    {{&columns}}
)
VALUES 
(
    {{&values}}
)
`;
    return result;
  };

  this.updateQueryTmpl = function () {
    var result = `
/* comment */
UPDATE {{tableName}}
   SET {{&columns}}
{{&indexes}}
`;
    return result;
  };

  this.deleteQueryTmpl = function () {
    var result = `
DELETE /* comments */
  FROM {{tableName}}
{{&indexes}}
`;
    return result;
  };

  function toCamel(str) {
    str = str.toLowerCase();

    return str.replace(/_\w/g, function (m) {
      return m[1].toUpperCase();
    });
  }

  function toUnderscore(str) {
    return str.replace(/([A-Z])/g, function (m) {
      return "_" + m.toLowerCase();
    });
  }

  function setData(key, value) {
    return axios
      .post(_cacheUrl, {
        key: key,
        value: value,
      })
      .then(function (res) {
        return res.data;
      });
  }

  function getData(key) {
    return axios.get(_cacheUrl + "/" + key).then(function (res) {
      var data = res.data;
      return data && data.value != null ? res.data.value : null;
    });
  }

  this.toCamel = toCamel;
  this.toUnderscore = toUnderscore;
}
