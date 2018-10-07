package com.jhopesoft.platform.service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.ValueText;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlField;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlFieldUtils;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FAdditionfield;
import com.jhopesoft.framework.dao.entity.dataobject.FAdditionfieldexpression;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.utils.FFunction;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.ParentChildFieldUtils;
import com.sun.star.uno.RuntimeException;

@Service
public class DataobjectFieldService {

	@Autowired
	private DaoImpl dao;

	@Autowired
	private DataObjectService dataObjectService;

	@Autowired
	private DictionaryService dictionaryService;

	public JSONObject getUserDefineFieldExpression(String additionfieldid) {
		JSONArray array = new JSONArray();
		FAdditionfield additionfield = dao.findById(FAdditionfield.class, additionfieldid);
		for (FAdditionfieldexpression expression : additionfield.getExpressions()) {
			array.add(expression.genJsonObject(additionfield.getFDataobject()));
		}
		JSONObject result = new JSONObject();
		result.put("leaf", false);
		result.put("children", array);
		return result;
	}

	public ActionResult updateUserDefineFieldExpression(String additionfieldid, String schemeDefine) {
		FAdditionfield additionField = dao.findById(FAdditionfield.class, additionfieldid);
		for (FAdditionfieldexpression limit : additionField.getExpressions()) {
			dao.delete(limit);
		}
		JSONObject object = JSONObject.parseObject("{ children :" + schemeDefine + "}");
		JSONArray arrays = (JSONArray) object.get("children");
		saveNewDetails(additionField, arrays, null);
		ActionResult result = new ActionResult();
		return result;
	}

	private void saveNewDetails(FAdditionfield additionField, JSONArray arrays, FAdditionfieldexpression p) {
		for (int i = 0; i < arrays.size(); i++) {
			JSONObject detailObject = arrays.getJSONObject(i);
			FAdditionfieldexpression detail = new FAdditionfieldexpression();
			detail.setFAdditionfield(additionField);
			detail.setFAdditionfieldexpression(p);
			if (detailObject.containsKey("title"))
				detail.setTitle(detailObject.getString("title"));
			if (detailObject.containsKey("userfunction"))
				detail.setUserfunction(detailObject.getString("userfunction"));
			if (detailObject.containsKey("remark"))
				detail.setRemark(detailObject.getString("remark"));
			if (detailObject.containsKey("functionid"))
				detail.setFFunction(new FFunction(detailObject.getString("functionid")));
			detail.setOrderno((i + 1) * 10);
			if (detailObject.containsKey("fieldid"))
				ParentChildFieldUtils.updateToField(detail, detailObject.getString("fieldid"));
			dao.save(detail);
			if (detailObject.containsKey("children")) {
				saveNewDetails(null, (JSONArray) detailObject.get("children"), detail);
			}
		}
	}

