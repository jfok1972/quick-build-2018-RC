package com.jhopesoft.platform.service;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.ognl.Ognl;
import org.springframework.stereotype.Service;

import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.exception.DataDeleteException;
import com.jhopesoft.framework.exception.DataUpdateException;

/**
 * 
 * @author jiangfeng
 *
 */
@Service
public class CodeLevelDataobjectService {

	@Resource
	private DaoImpl dao;

	/**
	 * 在某个模块新增了一条记录时，检查此记录的id，是否符合规范
	 * 
	 * @param module
	 * @param keyid
	 * @return
	 */
	public String addCodeLevelModuleKey(FDataobject module, String keyid, Class<?> beanclass) {
		if (!isCodeLengthRight(module.getCodelevel(), keyid)) {
			throw new DataUpdateException(module.getPrimarykey(), "代码的长度不符合级次规范:" + module.getCodelevel());
		} else // 查找是否有上级代码了
		if (keyid.length() != getThisLevellen(module.getCodelevel(), 0)) {
			// 如果不是0顶级长度
			int parentl = getKeyLevel(module.getCodelevel(), keyid.length()) - 1;
			String parentkey = keyid.substring(0, getcodeLevellen(module.getCodelevel(), parentl));
			if (dao.findById(beanclass, parentkey) == null) {
				throw new DataUpdateException(module.getPrimarykey(), "代码:『" + keyid + "』未找到其父代码『" + parentkey + "』的记录值!");
			}
		}
		return null;
	}

	public void deleteCodeLevelModuleKey(FDataobject module, String keyid) {
		List<?> result = dao.executeSQLQuery(
				" select * from " + module._getTablename() + " where " + module._getPrimaryKeyField()._getSelectName(null)
						+ " like '" + keyid + "%' order by " + module._getPrimaryKeyField()._getSelectName(null));
		String name = null;
		if (result.size() > 1) {
			try {
				name = Ognl.getValue(module._getNameField()._getSelectName(null), result.get(0)).toString();
			} catch (Exception e) {
				e.printStackTrace();
			}
			throw new DataDeleteException(
					module.getTitle() + ":『" + name + "』下有" + String.valueOf(result.size() - 1) + "条子记录，请先删除所有子记录!");
		}
	}

	/**
	 * 主键更换的时候，先判断能否删，再判断能否加
	 * 
	 * @param module
	 * @param oldkeyid
	 * @param newkeyid
	 * @return
	 */
	public void replaceCodeLevelModuleKey(FDataobject module, String oldkeyid, String newkeyid, Class<?> beanclass) {

		deleteCodeLevelModuleKey(module, oldkeyid);
		addCodeLevelModuleKey(module, newkeyid, beanclass);

	}

	/**
	 * 检查一个keyid 是否符合 code level
	 * 
	 * @param codeLevel
	 * @param keyid
	 * @return true, 符合长度，false 不符合长度要求
	 */
	private boolean isCodeLengthRight(String codeLevel, String keyid) {
		if (keyid == null) {
			return false;
		}
		int l = keyid.length();
		for (int i = 0; i < getCodeLevelNum(codeLevel); i++) {
			if (l == getcodeLevellen(codeLevel, i)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 取得一个长度为num 是第几级
	 * 
	 * @param codeLevel
	 * @param num
	 * @return
	 */
	private int getKeyLevel(String codeLevel, int num) {
		for (int i = 0; i < getCodeLevelNum(codeLevel); i++) {
			if (num == getcodeLevellen(codeLevel, i)) {
				return i;
			}
		}
		return -1;
	}

	/** 返回code level 共有几级 */
	public int getCodeLevelNum(String codeLevel) {

		return codeLevel.split(",").length;

	}

	/** 返回某一级别的code code level 长度 */
	public int getThisLevellen(String codeLevel, int level) {
		return Integer.parseInt(codeLevel.split(",")[level]);
	}

	/** 返回某一级别的code code level 总长度 */
	public int getcodeLevellen(String codeLevel, int level) {
		String[] levels = codeLevel.split(",");
		int result = 0;
		for (int i = 0; i <= level; i++) {
			result += Integer.parseInt(levels[i]);
		}
		return result;
	}

}
