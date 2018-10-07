package com.jhopesoft.platform.logic;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.workflow.VActRuTask;
import com.jhopesoft.framework.utils.OperateUtils;
import com.jhopesoft.platform.logic.define.AbstractBaseLogic;

@Module
public class VActRuTaskLogic extends AbstractBaseLogic<VActRuTask> {

	@Override
	/**
	 * 在当前用户可执行的工作流审核的视图上加上当前用户的条件
	 * 
	 * FIND_IN_SET在 oracle中必须建立一个自定义函数
	 * 
	 */
	public void beforeGenerateSelect(SqlGenerate generate) {
		// act_task.act_Proc_Inst_State ='1' and (act_task.ASSIGNEE_ = 'user12' OR
		// (act_task.ASSIGNEE_ IS NULL AND FIND_IN_SET('user12',
		// act_task.candidate)))
		BaseModule module = generate.getBaseModule();
		if (Local.getDao().isMysql() || Local.getDao().isOracle()) {
			String where = module.getAsName() + ".act_Proc_Inst_State = '1' and " + "(" + module.getAsName()
					+ ".act_Assignee = " + OperateUtils.translateValue(Local.getUserid()) + " OR (" + module.getAsName()
					+ ".act_Assignee IS NULL AND FIND_IN_SET( " + OperateUtils.translateValue(Local.getUserid()) + " , "
					+ module.getAsName() + ".act_Candidate) > 0 )" + ")";
			generate.getWheres().add(where);
		} else if (Local.getDao().isSqlserver()) {
			String where = module.getAsName() + ".act_Proc_Inst_State = '1' and " + "(" + module.getAsName()
					+ ".act_Assignee = " + OperateUtils.translateValue(Local.getUserid()) + " OR (" + module.getAsName()
					+ ".act_Assignee IS NULL AND CHARINDEX(',' + " + OperateUtils.translateValue(Local.getUserid())
					+ "+',' , ','+ " + module.getAsName() + ".act_Candidate + ',') > 0 )" + ")";
			generate.getWheres().add(where);
		}
	}

}
