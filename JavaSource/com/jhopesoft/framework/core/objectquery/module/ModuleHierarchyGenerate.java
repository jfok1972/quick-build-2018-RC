package com.jhopesoft.framework.core.objectquery.module;

import java.util.Date;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jhopesoft.framework.core.objectquery.sqlfield.AdditionParentModuleField;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.MD5;

/**
 * 根据系统中的定义，将BaseModule的各种其他数据组织好，包括父模块，子模块，oneToone等
 * 
 * 只对所有的模块生成结构树，并不加入任何条件
 * 
 * @author jiangfeng
 *
 */
public class ModuleHierarchyGenerate {

	private static final Log log = LogFactory.getLog(ModuleHierarchyGenerate.class);

	public static final String CHILDSEPARATOR = ".with";

	/**
	 * 取得该块所有的父模块的数据，这是一棵树形结构
	 * 
	 * @param module
	 *          基准模块
	 * @return
	 */
	public static BaseModule genModuleHierarchy(FDataobject module, String asName, boolean isDatamining) {
		log.debug("基准模块：" + module.getTitle() + " 的关联关系结构开始生成......");
		long s = new Date().getTime();
		BaseModule baseModule = new BaseModule();
		baseModule.setModule(module);
		baseModule.setDatamining(isDatamining);
		baseModule.setAsName(asName);
		int pcount = 1;

		for (FDataobjectfield field : module.getFDataobjectfields())
			if (field._isManyToOne() || field._isOneToOne()) {
				FDataobject pmodule = DataObjectUtils.getDataObject(field.getFieldtype());

				String parentPath = pmodule.getObjectname();
				baseModule.getParents().put(field.getFieldname(), genModuleParentHierarchy(baseModule, baseModule, field,
						pmodule, pcount++, 1, field.getFieldtitle(), parentPath, module.getObjectname(), false));
			}

		for (String p : baseModule.getParents().keySet()) {
			baseModule.getParents().get(p).setIsDirectParent(true);
		}
		baseModule.calcParentModuleOnlyone();
		log.debug("模块：" + module.getTitle() + " 的关联关系结构已生成,用时 " + (new Date().getTime() - s) + "毫秒。");
		return baseModule;
	}

