package com.jhopesoft.platform.service;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.ResultBean;
import com.jhopesoft.framework.bean.TreeNode;
import com.jhopesoft.framework.bean.UploadFileBean;
import com.jhopesoft.framework.core.annotation.SystemLogs;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FPersonnel;
import com.jhopesoft.framework.dao.entity.system.FSysteminfo;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovBackgroundimage;
import com.jhopesoft.framework.dao.entity.workflow.VActRuTask;
import com.jhopesoft.framework.utils.ChineseConvertPinYin;
import com.jhopesoft.framework.utils.CommonUtils;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.FileUtils;
import com.jhopesoft.framework.utils.MD5;

import ognl.OgnlException;

@Service
public class SystemFrameService {

	@Autowired
	private DataObjectService dataObjectService;

	@Resource
	private DaoImpl dao;

	@SystemLogs("获取系统左侧树形菜单")
	public List<TreeNode> getMenuTree() {
		String userid = Local.getUserid();
		String usertype = Local.getUserBean().getUsertype();
		String companyid = Local.getCompanyid();
		String sql = "select"
				+ "	 a.menuid,a.menuname as text,a.parentid as parentId,a.icon,a.iconCls,a.iconColor,a.isdisplay as visible, "
				+ "	 c.moduletype as type,c.modulesource as url,c.objectid, c.homepageschemeid as moduleschemeid ,"
				+ "a.menutype,a.orderno,a.isexpand as expanded ,a.isdatamining as isdatamining "
				+ " from" + " 	 f_companymenu a,f_companymodule b,f_module c " + " where a.companyid = b.companyid "
				+ " 	 and a.cmoduleid = b.cmoduleid " + " 	 and b.moduleid = c.moduleid " + " 	 and a.companyid = '"
				+ companyid + "' ";
		if (!usertype.equals("00")) {// 系统管理员-可以查看全部的权限，不需要分配权限
			sql += " and (" + " 	   (" + " 		  select count(1) c "
					+ " 			 from f_modulefunction mf1,f_userfunctionlimit ufl "
					+ " 			 where mf1.cmoduleid = b.cmoduleid and mf1.functionid = ufl.functionid and ufl.userid = '" + userid
					+ "' " + " 	   ) > 0" + "     or " + "     ( " + " 		  select count(1) c "
					+ " 			 from f_modulefunction mf2,f_rolefunctionlimit rfl,f_userrole ur "
					+ " 			 where mf2.cmoduleid = b.cmoduleid and mf2.functionid = rfl.functionid and rfl.roleid = ur.roleid and ur.userid ='"
					+ userid + "' " + " 	   ) > 0" + " ) ";
		}
		sql += " order by a.orderno";
		List<TreeNode> dataList = dao.executeSQLQuery(sql, TreeNode.class);
		Map<String, TreeNode> parentMap = new HashMap<String, TreeNode>();
		Set<String> parentidSet = new HashSet<String>(); // 所有已有的parentid
		for (TreeNode node : dataList) {
			if (!CommonUtils.isEmpty(node.getParentId())) {
				parentNode(parentMap, node, parentidSet);
			}
		}
		for (String key : parentMap.keySet()) {
			dataList.add(parentMap.get(key));
		}
		return dataList;
	}

	/**
	 * 递归菜单父节点
	 * 
	 * @param allList
	 * @param dataList
	 */
	private void parentNode(Map<String, TreeNode> parentMap, TreeNode node, Set<String> parentidSet) {
		if (parentidSet.contains(node.getParentId()))
			return;
		else
			parentidSet.add(node.getParentId());
		String sql = "select a.menuid,a.menuname as text,a.parentid as parentId,"
				+ " a.icon,a.iconCls,a.iconColor,a.isdisplay as visible,'00' as type,a.isexpand as expanded ,a.menutype,a.orderno"
				+ "  from f_companymenu a where a.menuid = ?  order by a.orderno ";
		TreeNode parentNode = dao.executeSQLQueryFirst(sql, TreeNode.class, node.getParentId());
		if (!CommonUtils.isEmpty(parentNode) && !parentMap.containsKey(parentNode.getMenuid())) {
			parentMap.put(parentNode.getMenuid(), parentNode);
			if (!CommonUtils.isEmpty(parentNode.getParentId())) {
				parentNode(parentMap, parentNode, parentidSet);
			}
		}
	}

