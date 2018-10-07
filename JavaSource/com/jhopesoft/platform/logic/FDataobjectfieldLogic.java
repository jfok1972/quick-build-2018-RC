package com.jhopesoft.platform.logic;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.annotation.Module.Type;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FAdditionfield;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.exception.DataDeleteException;
import com.jhopesoft.framework.exception.DataUpdateException;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.platform.service.EhcacheService;

@Module
public class FDataobjectfieldLogic {

	@Autowired
	private EhcacheService ehcacheService;

	@Module(type = Type.newDataBefore)
	public void newDataBefore(FDataobjectfield bean) {
		validField(bean);
	}

	@Module(type = Type.newDataAfter)
	public void newDataAfter(FDataobjectfield bean) {
		FDataobject object = DataObjectUtils.getDataObject(bean.getFDataobject().getObjectid());
		bean.setFDataobject(object);
		object.getFDataobjectfields().add(bean);
	}

	@Module(type = Type.updateDataBefore)
	public void updateDataBefore(FDataobjectfield bean) {
		// 这里的bean里只有改变过的字段
	}

	@Module(type = Type.updateDataAfter)
	public void updateDataAfter(FDataobjectfield bean) {
		validField(bean);
	}

	@Module(type = Type.deleteDataBefore)
	public void deleteDataBefore(FDataobjectfield bean) {
		if (bean.equals(bean.getFDataobject()._getPrimaryKeyField()))
			throw new DataDeleteException("当前字段是主键字段，不能进行删除！");
		bean.getFDataobject().getFDataobjectfields().remove(bean);
		bean.setFDataobject(null);
		// 如果当前字段在form或者grid中，那么需要把缓存清空，否则再次刷新数据的时候会出错。
		ehcacheService.clean();
	}

	public void validField(FDataobjectfield field) {
		// 如果是附加字段，要进行以下的验证
		if (field.getFAdditionfield() != null) {
			if (!field.getFieldname().startsWith("udf"))
				throw new DataUpdateException("fieldname", "自定义字段的字段标识必须以 udf 开头！");
			FAdditionfield af = Local.getDao().findById(FAdditionfield.class, field.getFAdditionfield().getAdditionfieldid());
			if (!field.getFDataobject().getObjectid().equals(af.getFDataobject().getObjectid()))
				throw new DataUpdateException("FAdditionfield.title", "选择的附加字段与当前字段必须在同一个实体对象之下！");
		}
		if (field._isBaseField() && BooleanUtils.isTrue(field.getMainlinkage()))
			throw new DataUpdateException("mainlinkage", "主关联联接只能设置在多对一或一对一的字段上！");
		if (field._isManyToOne() || field._isOneToOne()) {
			FDataobject object = DataObjectUtils.getDataObject(field.getFieldtype());
			if (object == null)
				throw new DataUpdateException("fieldtype", "没找到此字段标识的实体对象！");
		}
	}

}
