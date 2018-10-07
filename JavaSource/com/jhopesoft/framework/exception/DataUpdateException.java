package com.jhopesoft.framework.exception;

import java.util.HashMap;
import java.util.Map;

public class DataUpdateException extends RuntimeException {

  private static final long serialVersionUID = 1L;
  private Map<String, Object> errorMessage;

  public DataUpdateException(Map<String, Object> errorMessage) {
    super();
    this.errorMessage = errorMessage;
  }

  public DataUpdateException(String fieldname , String errorMEssage) {
    super();
    errorMessage = new HashMap<String, Object>();
    errorMessage.put(fieldname, errorMEssage);
  }
  
  public DataUpdateException(String msg) {
    super(msg);
  }

  public DataUpdateException(Throwable cause) {
    super(cause);
  }

  public DataUpdateException(String msg, Throwable obj) {
    super(msg, obj);
  }

  public Map<String, Object> getErrorMessage() {
    return errorMessage;
  }

  public void setErrorMessage(Map<String, Object> errorMessage) {
    this.errorMessage = errorMessage;
  }



}