	/**
	 * 取得系统图标
	 * 
	 * @throws IOException
	 */
	public void getSystemFavicon() throws IOException {
		List<FSysteminfo> systeminfos = (List<FSysteminfo>) dao.findAll(FSysteminfo.class);
		HttpServletResponse response = Local.getResponse();

		if (systeminfos.size() > 0 && systeminfos.get(0).getIconfile() != null) {
			FileUtils.copy(new ByteArrayInputStream(systeminfos.get(0).getIconfile()), response.getOutputStream());
		} else {
			File defaultusericon = new File(Local.getProjectSpace().getImages(), "system/defaultfavicon.jpg");
			FileUtils.copy(defaultusericon, response.getOutputStream());
		}
	}

	/**
	 * 取得用户头像图标
	 * 
	 * @param userid
	 * @throws IOException
	 */
	public void getUserFavicon(String userid) throws IOException {
		FUser user = dao.findById(FUser.class, userid == null ? Local.getUserid() : userid);
		FPersonnel personnel = user.getFPersonnel();
		HttpServletResponse response = Local.getResponse();
		if (personnel != null && personnel.getFavicon() != null && personnel.getFavicon().length > 0) {
			FileUtils.copy(new ByteArrayInputStream(personnel.getFavicon()), response.getOutputStream());
		} else {
			File defaultusericon = new File(Local.getProjectSpace().getImages(), "system/defaultuserfavicon.jpg");
			FileUtils.copy(defaultusericon, response.getOutputStream());
		}
	}

	/**
	 * 用户在form中选择了一个上传的图片以后，需要把图像的内容再返回给客户端，使其可以生成一个临时的图像，显示在img中
	 * 
	 * @param uploadExcelBean
	 * @param bindingResult
	 * @param request
	 * @return
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public ActionResult uploadImageFileAndReturn(UploadFileBean uploadExcelBean, BindingResult bindingResult,
			HttpServletRequest request) {
		ActionResult result = new ActionResult();
		InputStream is;
		try {
			is = uploadExcelBean.getFile().getInputStream();
			byte[] buffer = new byte[(int) uploadExcelBean.getFile().getSize()];
			is.read(buffer, 0, (int) uploadExcelBean.getFile().getSize());
			result.setMsg(buffer);
		} catch (IOException e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setMsg("上传的文件接收失败，可能是文件太大");
		}
		return result;
	}

	public ActionResult resetPassword(String userid) {
		FUser user = dao.findById(FUser.class, userid);
		user.setPassword(MD5.MD5Encode("123456" + user.getSalt()));
		dao.update(user);
		return new ActionResult();
	}

	public ActionResult changePassword(String oldPassword, String newPassword) {
		ActionResult result = new ActionResult();
		FUser user = dao.findById(FUser.class, Local.getUserid());
		String oldmd5 = MD5.MD5Encode(oldPassword + user.getSalt());
		if (oldmd5.equals(user.getPassword())) {
			user.setPassword(MD5.MD5Encode(newPassword + user.getSalt()));
			dao.update(user);
		} else {
			result.setSuccess(false);
		}

		return result;
	}

	/**
	 * 取得当前用户可处理任务的个数
	 * 
	 * @return
	 */
	public ActionResult getHintMessageCount() {
		ActionResult result = new ActionResult();
		FDataobject module = DataObjectUtils.getDataObject(VActRuTask.class.getSimpleName());
		int total = 0;
		if (module != null) {
			SqlGenerate generate = new SqlGenerate();
			generate.setDataobject(module);
			generate.pretreatment();
			Dao dao = Local.getDao();
			total = dao.selectSQLCount(generate.generateSelectCount());
		}
		result.setTag(total);
		return result;
	}

