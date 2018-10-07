package com.jhopesoft.framework.context;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProjectInitialize {
	@SuppressWarnings("unused")
	private static final Logger logger = LoggerFactory.getLogger(ProjectInitialize.class);

	public ProjectInitialize() throws Exception {
		// 第一次使用的时候自动启动
		// try {
		// PdfUtils.initOpenOffice();
		// } catch (Exception e) {
		// e.printStackTrace();
		// logger.info("OpenOffice 启动失败，系统将无法把office附件转换成pdf文件。");
		// }
	}
}
