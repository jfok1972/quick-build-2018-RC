package com.jhopesoft.framework.core.objectquery.filter;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.jhopesoft.framework.dao.entity.attachment.FDataobjectattachment;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.utils.DataObjectUtils;

public class UserParentFilter extends UserNavigateFilter {

  private static final long serialVersionUID = -4604317461593860035L;

  /**
   * 根据字符串返回grid导航的数据，生成一个数组
   * 
   * @param str
   * @return
   */
  public static List<UserParentFilter> changeToParentFilters(String parentFilter, String moduleName) {
    if (parentFilter != null && parentFilter.length() > 1) {
      UserParentFilter pFilter = null;
      if (parentFilter != null && parentFilter.length() > 1) {
        pFilter = JSON.parseObject(parentFilter, UserParentFilter.class);
      }
      List<UserParentFilter> userParentFilters = null;
      if (pFilter != null) {
        userParentFilters = new ArrayList<UserParentFilter>();
        if (moduleName.equals(FDataobjectattachment.class.getSimpleName())) {
          
          UserParentFilter moduleFilter = new UserParentFilter();
          moduleFilter.setFieldName("FDataobject");
          FDataobject attachment = DataObjectUtils.getDataObject(FDataobjectattachment.class.getSimpleName());
          moduleFilter.setModuleField(attachment._getModuleFieldByFieldName(moduleFilter.getFieldName()));
          FDataobject module = DataObjectUtils.getDataObject(pFilter.getModuleName());
          moduleFilter.setOperator("=");
          moduleFilter.setFieldvalue(module.getObjectid());
          userParentFilters.add(moduleFilter);

          UserParentFilter keyFilter = new UserParentFilter();
          keyFilter.setFieldName("idvalue");
          keyFilter.setModuleField(attachment._getModuleFieldByFieldName("idvalue"));
          keyFilter.setOperator("=");
          keyFilter.setFieldvalue(pFilter.getFieldvalue());
          userParentFilters.add(keyFilter);
        } else {
          userParentFilters.add(pFilter);
          pFilter.setModuleField(pFilter.getFilterModule()._getModuleFieldByFieldName(pFilter.getFieldName()));
          pFilter.setManyToOneFieldToAheadPath();
        }
      }
      return userParentFilters;
    } else
      return null;
  }

}