	public void getBackGround(String type, String themename) throws IOException {
		HttpServletResponse response = Local.getResponse();
		List<FovBackgroundimage> images = dao.findByProperty(FovBackgroundimage.class, "positiontype", type);
		if (images.size() == 0) {
			if (type.equalsIgnoreCase("login")) {
				File defaultusericon = new File(Local.getProjectSpace().getImages(), "loginbg.gif");
				FileUtils.copy(defaultusericon, response.getOutputStream());
			}
		} else {
			FovBackgroundimage currimage = null; // 当前最适合的theme
			// 找找有没有当前theme的
			List<FovBackgroundimage> themeimages = new ArrayList<FovBackgroundimage>();
			for (FovBackgroundimage image : images) {
				if (themename.equalsIgnoreCase(image.getThemename()))
					themeimages.add(image);
			}
			if (themeimages.size() == 0)
				// 加入所有未定义theme的
				for (FovBackgroundimage image : images) {
					if (StringUtils.isBlank(image.getThemename()))
						themeimages.add(image);
				}
			if (themeimages.size() == 0)
				return;
			else {
				// 所有的themeimages都是可以用的背景，找到第一个，看看是什么类型，然后都按这个来办。
				currimage = themeimages.get(0);
				if ("weekday".equals(themeimages.get(0).getUsetype())) {
					currimage = getWeekDayImage(themeimages); // 星期 1，2，3，4，5，6，7
				} else if ("monthday".equals(themeimages.get(0).getUsetype())) {
					currimage = getMoneyDayImage(themeimages);// 月度日 1,2,...,30,31
				} else if ("random".equals(themeimages.get(0).getUsetype())) {
					currimage = getRandomImage(themeimages); // 随机图片
				}
				if (currimage == null)
					currimage = themeimages.get(0);
			}
			if (StringUtils.isBlank(currimage.getRgbcolor()))
				FileUtils.copy(new ByteArrayInputStream(currimage.getImagefile()), response.getOutputStream());
			else {
				// 生成一个单色的图片
				ByteArrayOutputStream os = new ByteArrayOutputStream();
				BufferedImage bufferedImage = new BufferedImage(1, 1, BufferedImage.TYPE_INT_RGB);
				int[] rgbBytes = CommonUtils.hexString2Ints(currimage.getRgbcolor());
				int rgb = new Color(rgbBytes[0], rgbBytes[1], rgbBytes[2]).getRGB();
				bufferedImage.setRGB(0, 0, rgb);
				ImageIO.write(bufferedImage, "png", os);
				FileUtils.copy(new ByteArrayInputStream(os.toByteArray()), response.getOutputStream());
			}
		}

	}

	private FovBackgroundimage getWeekDayImage(List<FovBackgroundimage> themeimages) {
		for (FovBackgroundimage image : themeimages) {
			if (StringUtils.isNotBlank(image.getUsevalue())) {
				String[] days = image.getUsevalue().split(",");
				Calendar calendar = Calendar.getInstance();
				Integer day = calendar.get(Calendar.DAY_OF_WEEK) - 1;
				if (day == 0)
					day = 7;
				for (String d : days) {
					if (("" + day).equals(d)) {
						return image;
					}
				}
			}
		}
		return null;
	}

	private FovBackgroundimage getMoneyDayImage(List<FovBackgroundimage> themeimages) {
		for (FovBackgroundimage image : themeimages) {
			if (StringUtils.isNotBlank(image.getUsevalue())) {
				String[] days = image.getUsevalue().split(",");
				Calendar calendar = Calendar.getInstance();
				Integer day = calendar.get(Calendar.DAY_OF_MONTH);
				for (String d : days) {
					if (("" + day).equals(d)) {
						return image;
					}
				}
			}
		}
		return null;
	}

	private FovBackgroundimage getRandomImage(List<FovBackgroundimage> themeimages) {
		Random random = new Random();
		return themeimages.get(random.nextInt(themeimages.size()));
	}

	public ResultBean createPersonnalUser(String personnelid)
			throws ClassNotFoundException, IllegalAccessException, InvocationTargetException, OgnlException {
		FPersonnel person = dao.findById(FPersonnel.class, personnelid);
		if (person.getFUsers().size() > 0) {
			ResultBean result = new ResultBean();
			result.setSuccess(false);
			result.setMessage("此人员已经有一个用户了,请到用户模块中进行继续增加！");
			return result;
		} else {
			JSONObject object = new JSONObject();
			object.put("FPersonnel.personnelid", personnelid);
			object.put("usertype", "10");
			object.put("usercode", ChineseConvertPinYin.getFirstSpellLowerCase(person.getPersonnelname()));
			object.put("username", person.getPersonnelname());
			object.put("companyid", "00");
			object.put("isvalid", true);
			object.put("islocked", false);
			object.put("orgfiltertype", "00");
			object.put("creater", Local.getUserid());
			object.put("createdate", new Date());
			//只能查看本部门的数据
			object.put("orgfiltertype", "9920");
			return dataObjectService.saveOrUpdate(FUser.class.getSimpleName(), object.toJSONString(), null, "new");
		}
	}

}