	/**
	 * 这是取得每一级父模块的一个函数，是个递归函数
	 * 
	 * @param baseModule
	 * @param field
	 * @param pModule
	 * @param level
	 * @param nameAhead
	 * @param pathAhead
	 * @param proviousPath
	 *          子模块的路径，放在 on 里面的
	 * 
	 * @param breakdatafilterchain
	 *          是否断开当前父模块及所有父模块的数据权限链
	 * @return
	 */
	public static ParentModule genModuleParentHierarchy(BaseModule baseModule, Object sonModule, FDataobjectfield field,
			FDataobject pModule, int pcount, int level, String fullname, String parentPath, String proviousPath,
			boolean breakdatafilterchain) {

		String proviousAs;
		String proviousAheadField;
		if (sonModule instanceof ParentModule) {
			proviousAs = ((ParentModule) sonModule).getAsName();
			proviousAheadField = ((ParentModule) sonModule).getFieldahead();
		} else {
			proviousAs = ((BaseModule) sonModule).getAsName();
			proviousAheadField = "";
		}
		if (level == 50)
			return null;
		ParentModule pm = new ParentModule();
		pm.setSonModuleHierarchy(sonModule);
		pm.setBreakDataFilterChain(breakdatafilterchain || BooleanUtils.isTrue(field.getBreakdatafilterchain()));

		pm.setModule(pModule);
		pm.setModuleField(field);
		pm.setLevel(level);
		pm.setModulePath(parentPath);
		pm.setOnlyonename(field.getFieldtitle());
		pm.setNamePath(fullname);

		pm.setFieldahead(proviousAheadField + (proviousAheadField.length() == 0 ? "" : ".") + field.getFieldname());
		String md5as = MD5.MD5Encode(proviousAs + level + "" + pcount);
		pm.setAsName("t_" + md5as.substring(md5as.length() - 28));

		baseModule.getAllParents().put(pm.getFieldahead(), pm);

		pm.setLeftoutterjoin(String.format("left outer join %s %s on %s = %s", pModule._getTablename(), pm.getAsName(),
				pModule._getPrimaryKeyField()._getSelectName(pm.getAsName()),
				field.getJoincolumnname() == null ? pModule._getPrimaryKeyField()._getSelectName(proviousAs)
						: proviousAs + "." + field.getJoincolumnname()));

		log.debug("  加入父模块：" + pm.getNamePath() + "--" + pm.getFieldahead());

		pcount = 1;
		for (FDataobjectfield mfield : pModule.getFDataobjectfields())
			if (mfield._isManyToOne() || mfield._isOneToOne()) {
				FDataobject pmodule = DataObjectUtils.getDataObject(mfield.getFieldtype());

				String parentPath1 = parentPath + "--" + pmodule.getObjectname();

				pm.getParents().put(mfield.getFieldname(), genModuleParentHierarchy(baseModule, pm, mfield, pmodule, pcount++,
						level + 1, fullname + "--" + mfield.getFieldtitle(), parentPath1, parentPath, pm.isBreakDataFilterChain()));
			}

		pm.setPrimarykeyField(new AdditionParentModuleField(pm.getFieldahead() + "." + pModule.getPrimarykey(),
				pModule._getPrimaryKeyField()._getSelectName(pm.getAsName())));

		FDataobjectfield _mainLinkageField = pModule._getMainLinkageField();
		if (baseModule.isDatamining() || _mainLinkageField == null || baseModule.getAsName().startsWith("aggregate_")) {
			pm.setNameField(new AdditionParentModuleField(pm.getFieldahead() + "." + pModule.getNamefield(),
					pModule._getNameField()._getSelectName(pm.getAsName())));
		} else {

			ParentModule linkagepm = pm.getParents().get(_mainLinkageField.getFieldname());
			linkagepm.setAddToFromByFields(true);
			linkagepm.getModule()._getNameField()._getSelectName(linkagepm.getAsName());
			pm.setNameField(new AdditionParentModuleField(pm.getFieldahead() + "." + pModule.getNamefield(),
					Local.getBusinessDao().getSf()
							.link(new String[] { linkagepm.getModule()._getNameField()._getSelectName(linkagepm.getAsName()), "' / '",
									pModule._getNameField()._getSelectName(pm.getAsName()) })));
		}
		return pm;
	}

	/**
	 * 这是取得每一级父模块的一个函数，是个递归函数
	 * 
	 * @param field
	 * @param pModule
	 * @param level
	 * @param nameAhead
	 * @param pathAhead
	 * @return
	 */
	public static ChildModule genModuleChildHierarchy(BaseModule baseModule, Object parentModule, FDataobjectfield field,
			FDataobject pModule, int level, String fullname, String childPath) {

		if (level == 50)
			return null;
		ChildModule cm = new ChildModule();
		cm.setParentModuleHierarchy(parentModule);
		cm.setModule(pModule);
		cm.setModuleField(field);
		cm.setLevel(level);
		cm.setModulePath(childPath);
		cm.setFieldahead(childPath);
		cm.setNamePath(fullname);
		baseModule.getAllChilds().put(cm.getFieldahead(), cm);

		log.debug("  加入子模块：" + pModule.getTitle() + "," + childPath + "," + cm.getNamePath());

		for (FDataobjectfield f : DataObjectUtils.getDataObjectManyToOneField(pModule.getObjectname())) {

			String fieldType = f.getFieldtype();
			if (fieldType.equals(pModule.getObjectname())) {
				String childPath1 = f.getFDataobject().getObjectname() + CHILDSEPARATOR + "."
						+ childPath.replaceFirst(pModule.getObjectname() + CHILDSEPARATOR, f.getFieldname());
				String fullname1 = f.getFDataobject().getTitle() + "("
						+ fullname.replaceFirst(pModule.getTitle() + "\\(", f.getFieldtitle() + "--");
				cm.getChilds().put(childPath1,
						genModuleChildHierarchy(baseModule, cm, f, f.getFDataobject(), level + 1, fullname1, childPath1));
			}

		}
		return cm;
	}

}