	/**
	 * 说明： FieldName 从表实体对象名称 TestB FieldDbName 关联表中主表字段名称 test_ida FieldRelation
	 * 多对一关系 ManyToMany FieldType 字段类型 Set<TestB> JoinTable 关联表实体对象名称 TestALikeB
	 * JoinColumnName 关联表中从表字段名称 test_idb
	 * 
	 * @param fieldid1
	 *          主表字段ID
	 * @param fieldid2
	 *          从表字段ID
	 * @param linkedobjectid
	 *          中间关联表实体对象ID
	 * @param userid
	 *          创建者ID
	 * @return
	 */
	public ActionResult createManyToManyField(String fieldid1, String fieldid2, String linkedobjectid, String userid) {
		FDataobjectfield objectfield1 = dao.findById(FDataobjectfield.class, fieldid1);
		FDataobjectfield objectfield2 = dao.findById(FDataobjectfield.class, fieldid2);
		FDataobject object1 = DataObjectUtils.getDataObject(objectfield1.getFieldtype());
		FDataobject object2 = DataObjectUtils.getDataObject(objectfield2.getFieldtype());
		FDataobject linkedobject = dao.findById(FDataobject.class, linkedobjectid);

		// 主表增加字段
		FDataobjectfield field1 = new FDataobjectfield();
		field1.setFieldname(object2.getObjectname());
		field1.setFieldtitle(object2.getTitle());
		field1.setFielddbname(objectfield1.getFielddbname());
		field1.setFieldrelation("ManyToMany");
		field1.setFieldtype("Set<" + object2.getObjectname() + ">");
		field1.setJointable(linkedobject.getObjectname());
		field1.setJoincolumnname(objectfield2.getFielddbname());
		field1.setFieldgroup("多对多组");
		field1.setOrderno(10);
		field1.setFDataobject(object1);
		field1.setCreater(userid == null ? Local.getCreater() : userid);
		field1.setCreatedate(new Timestamp(new Date().getTime()));
		dao.save(field1);
		object1.getFDataobjectfields().add(field1);

		// 从表增加字段
		FDataobjectfield field2 = new FDataobjectfield();
		field2.setFieldname(object1.getObjectname());
		field2.setFieldtitle(object1.getTitle());
		field2.setFielddbname(objectfield2.getFielddbname());
		field2.setFieldrelation("ManyToMany");
		field2.setFieldtype("Set<" + object1.getObjectname() + ">");
		field2.setFieldgroup("多对多组");
		field2.setJointable(linkedobject.getObjectname());
		field2.setJoincolumnname(objectfield1.getFielddbname());
		field2.setOrderno(10);
		field2.setCreater(userid == null ? Local.getCreater() : userid);
		field2.setCreatedate(new Timestamp(new Date().getTime()));
		field2.setFDataobject(object2);
		dao.save(field2);
		object2.getFDataobjectfields().add(field2);
		return new ActionResult();
	}

	/**
	 * 根据二个type 来生成manytomany
	 * 
	 * @param fieldtype1
	 * @param fieldtype2
	 * @param linkedobjectid
	 * @param userid
	 * @return
	 */
	public ActionResult createManyToManyFieldWithType(String fieldtype1, String fieldtype2, String linkedobjectid,
			String userid) {

		FDataobject object1 = DataObjectUtils.getDataObject(fieldtype1);
		FDataobject object2 = DataObjectUtils.getDataObject(fieldtype2);
		FDataobject linkedobject = dao.findById(FDataobject.class, linkedobjectid);

		FDataobjectfield field1 = new FDataobjectfield();
		field1.setFieldname(fieldtype2 + "s");
		field1.setFieldtitle(object2.getTitle());
		field1.setFieldrelation(FDataobjectfield.MANYTOMANY);
		field1.setFieldtype("Set<" + object2.getObjectname() + ">");
		field1.setFieldgroup("多对多组");
		field1.setJointable(linkedobject.getObjectname());
		field1.setOrderno(10);
		field1.setCreater(userid == null ? Local.getUserid() : userid);
		field1.setCreatedate(new Timestamp(new Date().getTime()));
		field1.setFDataobject(object1);
		dao.save(field1);
		object1.getFDataobjectfields().add(field1);

		FDataobjectfield field2 = new FDataobjectfield();
		field2.setFieldname(fieldtype1 + "s");
		field2.setFieldtitle(object1.getTitle());
		field2.setFieldrelation(FDataobjectfield.MANYTOMANY);
		field2.setFieldtype("Set<" + object1.getObjectname() + ">");
		field2.setFieldgroup("多对多组");
		field2.setJointable(linkedobject.getObjectname());
		field2.setOrderno(10);
		field2.setCreater(userid == null ? Local.getUserid() : userid);
		field2.setCreatedate(new Timestamp(new Date().getTime()));
		field2.setFDataobject(object2);
		dao.save(field2);
		object2.getFDataobjectfields().add(field2);

		return new ActionResult();
	}

