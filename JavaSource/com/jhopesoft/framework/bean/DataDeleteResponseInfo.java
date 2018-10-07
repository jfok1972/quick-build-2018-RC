package com.jhopesoft.framework.bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
/**
 * 
 * @author jiangfeng
 *
 */
public class DataDeleteResponseInfo implements Serializable {

  private static final long serialVersionUID = 5921848922737249324L;
  private Integer resultCode;
  private List<String> okMessageList;
  private List<String> errorMessageList;

  public DataDeleteResponseInfo() {
    super();
    resultCode = 0;
    okMessageList = new ArrayList<String>();
    errorMessageList = new ArrayList<String>();
  }

  public void setResultMessage(Integer resultCode, String message) {
    this.resultCode = resultCode;
    this.errorMessageList.add(message);
  }

  public String getMessage() {
    String result = "";
    for (String s : errorMessageList) {
      result = result + s + "<br/>";
    }
    return result;
  }

  public Integer getResultCode() {
    return resultCode;
  }

  public void setResultCode(Integer resultCode) {
    this.resultCode = resultCode;
  }

  public List<String> getErrorMessageList() {
    return errorMessageList;
  }

  public void setErrorMessageList(List<String> errorMessageList) {
    this.errorMessageList = errorMessageList;
  }

  public List<String> getOkMessageList() {
    return okMessageList;
  }

  public void setOkMessageList(List<String> okMessageList) {
    this.okMessageList = okMessageList;
  }


}
