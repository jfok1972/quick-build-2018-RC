package com.jhopesoft.framework.core.objectquery.navigate;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.TreeValueText;
import com.jhopesoft.framework.core.objectquery.dao.ModuleDataDAO;
import com.jhopesoft.framework.core.objectquery.dao.TreeModuleDataDAO;
import com.jhopesoft.framework.core.objectquery.filter.UserParentFilter;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.core.objectquery.sqlfield.ColumnField;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridnavigatescheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridnavigateschemedetail;
import com.jhopesoft.framework.utils.DataObjectUtils;

@Repository

public class NavigateGenerateService {

	@Resource
	private ModuleDataDAO moduleDataDAO;

	@Resource
	private TreeModuleDataDAO treeModuleDataDAO;

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public JSONObject genNavigateTree(String moduleName, String navigateschemeId, String parentFilter, Boolean cascading,
			Boolean isContainNullRecord) {

		isContainNullRecord = isContainNullRecord == null ? false : isContainNullRecord;
		FDataobject module = DataObjectUtils.getDataObject(moduleName);

		List<FovGridnavigateschemedetail> navigateDetails = new ArrayList<FovGridnavigateschemedetail>();

		FovGridnavigatescheme navigateScheme = Local.getDao().findById(FovGridnavigatescheme.class, navigateschemeId);

		if (navigateScheme != null) {
			navigateDetails.addAll(navigateScheme.getDetails());
		} else {
			
			
			FovGridnavigateschemedetail fieldDetail = new FovGridnavigateschemedetail();
			FDataobjectfield mf = module._getModuleFieldByFieldName(navigateschemeId);
			fieldDetail.setTitle(mf.getFieldtitle());
			fieldDetail.setFDataobjectfield(mf);
			fieldDetail.setOrderno(1);
			FDataobject m = DataObjectUtils.getDataObject(mf.getFieldtype());
			if (m != null && m._isCodeLevel())
				fieldDetail.setAddcodelevel(true);
			navigateDetails.add(fieldDetail);
		}

		

		List<UserParentFilter> userParentFilters = UserParentFilter.changeToParentFilters(parentFilter, moduleName);

		SqlGenerate sqlgenerate = new SqlGenerate(module, true);
		sqlgenerate.setAddIdField(true);
		sqlgenerate.setAddNameField(false);
		sqlgenerate.setAddBaseField(false);
		sqlgenerate.setAddAllFormScheme(false);
		sqlgenerate.setAddAllGridScheme(false);
		sqlgenerate.setDataobjectview(null); 
		sqlgenerate.setUserParentFilters(userParentFilters);

		JSONObject result = new JSONObject();
		result.put("expanded", true);
		JSONArray children = new JSONArray();

		if (cascading != null && cascading) 
			children.add(genAllLevel(sqlgenerate, isContainNullRecord, navigateDetails));
		else
			for (FovGridnavigateschemedetail schemeDetail : navigateDetails) {
				
				List<FovGridnavigateschemedetail> sds = new ArrayList<FovGridnavigateschemedetail>();
				sds.add(schemeDetail);
				children.add(genAllLevel(sqlgenerate, isContainNullRecord, sds));
			}

		if (navigateDetails.size() > 1 && cascading) {
			JSONArray rootchildren = null;
			try {
				rootchildren = children.getJSONObject(0).getJSONArray("children");
			} catch (Exception e) {

			}
			
			if (rootchildren != null && rootchildren.size() == 1) {
				children = rootchildren;
				
				children.getJSONObject(0).remove("fieldvalue");
			}
		}
		result.put("children", children);

		
		
		return result;

	}

	/**
	 * 根据定义的导航来生成所有级的数据，然后根据生成的数据，组织成 json返回
	 * 
	 * @param sqlgenerate
	 * @param generateParam
	 * @param navigateSchemeDetails
	 * @return
	 */
	private JSONObject genAllLevel(SqlGenerate sqlgenerate, Boolean isContainNullRecord,
			List<FovGridnavigateschemedetail> navigateSchemeDetails) {

		
		
		FovGridnavigateschemedetail detail1 = navigateSchemeDetails.get(0);
		
		
		
		

		JSONArray datas = null;

		if (isContainNullRecord && navigateSchemeDetails.size() == 1
				&& !(detail1.getFieldahead() == null && detail1.getFDataobjectfield()._isBaseField())) { 
			

			
			String[] paths = detail1._getFactAheadPath().split("\\.");
			FDataobject module = sqlgenerate.getBaseModule().getModule();
			FDataobject pm = sqlgenerate.getBaseModule().getModule(); 
			for (String path : paths) {
				pm = DataObjectUtils.getDataObject(pm._getModuleFieldByFieldName(path).getFieldtype());
			}
			
			String ahead = module.getObjectname() + ".with." + detail1._getFactAheadPath();
			Set<ColumnField> cFields = new LinkedHashSet<ColumnField>();
			ColumnField aField = new ColumnField();
			aField.setRemark("count_");
			aField.setAggregate("count");
			aField.setFDataobjectfield(module._getPrimaryKeyField());
			aField.setFieldahead(ahead);
			cFields.add(aField);
			
			SqlGenerate sqlgenerate1 = new SqlGenerate(pm);

			sqlgenerate1.setAddIdField(false);
			sqlgenerate1.setAddNameField(false);
			sqlgenerate1.setAddBaseField(false);
			sqlgenerate1.setAddAllFormScheme(false);
			sqlgenerate1.setAddAllGridScheme(false);
			sqlgenerate1.setDataobjectview(null);
			sqlgenerate1.setColumnFields(cFields);

			NavigateSQLGenerate sqlGenerate = new NavigateSQLGenerate(sqlgenerate1, navigateSchemeDetails);
			datas = moduleDataDAO.getData(sqlGenerate.generageNavigateSqlWithAllParentField(),
					sqlGenerate.getFields().keySet().toArray(new String[] {}), -1, -1, module);

		} else {
			NavigateSQLGenerate sqlGenerate = new NavigateSQLGenerate(sqlgenerate, navigateSchemeDetails);
			datas = moduleDataDAO.getData(sqlGenerate.generageNavigateSql(),
					sqlGenerate.getFields().keySet().toArray(new String[] {}), -1, -1, sqlgenerate.getBaseModule().getModule());
		}

		
		
		List<NavigateData> navigateDatas = new ArrayList<NavigateData>();
		for (int i = 0; i < datas.size(); i++) {
			NavigateData data = new NavigateData(datas.getJSONObject(i), 1); 
			navigateDatas.add(data);
		}

		
		
		
		
		navigateDatas = genNavigateTree(navigateDatas, 1, navigateSchemeDetails.size(), navigateSchemeDetails,
				isContainNullRecord);

		int allcount = 0;
		JSONArray firstlevels = new JSONArray();
		for (NavigateData data : navigateDatas) {
			allcount += data.getCount();
			firstlevels.add(data.genJsonObject(sqlgenerate, navigateSchemeDetails));
		}

		JSONObject result = new JSONObject();
		result.put("text", navigateSchemeDetails.get(0).getTitle());
		result.put("iconCls", navigateSchemeDetails.get(0).getIconcls());
		result.put("leaf", false);
		result.put("expanded", true);
		result.put("count", allcount);
		result.put("children", firstlevels);
		return result;
	}

