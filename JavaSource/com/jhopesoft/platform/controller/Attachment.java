package com.jhopesoft.platform.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.FileUploadBean;
import com.jhopesoft.platform.service.AttachmentService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/attachment")
public class Attachment {

	@Autowired
	private AttachmentService attachmentService;

	@RequestMapping(value = "/upload")
	@ResponseBody
	public ActionResult upload(FileUploadBean uploaditem, BindingResult bindingResult, HttpServletRequest request) {
		try {
			attachmentService.upload(uploaditem, bindingResult);
		} catch (IOException e) {
			e.printStackTrace();
			return new ActionResult(false, "附件文件保存时，文件系统错误!");
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return new ActionResult(false, e.getMessage());
		} catch (InvocationTargetException e) {
			e.printStackTrace();
			return new ActionResult(false, e.getMessage());
		} catch (RuntimeException e) {
			e.printStackTrace();
			return new ActionResult(false, e.getMessage());
		}
		return new ActionResult();
	}

	/**
	 * 附件文件下载后供预览，如果是可以显示原件的，则下载原件，如果是可以转换成pdf的，则下载pdf
	 * 
	 * @param attachmentid
	 */
	@RequestMapping(value = "/preview")
	@ResponseBody
	public void preview(String attachmentid) {
		try {
			attachmentService.preview(attachmentid);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 下载附件原件
	 * 
	 * @param attachmentid
	 */
	@RequestMapping(value = "/download")
	@ResponseBody
	public void download(String attachmentid) {
		try {
			attachmentService.download(attachmentid);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@RequestMapping("downloadall.do")
	@ResponseBody
	public void downloadAll(String moduleName, String idkey) {
		try {
			attachmentService.downloadAll(moduleName, idkey);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
