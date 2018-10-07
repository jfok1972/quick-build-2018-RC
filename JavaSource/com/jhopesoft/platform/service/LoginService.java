package com.jhopesoft.platform.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Service;

import com.jhopesoft.framework.bean.ResultBean;
import com.jhopesoft.framework.bean.UserBean;
import com.jhopesoft.framework.bean.UserCanSelectDataRole;
import com.jhopesoft.framework.core.annotation.SystemLogs;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.limit.FUserdatacanselectrole;
import com.jhopesoft.framework.dao.entity.log.FUserloginlog;
import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.dao.entity.system.FSysteminfo;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.utils.CommonFunction;
import com.jhopesoft.framework.utils.CommonUtils;
import com.jhopesoft.framework.utils.MD5;
import com.jhopesoft.framework.utils.SessionUtils;
import com.jhopesoft.platform.controller.Login;

@Service
public class LoginService {
	@Resource
	private DaoImpl dao;

	/**
	 * case "0": login(themetype); break; case "1": msg = "请输入正确的验证码!"; break; case
	 * "2": msg = "您所输入的用户名不存在!"; break; case "3": msg = "密码输入错误,请重新输入!"; break;
	 * case "4": msg = "当前用户名已被锁定,无法登录!"; break; case "5": msg = "当前用户名已被注销,无法登录!";
	 * break; case "6": msg = "当前用户所在公司已被注销,无法登录!"; break; case "7": msg =
	 * "当前用户已经在线"; break; default: msg = "提交失败, 可能存在网络故障或其他未知原因!"; break;
	 */
	@SystemLogs("用户登陆")
	public ResultBean login(String companyid, String usercode, String password, Boolean invalidate,
			String identifingcode) {
		FSysteminfo systeminfo = getCompanySystemInfo(companyid);
		if (BooleanUtils.isTrue(systeminfo.getAlwaysneedidentifingcode()) || identifingcode != null) {
			Object vcode = Local.getRequest().getSession().getAttribute(Login.VALIDATECODE);
			// vcode == null 可能是几个小时没登录，后台session没了,必须刷新页面？
			if (identifingcode == null || vcode == null || !identifingcode.equalsIgnoreCase(vcode.toString()))
				return new ResultBean(false, "1");
		}
		FUser userinfo = dao.findByPropertyFirst(FUser.class, "usercode", usercode, "companyid", companyid);
		if (userinfo == null)
			return new ResultBean(false, "2");
		if (!MD5.MD5Encode(password + userinfo.getSalt()).equals(userinfo.getPassword()))
			return new ResultBean(false, "3");
		if (BooleanUtils.isTrue(userinfo.getIslocked()))
			return new ResultBean(false, "4");
		if (BooleanUtils.isNotTrue(userinfo.getIsvalid()))
			return new ResultBean(false, "5");
		if (userinfo.getFPersonnel() != null) {
			if (BooleanUtils.isNotTrue(userinfo.getFPersonnel().getIsvalid()))
				return new ResultBean(false, "5");
		}
		// 同一帐户不允许同时登录
		if (BooleanUtils.isNotTrue(systeminfo.getAllowloginagain())) {
			if (CommonUtils.is(invalidate)) {
				SessionUtils.invalidateOnlineUser(userinfo.getUserid());
			} else if (SessionUtils.isOnlineUser(userinfo.getUserid())) {
				return new ResultBean(false, "7");
			}
		}
		if (BooleanUtils.isTrue(systeminfo.getNeedreplaceinitialpassword()) && "123456".equals(password))
			return new ResultBean(true, "-1");
		else
			return new ResultBean(true, "");
	}

	public FUserloginlog createLoginlog(String userid) {
		FUserloginlog loginlog = new FUserloginlog();
		loginlog.setFUser(dao.findById(FUser.class, userid));
		loginlog.setLogindate(new Date());
		loginlog.setIpaddress(CommonFunction.getIpAddr(Local.getRequest()));
		dao.save(loginlog);
		return loginlog;
	}

	public void writeLogout(FUserloginlog loginlog, String logouttype) {
		loginlog.setLogoutdate(new Date());
		loginlog.setLogouttype(logouttype);
		dao.update(loginlog);
	}

