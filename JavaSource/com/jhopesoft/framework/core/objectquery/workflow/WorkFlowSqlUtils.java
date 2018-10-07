package com.jhopesoft.framework.core.objectquery.workflow;

import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.utils.OperateUtils;

public class WorkFlowSqlUtils {

	public static final String MSSQLLEFTOUTERJOIN = "        LEFT OUTER JOIN\n"
			+ "    v_act_hi_procinst act_procinst ON act_procinst.BUSINESS_KEY_ = this_.:jxy_objectkeyfield \n"
			+ "        AND act_procinst.objectname = :jxy_objectname \n" + "        LEFT OUTER JOIN\n"
			+ "    v_act_ru_task_1 act_task ON act_task.PROC_INST_ID_ = act_procinst.PROC_INST_ID_\n"
			+ "        AND (act_task.ASSIGNEE_ = :jxy_userid\n"
			+ "        OR (act_task.ASSIGNEE_ is null AND CHARINDEX( ',' + :jxy_userid + ',', ',' + act_task.candidate + ',') > 0))";

	public static final String MYSQLLEFTOUTERJOIN = "        LEFT OUTER JOIN\n"
			+ "    v_act_hi_procinst act_procinst ON act_procinst.BUSINESS_KEY_ = this_.:jxy_objectkeyfield \n"
			+ "        AND act_procinst.objectname = :jxy_objectname \n" + "        LEFT OUTER JOIN\n"
			+ "    v_act_ru_task_1 act_task ON act_task.PROC_INST_ID_ = act_procinst.PROC_INST_ID_\n"
			+ "        AND (act_task.ASSIGNEE_ = :jxy_userid\n"
			+ "        OR (act_task.ASSIGNEE_ is null AND FIND_IN_SET( :jxy_userid , act_task.candidate) > 0))\n";

	public static final String ORACLELEFTOUTERJOIN = "        LEFT OUTER JOIN\n"
			+ "    v_act_hi_procinst act_procinst ON act_procinst.BUSINESS_KEY_ = this_.:jxy_objectkeyfield \n"
			+ "        AND act_procinst.objectname = :jxy_objectname \n" + "        LEFT OUTER JOIN\n"
			+ "    v_act_ru_task_1 act_task ON act_task.PROC_INST_ID_ = act_procinst.PROC_INST_ID_\n"
			+ "        AND (act_task.ASSIGNEE_ = :jxy_userid\n"
			+ "        OR (act_task.ASSIGNEE_ is null AND FIND_IN_SET( :jxy_userid , act_task.candidate) > 0))\n";

	/**
	 * 将工作流的关联表信息加入到sql语句中，字段已经加到FDataobjectfield中了
	 * 
	 * @param baseModule
	 * @return
	 */
	public static String getLeftOuterJoin(BaseModule baseModule) {

		String leftouter;
		if (Local.getDao().getDBType().toLowerCase().equals("mysql"))
			leftouter = MYSQLLEFTOUTERJOIN;
		else if (Local.getDao().getDBType().toLowerCase().equals("oracle"))
			leftouter = ORACLELEFTOUTERJOIN;
		else
			leftouter = MSSQLLEFTOUTERJOIN; // sqlserver

		leftouter = leftouter.replaceAll("this_", baseModule.getAsName());
		leftouter = leftouter.replaceAll(":jxy_objectkeyfield",
				baseModule.getModule()._getPrimaryKeyField()._getSelectName(null));
		leftouter = leftouter.replaceAll(":jxy_objectname",
				OperateUtils.translateValue(baseModule.getModule().getObjectname()));
		leftouter = leftouter.replaceAll(":jxy_userid", OperateUtils.translateValue(Local.getUserid()));
		return leftouter;
	}

}
