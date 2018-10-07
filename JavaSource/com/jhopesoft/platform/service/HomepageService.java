package com.jhopesoft.platform.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.favorite.FovUserhomepagescheme;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovHomepagescheme;

@Service
public class HomepageService {

	@Autowired
	private DaoImpl dao;

	/*
	 * 取得用户的所有主页方案
	 */
	public List<FovHomepagescheme> getHomepageInfo() {
		List<FovHomepagescheme> result = new ArrayList<FovHomepagescheme>();
		FUser user = dao.findById(FUser.class, Local.getUserid());
		for (FovUserhomepagescheme userscheme : user.getFovUserhomepageschemes()) {
			FovHomepagescheme scheme = userscheme.getFovHomepagescheme();
			if (BooleanUtils.isTrue(userscheme.getIsdefault()))
				result.add(0, scheme);
			else
				result.add(scheme);
		}

		// 加入没有设置的，并且是无用户的，即为系统默认的
		List<FovHomepagescheme> schemes = dao.findAll(FovHomepagescheme.class);
		schemes.sort(new Comparator<FovHomepagescheme>() {
			@Override
			public int compare(FovHomepagescheme o1, FovHomepagescheme o2) {
				return (int) o1.getOrderno() - (int) o2.getOrderno();
			}
		});
		for (FovHomepagescheme scheme : schemes) {
			if (scheme.getFUser() == null) {
				boolean found = false;
				for (FovHomepagescheme s : result) {
					if (s == scheme) {
						found = true;
						break;
					}
				}
				if (!found)
					result.add(scheme);
			}
		}
		return result;
	}

	/**
	 * 设置用户的缺省主页方案中的方案值
	 * 
	 * @param schemeid
	 * @return
	 */
	public ActionResult setUserDefault(String schemeid) {
		FUser user = dao.findById(FUser.class, Local.getUserid());
		for (FovUserhomepagescheme userscheme : user.getFovUserhomepageschemes()) {
			FovHomepagescheme scheme = userscheme.getFovHomepagescheme();
			if (schemeid.equals(scheme.getHomepageschemeid())) {
				if (BooleanUtils.isNotTrue(userscheme.getIsdefault())) {
					userscheme.setIsdefault(true);
					dao.update(userscheme);
				}
			} else {
				if (BooleanUtils.isNotFalse(userscheme.getIsdefault())) {
					userscheme.setIsdefault(false);
					dao.update(userscheme);
				}
			}
		}
		return new ActionResult();
	}

	public ActionResult remove(String schemeid) {
		FUser user = dao.findById(FUser.class, Local.getUserid());
		for (FovUserhomepagescheme userscheme : user.getFovUserhomepageschemes()) {
			if (userscheme.getFovHomepagescheme().getHomepageschemeid().equals(schemeid)) {
				dao.delete(userscheme);
				break;
			}
		}
		return new ActionResult();
	}

	public ActionResult add(String schemeid) {
		ActionResult result = new ActionResult();
		boolean found = false;
		FovHomepagescheme scheme = dao.findById(FovHomepagescheme.class, schemeid);
		result.setMsg(scheme.getSchemename());
		FUser user = dao.findById(FUser.class, Local.getUserid());
		for (FovUserhomepagescheme userscheme : user.getFovUserhomepageschemes()) {
			if (userscheme.getFovHomepagescheme() == scheme) {
				found = true;
				break;
			}
		}
		if (!found) {
			FovUserhomepagescheme fovUserhomepagescheme = new FovUserhomepagescheme();
			fovUserhomepagescheme.setFUser(user);
			fovUserhomepagescheme.setFovHomepagescheme(scheme);
			dao.save(fovUserhomepagescheme);
		}
		return result;
	}
}