	@SystemLogs("查询登陆成功用户信息")
	public UserBean getUserInfo(String usercode) {

		FUser userinfo = dao.findByPropertyFirst(FUser.class, "usercode", usercode);
		UserBean userBean = new UserBean();

		userBean.setUsercode(userinfo.getUsercode());
		userBean.setUserid(userinfo.getUserid());
		userBean.setUsername(userinfo.getUsername());
		userBean.setUsertype(userinfo.getUsertype());
		userBean.setPersonnelid(userinfo.getFPersonnel().getPersonnelid());
		userBean.setPersonnelcode(userinfo.getFPersonnel().getPersonnelcode());
		userBean.setPersonnelname(userinfo.getFPersonnel().getPersonnelname());
		userBean.setDepartmentid(userinfo.getFPersonnel().getFOrganization().getOrgid());
		userBean.setDepartmentcode(userinfo.getFPersonnel().getFOrganization().getOrgcode());
		userBean.setDepartmentname(userinfo.getFPersonnel().getFOrganization().getOrgname());
		userBean.setCompanyid(userinfo.getFPersonnel().getFOrganization().getFCompany().getCompanyid());
		userBean.setCompanyname(userinfo.getFPersonnel().getFOrganization().getFCompany().getCompanyname());
		userBean.setCompanylongname(userinfo.getFPersonnel().getFOrganization().getFCompany().getCompanylongname());
		// 用户可选择的数据角色, 下面这种方式对于多用户登录的时候，同步可能有问题。但是用到的情况不多，暂时先不处理
		// 以后可以在改变可选数据角后，只在session中改变状态，而不是改变所有该用户登录的session。
		if (userinfo.getFUserdatacanselectroles().size() > 0) {
			userBean.setCanselectdatarole(new ArrayList<UserCanSelectDataRole>());
			for (FUserdatacanselectrole role : userinfo.getFUserdatacanselectroles()) {
				if (role.getFDatacanselectfilterrole().getIsvalid()) {
					UserCanSelectDataRole dataRole = new UserCanSelectDataRole(role.getFDatacanselectfilterrole().getRoleid(),
							role.getFDatacanselectfilterrole().getRolename(), BooleanUtils.isTrue(role.getChecked()));
					userBean.getCanselectdatarole().add(dataRole);
				}
			}
			if (userBean.getCanselectdatarole().size() == 0) {
				userBean.setCanselectdatarole(null);
			}
		}
		return userBean;

		// String sql = "select a.userid,a.usercode,a.username,a.usertype, "
		// + " b.companyid,b.companyname,b.companylongname,b.levelid, "
		// + " c.personnelid,c.personnelcode,c.personnelname, "
		// + " d.orgid departmentid,d.OrgCode departmentcode,d.orgname departmentname "
		// + " from f_user a "
		// + " inner join f_company b on a.companyid = b.companyid "
		// + " left join F_Personnel c on a.personnelid = c.personnelid "
		// + " left join F_Organization d on c.orgid = d.orgid" + " where a.usercode =
		// '" + usercode
		// + "' and a.companyid = '" + companyid + "'";
		// List<UserBean> list = dao.executeSQLQuery(sql, UserBean.class);
		// return list.size() == 0 ? null : list.get(0);
	}

	public Map<String, Object> getFSysteminfo(String companyid) {

		FCompany company = dao.findById(FCompany.class, companyid);
		FSysteminfo systeminfo = getCompanySystemInfo(companyid);
		Map<String, Object> cfg = new HashMap<String, Object>();

		Map<String, Object> companymap = new HashMap<String, Object>();
		companymap.put("companyid", company.getCompanyid());
		companymap.put("companyname", company.getCompanyname());
		companymap.put("companylongname", company.getCompanylongname());
		companymap.put("address", company.getAddress());
		companymap.put("linkmen", company.getLinkmen());
		companymap.put("telnumber", company.getTelnumber());
		companymap.put("servicedepartment", company.getServicedepartment());
		companymap.put("servicemen", company.getServicemen());
		companymap.put("servicetelnumber", company.getServicetelnumber());
		companymap.put("serviceqq", company.getServiceqq());
		companymap.put("serviceemail", company.getServiceemail());
		companymap.put("servicehomepage", company.getServicehomepage());
		cfg.put("company", companymap);

		Map<String, Object> systeminfomap = new HashMap<String, Object>();
		systeminfomap.put("systemname", systeminfo.getSystemname());
		systeminfomap.put("systemversion", systeminfo.getSystemversion());
		systeminfomap.put("iconurl", systeminfo.getIconurl());
		systeminfomap.put("iconcls", systeminfo.getIconcls());
		systeminfomap.put("systemaddition", systeminfo.getSystemaddition());
		systeminfomap.put("copyrightowner", systeminfo.getCopyrightowner());
		systeminfomap.put("copyrightinfo", systeminfo.getCopyrightinfo());
		systeminfomap.put("allowsavepassword", systeminfo.getAllowsavepassword());
		systeminfomap.put("savepassworddays", systeminfo.getSavepassworddays());
		systeminfomap.put("needidentifingcode", systeminfo.getNeedidentifingcode());
		systeminfomap.put("alwaysneedidentifingcode", systeminfo.getAlwaysneedidentifingcode());
		systeminfomap.put("forgetpassword", systeminfo.getForgetpassword());
		cfg.put("systeminfo", systeminfomap);

		Map<String, Object> loginsettingmap = new HashMap<String, Object>();
		loginsettingmap.put("allowsavepassword", systeminfo.getAllowsavepassword());
		loginsettingmap.put("needidentifingcode", systeminfo.getNeedidentifingcode());
		loginsettingmap.put("alwaysneedidentifingcode", systeminfo.getAlwaysneedidentifingcode());
		loginsettingmap.put("needreplaceinitialpassword", systeminfo.getNeedreplaceinitialpassword());
		cfg.put("loginsettinginfo", loginsettingmap);

		return cfg;
	}

	public FSysteminfo getCompanySystemInfo(String companyid) {
		FCompany company = dao.findById(FCompany.class, companyid);
		List<FSysteminfo> infos = new ArrayList<FSysteminfo>(company.getFSysteminfos());
		return infos.get(0);
	}

}
