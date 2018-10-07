package com.jhopesoft.platform.logic;

import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.annotation.Module.Type;

/**
 * 
 * @author jiangfeng
 *
 */
@Module("All")
public class AllLogic {

	@Module(type = Type.saveOrUpdate)
	public void saveOrUpdate(StringBuffer inserted, String oldid, String opertype) {
		Map<String, Object> dataMap = JSON.parseObject(inserted.toString());
		String[] keys = dataMap.keySet().toArray(new String[] {});
		for (int i = 0; i < keys.length; i++) {
			String key = keys[i];
			if (key.indexOf(".") > 0) {
				String[] strs = key.split("[.]");
				if (strs[0].equals(strs[1])) {
					dataMap.put(strs[0], dataMap.get(key));
					dataMap.remove(key);
				}
			}
		}
		inserted.setLength(0);
		inserted.append(JSON.toJSONString(dataMap, SerializerFeature.WriteMapNullValue));
	}
}
