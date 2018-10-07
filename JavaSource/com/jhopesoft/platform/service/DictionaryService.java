package com.jhopesoft.platform.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.jhopesoft.framework.bean.PageInfo;
import com.jhopesoft.framework.bean.ValueText;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.core.objectquery.sqlfield.ColumnField;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.dictionary.FDictionary;
import com.jhopesoft.framework.dao.entity.dictionary.FDictionarydetail;
import com.jhopesoft.framework.dao.entity.dictionary.FObjectfieldproperty;

@Service
public class DictionaryService {

	@Resource
	private DaoImpl systemBaseDAO;

	// 加在数据据字典上的权限没有。要加的话，这里需要重新组织。
	@Transactional(readOnly = true)
	public List<ValueText> getDictionaryComboData(String dictionaryId, HttpServletRequest request) {
		List<ValueText> result = new ArrayList<ValueText>();
		FDictionary dictionary = systemBaseDAO.findById(FDictionary.class, dictionaryId);
		for (FDictionarydetail detail : dictionary.getFDictionarydetails()) {
			String value = dictionary.getIslinkedkey() ? detail.getDdetailid()
					: (dictionary.getIslinkedorderno() ? detail.getOrderno()
							: (dictionary.getIslinkedcode() ? detail.getVcode() : detail.getTitle()));
			// 要不要显示编码
			String text = (dictionary.getIsdisplayorderno() ? detail.getOrderno() + "-" : "")
					+ (dictionary.getIsdisplaycode() ? detail.getVcode() + "-" : "") + detail.getTitle();
			ValueText vt = new ValueText(value, text);
			result.add(vt);
		}
		return result;
	}

	public FDictionary getDictionary(String id) {
		FDictionary dictionary = systemBaseDAO.findById(FDictionary.class, id);
		if (dictionary == null)
			dictionary = systemBaseDAO.findByPropertyFirst(FDictionary.class, "dcode", id);
		return dictionary;
	}

	/**
	 * 字段属性值的取得
	 * 
	 * @param propertyId
	 * @return
	 */
	public List<ValueText> getPropertyComboData(String propertyId, String targetFieldId) {
		FObjectfieldproperty objectfieldproperty = systemBaseDAO.findById(FObjectfieldproperty.class, propertyId);
		if (objectfieldproperty == null)
			return null;
		List<ValueText> result = new ArrayList<ValueText>();
		if (objectfieldproperty.getValue() != null && objectfieldproperty.getValue().length() > 0) {
			String[] parts = objectfieldproperty.getValue().split(",");
			for (String s : parts) {
				result.add(new ValueText(null, s));
			}
		}
		if (objectfieldproperty.getAddtargetfieldvalue()) {
			for (String s : getFieldDistinctValue(systemBaseDAO.findById(FDataobjectfield.class, targetFieldId)))
				result.add(new ValueText(null, s));
		}

		if (objectfieldproperty.getFieldid() != null) {
			FDataobjectfield field = systemBaseDAO.findById(FDataobjectfield.class, objectfieldproperty.getFieldid());
			if (field != null)
				for (String s : getFieldDistinctValue(field))
					result.add(new ValueText(null, s));
		}

		Set<String> setString = new LinkedHashSet<String>();
		for (ValueText v : result) {
			setString.add(v.getText());
		}
		result.clear();
		for (String s : setString) {
			result.add(new ValueText(null, s));
		}

		return result;
	}

	public List<String> getFieldDistinctValue(FDataobjectfield field) {
		FDataobject object = field.getFDataobject();
		SqlGenerate generate = new SqlGenerate();
		generate.setDataobject(object);
		generate.setDistinct(true);
		generate.disableAllBaseFields();
		ColumnField columnField = new ColumnField();
		columnField.setFDataobjectfield(field);
		Set<ColumnField> columnFields = new HashSet<ColumnField>();
		columnFields.add(columnField);
		generate.setColumnFields(columnFields);
		generate.pretreatment();
		String sql = generate.generateSelect();
		String[] fields = generate.getFieldNames();
		PageInfo<Map<String, Object>> sqlresult = systemBaseDAO.executeSQLQueryPage(sql, fields, 0, Integer.MAX_VALUE,
				Integer.MAX_VALUE, new Object[] {});
		List<Map<String, Object>> values = sqlresult.getData();
		List<String> result = new ArrayList<String>();
		for (Map<String, Object> o : values) {
			if (o.get(fields[0]) != null)
				result.add(o.get(fields[0]).toString());
		}
		return result;
	}

}
