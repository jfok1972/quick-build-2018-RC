package com.jhopesoft.framework.utils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.Table;

import com.alibaba.fastjson.JSON;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

public class EntityUtils {

	public static <T> Map<String, Object> toEntityBean(String inserted, Class<T> clazz) {
		List<String> includes = new ArrayList<String>();
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, Object> map = JSON.parseObject(inserted);
		Map<String, Object> dataMap = new HashMap<String, Object>();
		for (String key : map.keySet()) {
			String[] strs = key.split("[.]");
			if (strs.length > 2)
				continue;
			Object obj = map.get(key);
			if (strs.length == 1) {
				dataMap.put(key, obj);
				includes.add(key);
			} else {
				includes.add(strs[0]);
				Map<String, Object> parentMap = new HashMap<String, Object>();
				String fieldname = strs[1];
				if (CommonUtils.isEmpty(obj)) {
					dataMap.put(strs[0], null);
				} else {
					if (fieldname.indexOf("_") != -1) {
						parentMap.put(CamelCaseUtils.getEntityBeanField(fieldname), obj);
					} else {
						parentMap.put(fieldname, obj);
					}
					dataMap.put(strs[0], parentMap);
				}
			}
		}
		result.put("bean", JSON.parseObject(JSON.toJSONString(dataMap), clazz));
		result.put("includes", includes);
		return result;
	}

	/**
	 * 通过实体对象获取字段的关联信息
	 * 
	 * @param clazz
	 * @return
	 */
	public static Map<String, FDataobjectfield> getEntityField(Class<?> clazz) {
		Map<String, FDataobjectfield> resultMap = new HashMap<String, FDataobjectfield>();
		Map<String, Field> fieldMap = new HashMap<String, Field>();
		Field[] fields = clazz.getDeclaredFields();
		for (int i = 0; i < fields.length; i++) {
			String fieldname = fields[i].getName();
			if (fieldname.equals("serialVersionUID"))
				continue;
			fieldMap.put(fieldname.toLowerCase(), fields[i]);
		}
		Method[] methods = clazz.getMethods();
		for (int i = 0; i < methods.length; i++) {
			Method method = methods[i];
			String name = method.getName();
			String fielddbname = null;
			if (name.startsWith("get")) {
				Column column = method.getAnnotation(Column.class);
				JoinColumn joincolumn = method.getAnnotation(JoinColumn.class);
				if (column == null && joincolumn == null)
					continue;
				FDataobjectfield objectfield = new FDataobjectfield();
				if (column != null) {// 普通字段
					fielddbname = column.name();
					if (CommonUtils.isEmpty(fielddbname)) {
						fielddbname = name.replace("get", "");
					}
					Field field = fieldMap.get(fielddbname.toLowerCase().replaceAll("_", ""));
					if (field == null)
						continue;
					objectfield.setIsrequired(!column.nullable());
					objectfield.setFielddbname(fielddbname); // 数据库字段
					objectfield.setFieldname(field.getName()); // 实体对象字段
					if (!resultMap.containsKey(fielddbname.toLowerCase())) // 可能manytoone和关联字段都有，那么就只加入manytoone的
						resultMap.put(fielddbname.toLowerCase(), objectfield);
				}
				if (joincolumn != null) { // 级联字段
					fielddbname = joincolumn.name();
					Field field = fieldMap.get(name.replace("get", "").toLowerCase());
					if (field == null)
						continue;
					Class<?> c = method.getReturnType();
					Table table = (Table) c.getAnnotation(Table.class);
					objectfield.setIsrequired(!joincolumn.nullable());
					objectfield.setFielddbname(fielddbname); // 数据库字段
					objectfield.setFieldrelation("ManyToOne"); // 多对一关系
					objectfield.setJointable(table.name()); // 关联表名称
					objectfield.setFieldtype(c.getSimpleName()); // 字段类型
					objectfield.setFieldname(field.getName()); // 实体对象字段
					objectfield.setJoincolumnname(fielddbname);
					resultMap.put(fielddbname.toLowerCase(), objectfield);
				}
			}
		}
		return resultMap;
	}

	public static void main(String[] args) {
		Class<?> clazz = FDataobject.class;
		Map<String, FDataobjectfield> fieldMap = getEntityField(clazz);
		for (String key : fieldMap.keySet()) {
			FDataobjectfield field = fieldMap.get(key);
			System.out.println("FieldName： " + field.getFieldname() + "\t FieldDbName：" + field.getFielddbname()
					+ "\t FieldRelation:" + field.getFieldrelation() + "\t JoinTable:" + field.getJointable() + "\t FieldType:"
					+ field.getFieldtype() + "\t JoinColumnName:" + field.getJoincolumnname());
		}
	}
}
