package com.jhopesoft.framework.bean;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.jhopesoft.framework.dao.entity.attachment.FDataobjectattachment;
/**
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
public class FileUploadBean extends FDataobjectattachment {


  private CommonsMultipartFile file;

  private String objectid;
  

  public FileUploadBean() {

  }

  public CommonsMultipartFile getFile() {
    return file;
  }

  public void setFile(CommonsMultipartFile file) {
    this.file = file;
  }

  public String getObjectid() {
    return objectid;
  }

  public void setObjectid(String objectid) {
    this.objectid = objectid;
  }

}
