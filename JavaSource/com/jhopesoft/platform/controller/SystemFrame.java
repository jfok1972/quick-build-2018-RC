package com.jhopesoft.platform.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.persistence.PersistenceException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.ResultBean;
import com.jhopesoft.framework.bean.TreeNode;
import com.jhopesoft.framework.core.annotation.SystemLogs;
import com.jhopesoft.framework.dao.SqlMapperAdapter;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.exception.DataUpdateException;
import com.jhopesoft.framework.exception.ProjectException;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.ProjectUtils;
import com.jhopesoft.framework.utils.TreeBuilder;
import com.jhopesoft.platform.service.SystemFrameService;
import com.jhopesoft.framework.bean.UploadFileBean;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/systemframe")
public class SystemFrame extends SqlMapperAdapter {

	@Resource
	private SystemFrameService service;

	@SystemLogs("获取当需要处理的任务的个数")
	@RequestMapping(value = "/gethintmessagecount")
	@ResponseBody
	public ActionResult getHintMessageCount() {
		return service.getHintMessageCount();
	}

	@SystemLogs("获取系统菜单")
	@RequestMapping(value = "/getmenutree")
	@ResponseBody
	public List<TreeNode> getMenuTree() {
		return TreeBuilder.buildListToTree(service.getMenuTree());
	}

	@RequestMapping(value = "/getuserfavicon")
	public void getUserFavicon(HttpServletRequest request, HttpServletResponse response, String userid)
			throws IOException {
		service.getUserFavicon(userid);
	}

	/**
	 * 用户在form中选择了一个上传的图片以后，需要把图像的内容再返回给客户端，使其可以生成一个临时的图像，显示在img中
	 * 
	 * @param uploadExcelBean
	 * @param bindingResult
	 * @param request
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/uploadimagefileandreturn")
	public ResponseEntity<Map<String, Object>> uploadImageFileAndReturn(UploadFileBean uploadExcelBean,
			BindingResult bindingResult, HttpServletRequest request) throws IOException {
		Map<String, Object> map = new HashMap<String, Object>();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.TEXT_PLAIN);
		ActionResult ar = service.uploadImageFileAndReturn(uploadExcelBean, bindingResult, request);
		map.put("success", ar.getSuccess());
		map.put("msg", ar.getMsg());
		return new ResponseEntity<Map<String, Object>>(map, headers, HttpStatus.OK);

	}

	@RequestMapping(value = "/resetpassword", method = RequestMethod.POST)
	@ResponseBody
	public ActionResult resetPassword(String userid) {
		return service.resetPassword(userid);
	}

	@RequestMapping(value = "/changepassword", method = RequestMethod.POST)
	@ResponseBody
	public ActionResult changePassword(String oldPassword, String newPassword) {
		return service.changePassword(oldPassword, newPassword);
	}

	@RequestMapping(value = "/createpersonnaluser", method = RequestMethod.POST)
	@ResponseBody
	public ResultBean createPersonnalUser(String personnelid) {
		String objectname = FUser.class.getSimpleName();
		ResultBean result = new ResultBean();
		try {
			result = service.createPersonnalUser(personnelid);
		} catch (DataUpdateException e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setData(e.getErrorMessage());
			result.setMessage(e.getMessage());
		} catch (ConstraintViolationException e) {
			e.printStackTrace();
			FDataobject dataObject = DataObjectUtils.getDataObject(objectname);
			result = ProjectUtils.getErrorMassage(e, dataObject, dao, getSf());
			result.setMessage("当前人员自动生成时，用户名已经存在，请去用户模块中添加！");
		} catch (PersistenceException e) {
			e.printStackTrace();
			FDataobject dataObject = DataObjectUtils.getDataObject(objectname);
			result = ProjectUtils.getErrorMassage(e, dataObject, dao, getSf());
			result.setMessage("当前人员自动生成时，用户名已经存在，请去用户模块中添加！");
		} catch (ProjectException e) {
			e.printStackTrace();
			Throwable original = e.getOriginalThrowable();
			if (original.getClass().equals(DataUpdateException.class)) {
				result.setSuccess(false);
				result.setData(((DataUpdateException) original).getErrorMessage());
				result.setMessage(original.getMessage());
			} else {
				result.setSuccess(false);
				result.setMessage(e.getMessage());
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setMessage(e.getMessage());
		}
		if (result.isSuccess()) {
			@SuppressWarnings("unchecked")
			Map<String, Object> userobject = (Map<String, Object>) result.getData();
			String msg = "用户登录名：" + userobject.get("usercode");
			msg += "<br/>用户名称：" + userobject.get("username");
			msg += "<br/>初始密码：123456";
			result.setMessage(msg);
		}
		return result;
	}

}
