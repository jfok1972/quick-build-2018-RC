package com.jhopesoft.platform.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.MapBean;
import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.annotation.Module.Type;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.SqlMapperAdapter;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectbasefuncion;
import com.jhopesoft.framework.dao.entity.module.FCompanymenu;
import com.jhopesoft.framework.dao.entity.module.FCompanymodule;
import com.jhopesoft.framework.dao.entity.module.FCompanymodulegroup;
import com.jhopesoft.framework.dao.entity.module.FModule;
import com.jhopesoft.framework.dao.entity.module.FModulefunction;
import com.jhopesoft.framework.dao.entity.module.FModulegroup;
import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFilterscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridsortscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovHomepagescheme;
import com.jhopesoft.framework.utils.CommonUtils;
import com.jhopesoft.framework.utils.DateUtils;
import com.jhopesoft.framework.utils.ProjectUtils;

@Service
public class ModuleService extends SqlMapperAdapter {

	public FModule getModule(String moduleid) {
		if (CommonUtils.isEmpty(moduleid))
			return null;
		FModule module = dao.findById(FModule.class, moduleid);
		if (module != null)
			return module;
		List<FDataobject> list = dao.executeQuery("from FDataobject where (lower(objectid) = ? or lower(objectname) =?)",
				new Object[] { moduleid.toLowerCase(), moduleid.toLowerCase() });
		if (list.size() == 0)
			return null;
		FDataobject object = list.get(0);
		if (object.getFModules() == null)
			return null;
		for (FModule m : object.getFModules()) {
			module = m;
			break;
		}
		return module;
	}

	/**
	 * 取得一个模块的所有的要发送给前台的信息，
	 * 
	 * @param moduleid
	 * @return
	 */
	public FModule getModuleInfo(String moduleid) {
		FModule module = getModule(moduleid);
		if (module == null)
			return null;
		ProjectUtils.invokeLogic(Module.class, Type.moduleInfo, module.getFDataobject().getObjectname(), this,
				new MapBean("module", module));
		return module;
	}

	/**
	 * 在用户新增了方案，或者系统方案或者分享方案变动过后，可以单独刷新方案列表。
	 * 
	 * @param moduleid
	 * @return
	 */
	public Map<String, Set<FovGridscheme>> getGridSchemes(String moduleid) {
		FModule module = getModule(moduleid);
		if (module == null)
			return null;
		return module.getFDataobject().getGridSchemes();
	}

	/**
	 * 新增或者修改一个方案以后，需要把方案的内容传到后台
	 * 
	 * @param scheme
	 * @return
	 */
	public FovGridscheme getGridScheme(String schemeid) {
		return dao.findById(FovGridscheme.class, schemeid);
	}

	/**
	 * 调整表单后预览效果
	 * 
	 * @param schemeid
	 * @return
	 */
	public FovFormscheme getFormScheme(String schemeid) {
		return dao.findById(FovFormscheme.class, schemeid);
	}

	/**
	 * 新增或者修改一个方案以后，需要把方案的内容传到后台
	 * 
	 * @param scheme
	 * @return
	 */
	public FovFilterscheme getFilterScheme(String schemeid) {
		return dao.findById(FovFilterscheme.class, schemeid);
	}

	public JSONObject getSortScheme(String schemeid) {
		FovGridsortscheme scheme = dao.findById(FovGridsortscheme.class, schemeid);
		return scheme._genJson();
	}

	public ActionResult addtoCompanyModule(String homepageschemeid) {
		ActionResult result = new ActionResult();
		FovHomepagescheme homepagescheme = dao.findById(FovHomepagescheme.class, homepageschemeid);
		if (homepagescheme.getFModules().size() == 0) {
			FModulegroup group = dao.findByPropertyFirst(FModulegroup.class, "groupname", "模块方案组");
			if (group == null) {
				group = new FModulegroup("模块方案组", 200);
				group.setOrderno((int) selectMax("f_modulegroup", "orderno") + 1);
				dao.save(group);
			}
			FModule module = new FModule();
			module.setFModulegroup(group);
			module.setFovHomepagescheme(homepagescheme);
			module.setModulecode(homepagescheme.getHomepageschemeid());
			module.setModuletype("05");
			module.setIsvalid(true);
			module.setModulename(homepagescheme.getSchemename());
			module.setCreater(Local.getUserid());
			module.setCreatedate(DateUtils.getTimestamp());
			module.setOrderno((int) selectMax("F_Module", "orderno",
					"ModuleGroupID = '" + module.getFModulegroup().getModulegroupid() + "'") + 1);
			dao.save(module);
			// 单公司
			FCompanymodulegroup companymodulegroup = dao.findByPropertyFirst(FCompanymodulegroup.class, "companyid", "00",
					"groupname", "模块方案组");
			if (companymodulegroup == null) {
				companymodulegroup = new FCompanymodulegroup();
				companymodulegroup.setFCompany(dao.findById(FCompany.class, "00"));
				companymodulegroup.setGroupname("模块方案组");
				companymodulegroup.setOrderno(100);
				companymodulegroup.setOrderno((int) selectMax("f_companymodulegroup", "orderno") + 1);
				dao.save(companymodulegroup);
			}
			FCompanymodule companymodule = new FCompanymodule();
			companymodule.setFCompany(dao.findById(FCompany.class, "00"));
			companymodule.setFCompanymodulegroup(companymodulegroup);
			companymodule.setFModule(module);
			dao.save(companymodule);

			FCompanymenu pmenu = dao.findByPropertyFirst(FCompanymenu.class, "companyid", "00", "menuname", "模块方案组");
			if (pmenu == null) {
				pmenu = new FCompanymenu(dao.findById(FCompany.class, "00"), "模块方案组", 0, Local.getUserid(),
						DateUtils.getTimestamp());
				pmenu.setOrderno((int) selectMax("f_companymenu", "orderno") + 1);
				dao.save(pmenu);
			}

			FCompanymenu menu = new FCompanymenu(dao.findById(FCompany.class, "00"), homepagescheme.getSchemename(), 0,
					Local.getUserid(), DateUtils.getTimestamp());
			menu.setFCompanymenu(pmenu);
			menu.setFCompanymodule(companymodule);
			menu.setIsdisplay(true);

			String where = CommonUtils.isEmpty(menu.getFCompanymenu()) ? ""
					: "ParentID = '" + menu.getFCompanymenu().getMenuid() + "'";
			menu.setOrderno((int) selectMax("f_companymenu", "orderno", where) + 1);
			dao.save(menu);

			List<FDataobjectbasefuncion> list = dao.findAll(FDataobjectbasefuncion.class);
			for (int i = 0; i < list.size(); i++) {
				if ("query".equals(list.get(i).getFcode())) {
					FModulefunction mf = new FModulefunction();
					mf.setFCompanymodule(companymodule);
					mf.setFDataobjectbasefuncion(list.get(i));
					mf.setIsvalid(true);
					mf.setOrderno(i + 1);
					dao.save(mf);
				}
			}
			result.setMsg(companymodule.getFCompany().getCompanyname());
		}
		return result;
	}

}
