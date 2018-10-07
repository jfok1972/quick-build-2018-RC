package com.jhopesoft.framework.context;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.exception.FileStreamException;

public class ProjectSpace {

	private String workSpaceRoot;

	public String getWorkSpaceRoot() {
		return workSpaceRoot;
	}

	public void setWorkSpaceRoot(String workSpaceRoot) {
		this.workSpaceRoot = workSpaceRoot;
	}
	
	/**
	 * 获取项目根目录
	 * @return
	 */
	public String getRoot() {
		try {
			return URLDecoder.decode(Local.getCriticalObject().getRoot(),"utf-8") + File.separator;
		} catch (UnsupportedEncodingException e) {
			throw new FileStreamException(e);
		}
	}
	
	/**
	 * 获取WEB-INF配置目录
	 * @return
	 */
	public String getWebInfo() {
		return getRoot() + "WEB-INF" + File.separatorChar;
	} 
	
	/**
	 * 获取Class根目录
	 * @return
	 */
	public String getClassRoot() {
		return getWebInfo() + "classes" + File.separator;
	}
	
	/**
	 * 获取系统资源库根目录
	 * @return
	 */
	public String getLibraryRoot() {
		return getWebInfo() + "lib" + File.separator;
	}
	
	/**
	 * 获取系统图片资源目录
	 * @return
	 */
	public String getImages() {
		return getRoot() + "resources/images" + File.separatorChar;
	}
}
