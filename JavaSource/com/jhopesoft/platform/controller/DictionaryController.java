package com.jhopesoft.platform.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jhopesoft.framework.bean.ValueText;
import com.jhopesoft.framework.dao.entity.dictionary.FDictionary;
import com.jhopesoft.platform.service.DictionaryService;

/**
 * 数据字典操作的控制类
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/dictionary")
public class DictionaryController {

	@Resource
	private DictionaryService dictionaryService;

	@RequestMapping(value = "/getdictionary")
	public @ResponseBody FDictionary getDictionary(String id) {
		return dictionaryService.getDictionary(id);
	}

	@RequestMapping(value = "/getDictionaryComboData")
	public @ResponseBody List<ValueText> getDictionaryComboData(String dictionaryId, HttpServletRequest request) {
		return dictionaryService.getDictionaryComboData(dictionaryId, request);
	}

	@RequestMapping(value = "/getPropertyComboData")
	public @ResponseBody List<ValueText> getPropertyComboData(String propertyId, String targetFieldId) {
		return dictionaryService.getPropertyComboData(propertyId, targetFieldId);
	}

}
