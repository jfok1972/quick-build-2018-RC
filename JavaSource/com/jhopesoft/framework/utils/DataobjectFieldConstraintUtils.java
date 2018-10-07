package com.jhopesoft.framework.utils;

import java.util.HashMap;
import java.util.Map;
import ognl.Ognl;
import ognl.OgnlException;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfieldconstraint;
import com.jhopesoft.framework.exception.DataUpdateException;


/**
 * 模块字段平衡关系的服务，用来判断新增或修改的的数据是否满足平衡关系
 * 
 * @author jiangfeng
 *
 */
public class DataobjectFieldConstraintUtils {

  /**
   * 检查模块的新增或修改的记录有无平衡关系
   * 
   * @param module 模块的定义bean
   * @param record 要新增或修改的记录bean
   * @param errorMessage 出错信息写入此处
   * @return true 无错误 false 有错误
   */
  public static void moduleFieldConstraintValid(FDataobject module, Object record) {
    if (module.getFDataobjectfieldconstraints().size() > 0) {
      Map<String, Object> errorMessage = new HashMap<String, Object>();
      int c = 0;
      for (FDataobjectfieldconstraint fc : module.getFDataobjectfieldconstraints()) {
        if (!fc.getIsdisable()) {
          try {
            if (((Boolean) Ognl.getValue(fc.getCexpression(), record)) == false) {
              c++;
              String k = fc.getErrormessagefield();
              if (errorMessage.containsKey(k))
                errorMessage.put(k, errorMessage.get(k).toString() + "<br/>" + fc.getErrormessage());
              else
                errorMessage.put(k, fc.getErrormessage());
            }
          } catch (OgnlException e) {
            // 表达式公式写错了
            c++;
            errorMessage.put("字段平衡表达式编译错误", fc.getTitle() + "<br/><br/>表达式为:<br/>" + fc.getCexpression());
          }
        }
      }
      if (c != 0) throw new DataUpdateException(errorMessage);
    }
  }

}