	/**
	 * 根据传进来的数组，生成一个合并组数的数据，再返回，直到最后一级
	 * 
	 * @param navigateDatas
	 * @return
	 */
	private List<NavigateData> genNavigateTree(List<NavigateData> navigateDatas, int level, int maxlevel,
			List<FovGridnavigateschemedetail> schemeDetails, Boolean isContainNullRecord) {
		List<NavigateData> result = new ArrayList<NavigateData>();
		if (level != maxlevel) {
			NavigateData nowNavigate = null;
			for (NavigateData navigateData : navigateDatas) {
				if (navigateData.equals(nowNavigate)) { 
					NavigateData child = new NavigateData(navigateData.getJsonObject(), level + 1);
					nowNavigate.getChildren().add(child);
					nowNavigate.setCount(nowNavigate.getCount() + child.getCount());
				} else {
					nowNavigate = navigateData;
					result.add(nowNavigate);
					nowNavigate.setChildren(new ArrayList<NavigateData>());
					nowNavigate.getChildren().add(new NavigateData(navigateData.getJsonObject(), level + 1));
				}
			}
			for (NavigateData navigateData : result) {
				navigateData.setChildren(
						genNavigateTree(navigateData.getChildren(), level + 1, maxlevel, schemeDetails, isContainNullRecord));
			}
		} else
			result = navigateDatas;

		
		FovGridnavigateschemedetail schemeDetail = schemeDetails.get(level - 1);
		if (schemeDetail.getFDataobjectfield()._isManyToOne() || schemeDetail.getFDataobjectfield()._isOneToOne()) {
			if (schemeDetail.getAddcodelevel()) { 
				

				
				List<TreeValueText> valueTexts = treeModuleDataDAO
						.getRecordWithTreeData(schemeDetail.getFDataobjectfield().getFieldtype(), true, null, null);
				

				List<NavigateData> treeNavigateData = fromTreeValueToNavigateData(valueTexts, result, level,
						isContainNullRecord);

				return treeNavigateData;
			}
		}
		return result;
	}

	public List<NavigateData> fromTreeValueToNavigateData(List<TreeValueText> valueTexts,
			List<NavigateData> navigateDatas, int level, Boolean isContainNullRecord) {
		List<NavigateData> result = new ArrayList<NavigateData>();
		for (TreeValueText treeValue : valueTexts) {
			
			NavigateData navigateData = null;
			for (NavigateData navData : navigateDatas) {
				if (navData.getKey() == null) {
					if (treeValue.getValue() == null) {
						navigateData = navData; 
						break;
					}
				} else if (navData.getKey().equals(treeValue.getValue())) {
					navigateData = navData; 
					break;
				}
			}
			if (navigateData == null) {
				
				navigateData = new NavigateData();
				navigateData.setKey(treeValue.getValue());
				navigateData.setLevel(level);
				navigateData.setCount(0);
				navigateData.setName(treeValue.getText());
				navigateData.setOperator("=");
			}
			if (treeValue.hasChildren()) {
				List<NavigateData> children = fromTreeValueToNavigateData(treeValue.getChildren(), navigateDatas, level,
						isContainNullRecord);
				if (navigateData.getChildren() != null)
					navigateData.getChildren().addAll(children);
				else
					navigateData.setChildren(children);
				for (NavigateData na : navigateData.getChildren()) {
					navigateData.setCount(navigateData.getCount() + na.getCount());
				}
				if (treeValue.getParenttype() != null && treeValue.getParenttype() == TreeModuleDataDAO.PARENTWITHPARENTID)
					navigateData.setOperator("allchildren");
				else
					navigateData.setOperator("like");
			}
			if (isContainNullRecord || navigateData.getCount() > 0)
				result.add(navigateData);
			
		}
		return result;
	}

}
