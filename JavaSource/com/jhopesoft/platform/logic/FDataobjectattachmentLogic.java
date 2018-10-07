package com.jhopesoft.platform.logic;

import org.springframework.beans.factory.annotation.Autowired;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.annotation.Module.Type;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.attachment.FDataobjectattachment;
import com.jhopesoft.platform.service.AttachmentService;

/**
 * 
 * @author jiangfeng
 *
 */
@Module
public class FDataobjectattachmentLogic {

	@Autowired
	private AttachmentService attachmentService;

	@Module(type = Type.deleteDataBefore)
	public void deleteDataBefore(FDataobjectattachment bean) {

		if (bean.getFDataobjectattachmentfile() != null) {
			Local.getDao().delete(bean.getFDataobjectattachmentfile());
		}

		if (bean.getFDataobjectattachmentpdffile() != null) {
			Local.getDao().delete(bean.getFDataobjectattachmentpdffile());
		}

		if (bean.getLocalpathname() != null) {
			attachmentService.deleteFile(bean);
		}

	}
}
