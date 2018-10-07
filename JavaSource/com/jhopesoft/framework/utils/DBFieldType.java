package com.jhopesoft.framework.utils;

public class DBFieldType {

  public static String valueOf(String format) {
    String type = format;
    switch (format.toLowerCase()) {
      case "char":
      case "varchar":
      case "nchar":
      case "nvarchar":
      case "nvarchar2":
      case "varchar2":
      case "long":
      case "clob":
      case "raw":
      case "rowid":
      case "urowid":
      case "ntext":
      case "text":
      case "uniqueidentifier":
      case "xml":
        type = "String";
        break;
      case "tinyint":
      case "smallint":
      case "bit":
        type = "Boolean";
        break;
      case "datetime":
      case "timestamp":
      case "smalldatetime":
      case "timestamp(6)":
        type = "Timestamp";
        break;
      case "date":
        type = "Date";
        break;
      case "int":
      case "integer":
      case "bigint":
        type = "Integer";
        break;
      case "blob":
      case "nclob":
      case "longblob":
      case "varbinary":
      case "binary":
      case "image":
        type = "Image";
        break;
      case "float":
      case "binary_float":
      case "real":
        type = "Float";
        break;
      case "decimal":
      case "money":
      case "smallmoney":
      case "binary_double":
      case "double":
      case "number":
      case "numeric":
        type = "Double";
        break;
    }
    return type;
  }

  public static boolean isNumber(String type) {
    String fieldtype = type.toLowerCase();
    return (fieldtype.equals("double") || fieldtype.equals("integer") || fieldtype.equals("bigdecimal")
        || fieldtype.equals("float"));
  }

  public static boolean isDate(String type) {
    String fieldtype = type.toLowerCase();
    return (fieldtype.equals("date") || fieldtype.equals("timestamp") || fieldtype.equals("datetime"));

  }
}