	public ActionResult createOneToManyField(String fieldid) {
		FDataobjectfield objectfield = dao.findById(FDataobjectfield.class, fieldid);
		FDataobject oneobject = DataObjectUtils.getDataObject(objectfield.getFieldtype());
		FDataobject manyobject = objectfield.getFDataobject();
		FDataobjectfield onetomanyfield = new FDataobjectfield();
		onetomanyfield.setFDataobject(oneobject);
		onetomanyfield.setCreatedate(com.jhopesoft.framework.utils.DateUtils.getTimestamp());
		onetomanyfield.setCreater(Local.getUserid());
		onetomanyfield.setFieldrelation(FDataobjectfield.ONETOMANY);
		onetomanyfield.setJointable(manyobject.getTablename());
		onetomanyfield.setJoincolumnname(objectfield.getJoincolumnname());
		onetomanyfield.setFieldtitle(objectfield.getFieldtitle() + "的" + manyobject.getTitle());
		onetomanyfield.setFieldlen(0);
		onetomanyfield.setFieldtype("Set<" + manyobject.getObjectname() + ">");
		onetomanyfield.setFieldgroup("一对多组");
		// 不会没找到，关联模块没有导入，不允许先导入下面的
		// if (joinedobject == null) joinedobject = save(f.getJointable());

		if (oneobject._getPrimaryKeyField()._getSelectName(null).equals(objectfield.getJoincolumnname())) { // 如果关联字段和父模块主键字段是一样的
			onetomanyfield.setFieldname(manyobject.getObjectname() + "s");
		} else {
			// 如果关联字段和主键字段是不一样的。例如：U_Orders: fromcityid 关联 U_City的
			// cityid,那么字段名为：
			// UCityByFromcityid
			onetomanyfield.setFieldname(
					manyobject.getObjectname() + "By" + objectfield.getJoincolumnname().substring(0, 1).toUpperCase()
							+ objectfield.getJoincolumnname().substring(1) + "s");
		}
		onetomanyfield.setFieldahead(manyobject.getObjectname() + ".with." + objectfield.getFieldname());
		// System.out.println(onetomanyfield.getFieldtitle() + " " +
		// onetomanyfield.getFieldname());
		dao.save(onetomanyfield);
		oneobject.getFDataobjectfields().add(onetomanyfield);
		return new ActionResult();
	}

	/**
	 * 如果fieldid的字段是manytoone或者数据字典，则取得combodata后返回数据，否则返回null
	 * 
	 * @param fieldid
	 * @return
	 */
	public List<ValueText> getFieldComboData(String fieldid) {
		FDataobjectfield field = dao.findById(FDataobjectfield.class, fieldid);
		if (field != null) {
			if (field._isManyToOne())
				return dataObjectService.fetchModuleComboData(field.getFieldtype(), false, null, null);
			else if (field.getFDictionary() != null) {
				return dictionaryService.getDictionaryComboData(field.getFDictionary().getDictionaryid(), Local.getRequest());
			} else {
				if (field.getFDataobject().getPrimarykey().equals(field.getFieldname())) {
					// 如果是一个模块的主键，那么也加入所有的combodata
					return dataObjectService.fetchModuleComboData(field.getFDataobject().getObjectname(), false, null, null);
				}
			}
		}
		return null;
	}

	public ActionResult testAdditionField(String additionFieldId) {
		ActionResult result = new ActionResult();
		FAdditionfield field = dao.findById(FAdditionfield.class, additionFieldId);
		result.setMsg(field._getConditionText());
		FDataobject dataobject = field.getFDataobject();

		SqlGenerate generate = new SqlGenerate();
		generate.setDataobject(dataobject);
		generate.disableAllBaseFields();
		generate.pretreatment();

		SqlField sqlfield = new SqlField("testfield", SqlFieldUtils.generateSqlFormJsonFieldString(generate.getBaseModule(),
				null, field._getConditionExpression(), false), null);
		generate.getSelectfields().add(sqlfield);

		String sql = generate.generateSelect();
		String[] fields = generate.getFieldNames();
		Dao dao = Local.getBusinessDao();
		try {
			dao.executeSQLQueryPage(sql, fields, 1, 1, 1, new Object[] {});
		} catch (Exception e) {
			throw new RuntimeException(result.getMsg().toString());
		}
		return result;
	}
}
