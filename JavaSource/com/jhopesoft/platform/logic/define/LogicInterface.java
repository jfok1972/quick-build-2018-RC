package com.jhopesoft.platform.logic.define;

import java.util.List;
import java.util.Map;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.DelegateTask;

import com.jhopesoft.framework.core.objectquery.filter.UserNavigateFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserParentFilter;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;

/**
 * 
 * @author jiangfeng
 *
 * @param <T>
 */
public interface LogicInterface<T> {

	/**
	 * 在查询语句的所有子句准备好以后，准备生成sql之前执行
	 * 
	 * @param generate
	 */

	public void beforeGenerateSelect(SqlGenerate generate);

	/**
	 * 在查询语句的所有子句准备好以后，准备生成count sql之前执行
	 * 
	 * @param generate
	 */
	public void beforeGenerateSelectCount(SqlGenerate generate);

	/**
	 * 记录插入之前的操作
	 * 
	 * @param inserted
	 *          要被插入的 hibernate bean
	 * @param errorMessage
	 *          如果不能插入，存放发生错误的字段和错误原因
	 * @param 不可以插入，抛出异常
	 *          DataUpdateException。
	 * 
	 */
	public void beforeInsert(T inserted);

	/**
	 * 
	 * 记录插入之前执行的操作，这时数据还没有写到数据库中
	 * 
	 * @param inserted
	 */
	public void afterInsert(T inserted);

	/**
	 * 记录修改之前的操作
	 * 
	 * @param type
	 *          修改的类型，有修改，或者审批，审核等
	 * @param updatedObject
	 *          记录修改后的bean
	 * @param oldObject
	 *          记录修改前的bean
	 * @param request
	 * @return 不可以修改，则抛出异常 DataUpdateException
	 * 
	 */
	public void beforeUpdate(String type, T updatedObject, T oldObject);

	/**
	 * 记录修改之后执行的操作
	 * 
	 * @param type
	 * @param updatedObject
	 * @param oldObject
	 */
	public void afterUpdate(String type, T updatedObject, T oldObject);

	/**
	 * 删除之前的操作，如果不能删除，则抛出异常 DataDeleteException 里面写上原因
	 * 
	 * @param deleted
	 * @return
	 * 
	 */
	public void beforeDelete(T deleted);

	/**
	 * 记录被删除之后执行的操作
	 * 
	 * @param deleted
	 */
	public void afterDelete(T deleted);

	/**
	 * 在新增之前取得记录的缺省值
	 * 
	 * @param userParentFilters
	 *          前台传过来的父模块筛选
	 * @param navigateFilters
	 *          前台传过来的导航值
	 * @return 缺省值字段名和字段值的集合
	 */
	public Map<String, Object> getNewDefultValue(List<UserParentFilter> userParentFilters,
			List<UserNavigateFilter> navigateFilters);

	/**
	 * 
	 * 工作流的接收任务时事件的处理
	 * 
	 * @param delegateTask
	 * @param moduleName
	 * @param recordId
	 * 
	 */
	public void workFlowNotify(DelegateTask delegateTask, String moduleName, String recordId);

	/**
	 * 
	 * 工作流的任务完成时事件的处理
	 * 
	 * @param delegateTask
	 * @param moduleName
	 * @param recordId
	 * 
	 */
	public void workFlowNotify(DelegateExecution delegateTask, String moduleName, String recordId);

	/**
	 * 
	 * 工作流的任务被取消后的事件
	 * 
	 * @param objectName
	 * @param recordId
	 * 
	 */
	public void workFlowCancel(String objectName, String recordId);

	/**
	 * 
	 * 工作流的任务被暂停后的事件
	 * 
	 * @param objectName
	 * @param recordId
	 * 
	 */
	public void workFlowPause(String objectName, String recordId);

	/**
	 * 
	 * 工作流的任务被暂停后的事件
	 * 
	 * @param objectName
	 * @param recordId
	 * 
	 */
	public void workFlowComplete(String objectName, String recordId, String taskId, String outgoingid,
			String outgoingname, String type, String content, String moduledata);

	/**
	 * 取得当前模块的工作流启动时的Process中的title值，如果是null，则用默认值
	 * 
	 * 默认值是"『" + dataObject.getTitle() + "』" + object.getTitle()
	 * 
	 * @param objectName
	 * @param recordId
	 * @return
	 */
	public String getWorkFlowProcessTitle(String objectName, String recordId);

}
