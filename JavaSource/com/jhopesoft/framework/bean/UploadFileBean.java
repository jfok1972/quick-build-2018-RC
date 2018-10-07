package com.jhopesoft.framework.bean;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

/**
 * 上传用于 新增或者修改的 excel 表的bean
 * @author jiangfeng
 *
 */
public class UploadFileBean {
    
    private CommonsMultipartFile file;
    
    private String moduleId;
    
    private String id;

    public UploadFileBean() {

    }

    public CommonsMultipartFile getFile() {
        return file;
    }

    public void setFile(CommonsMultipartFile file) {
        this.file = file;
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

}
