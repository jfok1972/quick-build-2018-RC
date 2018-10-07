package com.jhopesoft.platform.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.FileUploadBean;
import com.jhopesoft.framework.bean.Name;
import com.jhopesoft.framework.bean.ValueText;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.utils.CommonFunction;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.ExcelUtils;

@Service
public class DataImportService {

	@Autowired
	private DataObjectService dataObjectService;

	public JSONArray getManyToOneIds(String objectid, List<Name> names) {
		JSONArray result = new JSONArray();
		FDataobject object = DataObjectUtils.getDataObject(objectid);
		// 所有的id,name
		List<ValueText> valueTexts = dataObjectService.fetchModuleComboData(object.getObjectid(), false, null, null);
		Map<String, ValueText> allkey = new HashMap<String, ValueText>();
		for (ValueText vt : valueTexts) {
			allkey.put(vt.getValue(), vt);
		}
		// 如果有名称和id相同的情况，那么名称优先
		for (ValueText vt : valueTexts) {
			allkey.put(vt.getText(), vt);
		}
		valueTexts = null;
		for (Name name : names) {
			JSONObject jsonobject = new JSONObject();
			jsonobject.put("name", name.getName());
			if (allkey.containsKey(name.getName())) {
				jsonobject.put("id", allkey.get(name.getName()).getValue());
				if (!name.getName().equals(allkey.get(name.getName()).getText()))
					jsonobject.put("realname", allkey.get(name.getName()).getText());
				result.add(jsonobject);
			} else {
				// 没有在id或name中找到，在name like '%name%'中找
				valueTexts = dataObjectService.fetchModuleComboData(object.getObjectid(), false, name.getName(), null);
				if (valueTexts.size() == 0) {
					jsonobject.put("message", "“" + name.getName() + "”不存在");
				} else if (valueTexts.size() == 1) {
					jsonobject.put("id", valueTexts.get(0).getValue());
					jsonobject.put("realname", valueTexts.get(0).getText());
				} else {
					jsonobject.put("message", "“" + name.getName() + "”找到多个类似的名称！");
				}
				result.add(jsonobject);
			}
		}
		return result;
	}

	public ActionResult saveFieldsSetting(List<String> fields) {
		ActionResult result = new ActionResult();
		if (fields.size() == 0)
			return result;
		String[] part = fields.get(0).split(",");
		FDataobjectfield field = Local.getDao().findById(FDataobjectfield.class, part[0]);
		FDataobject object = field.getFDataobject();
		for (FDataobjectfield afield : object.getFDataobjectfields()) {
			if (afield.getImportfieldorderno() != null && afield.getImportfieldorderno() != 0) {
				afield.setImportfieldorderno(null);
				Local.getDao().update(afield);
			}
		}
		int i = 1;
		for (String s : fields) {
			part = s.split(",");
			field = Local.getDao().findById(FDataobjectfield.class, part[0]);
			if ("true".equals(part[1])) // 隐藏的，保存负数
				field.setImportfieldorderno(0 - i);
			else
				field.setImportfieldorderno(i);
			Local.getDao().update(field);
			i++;
		}
		return result;
	}

	public void downloadTemplate(String objectid, List<String> fields) throws IOException {
		FDataobject object = DataObjectUtils.getDataObject(objectid);
		// 判断当前的方案是不是和数据库里的一致，如果不一致，就更新到一致。
		int i = 1;
		boolean needsave = false;
		for (String s : fields) {
			String[] part = s.split(",");
			FDataobjectfield field = object._getModuleFieldByFieldId(part[0]);
			if (field.getImportfieldorderno() == null) {
				needsave = true;
				break;
			}
			if ("true".equals(part[1])) {
				if (field.getImportfieldorderno() != 0 - i) {
					needsave = true;
					break;
				}
			} else {
				if (field.getImportfieldorderno() != i) {
					needsave = true;
					break;
				}
			}
			i++;
		}
		if (needsave) // 如果当前的数据新增方案和系统里保存的不一样，就保存一下。
			saveFieldsSetting(fields);
		List<FDataobjectfield> objectfields = new ArrayList<FDataobjectfield>();
		for (String s : fields) {
			String[] part = s.split(",");
			if (!"true".equals(part[1]))
				objectfields.add(object._getModuleFieldByFieldId(part[0]));
		}
		String filename = object.getTitle() + " 数据导入模板";
		XSSFWorkbook workbook = new XSSFWorkbook();
		workbook.createSheet();
		workbook.setSheetName(0, filename);
		int rownumber = 0;
		XSSFSheet sheet = workbook.getSheetAt(0);
		XSSFCellStyle style2 = workbook.createCellStyle();
		style2.setLocked(true);
		style2.setAlignment(HorizontalAlignment.CENTER);
		style2.setVerticalAlignment(VerticalAlignment.CENTER);
		style2.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		style2.setFillForegroundColor(new XSSFColor(new java.awt.Color(0xcd, 0xe6, 0xc7)));
		XSSFFont font = workbook.createFont();
		font.setFontHeightInPoints((short) 20);
		style2.setFont(font);
		sheet.addMergedRegion(new CellRangeAddress(rownumber, rownumber, 0, objectfields.size() - 1));
		XSSFRow row = sheet.createRow(rownumber++);
		XSSFCell schemenamecell = row.createCell(0);
		schemenamecell.setCellStyle(style2);
		schemenamecell.setCellValue(object.getTitle());

		// 写入单位名称，用户名，当前导出日期
		sheet.addMergedRegion(new CellRangeAddress(rownumber, rownumber, 0, objectfields.size() - 1));
		row = sheet.createRow(rownumber++);
		row.setHeightInPoints((short) 20);
		XSSFCell cell = row.createCell(0);
		cell.setCellValue("单位名称:" + Local.getUserBean().getCompanyname() + "--" + Local.getUsername());
		XSSFCellStyle style = workbook.createCellStyle();
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		style.setFillForegroundColor(new XSSFColor(new java.awt.Color(0xcd, 0xe6, 0xc7)));
		cell.setCellStyle(style);

		XSSFCellStyle btXSSFCellStyle = workbook.createCellStyle();
		btXSSFCellStyle.setWrapText(true); // 文字可以换行用\n
		btXSSFCellStyle.setAlignment(HorizontalAlignment.CENTER);
		btXSSFCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

		btXSSFCellStyle.setBorderTop(BorderStyle.THIN);
		btXSSFCellStyle.setBorderBottom(BorderStyle.THIN);
		btXSSFCellStyle.setBorderLeft(BorderStyle.THIN);
		btXSSFCellStyle.setBorderRight(BorderStyle.THIN);

		// 所有的可导入的字段
		XSSFFont dataFont = workbook.createFont();
		dataFont.setFontHeightInPoints((short) 9);
		dataFont.setFontName("宋体");
		btXSSFCellStyle.setFont(dataFont);
		btXSSFCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		btXSSFCellStyle.setFillForegroundColor(new XSSFColor(new java.awt.Color(0xaf, 0xdf, 0xec)));

		// 加入注意事项
		sheet.addMergedRegion(new CellRangeAddress(rownumber, rownumber, 0, objectfields.size() - 1));
		row = sheet.createRow(rownumber++);
		row.setHeightInPoints((short) 120);
		XSSFCell info = row.createCell(0);

		XSSFCellStyle style1 = workbook.createCellStyle();
		style1.setAlignment(HorizontalAlignment.LEFT);
		style1.setVerticalAlignment(VerticalAlignment.CENTER);
		style1.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		style1.setFillForegroundColor(new XSSFColor(new java.awt.Color(0xbc, 0xc0, 0xbb)));
		style1.setWrapText(true);
		info.setCellStyle(style1);
		info.setCellValue("注意事项：\n" + "1.请不要增加、删除或移动任何列；列宽、行高可以调整；不要修改前4行的表头部分。\n"
				+ "2.从第5行开始依次填入增加的数据，不要有空行；最好不要加入单元格式，按照默认的格式。\n" + "3.金额和浮点数据不要加前缀和分隔符;百分比为小数;布尔值写1,0或true,false;图片数据不能导入。\n"
				+ "4.日期要写全4位年份、2位月份和日期，格式为yyyy-mm-dd或yyyy/mm/dd。\n" + "5.可以使用数值函数；每次导入的记录数不要太多。");
		XSSFRow detail = sheet.createRow(rownumber++);
		for (i = 0; i <= objectfields.size() - 1; i++) {
			XSSFCell unitcell = detail.createCell(i);
			unitcell.setCellStyle(btXSSFCellStyle);
			unitcell.setCellValue(objectfields.get(i).getFieldtitle());
		}
		OutputStream fopts = new ByteArrayOutputStream();
		workbook.write(fopts);
		workbook.close();
		CommonFunction.download(fopts, filename + ".xlsx", Local.getResponse());

	}

	public ActionResult upload(FileUploadBean uploaditem, BindingResult bindingResult) throws IOException {
		ActionResult result = new ActionResult();
		MultipartFile file = uploaditem.getFile();
		FDataobject dataobject = DataObjectUtils.getDataObject(uploaditem.getObjectid());
		// 生成fdataobject的导入数据的字段列表。
		List<FDataobjectfield> fields = new ArrayList<FDataobjectfield>();
		for (FDataobjectfield field : dataobject.getFDataobjectfields()) {
			if (field.getImportfieldorderno() != null && field.getImportfieldorderno() > 0)
				fields.add(field); // 加入了所有的可导入字段
		}
		Collections.sort(fields, new Comparator<FDataobjectfield>() {
			public int compare(FDataobjectfield o1, FDataobjectfield o2) {
				if (o1.getImportfieldorderno() > o2.getImportfieldorderno())
					return 1;
				else
					return -1;
			}
		});
		List<String> fieldnames = new ArrayList<String>();
		for (FDataobjectfield field : fields) {
			String fn = field.getFieldname();
			if (field._isManyToOne() || field._isOneToOne()) {
				FDataobject manyobject = DataObjectUtils.getDataObject(field.getFieldtype());
				if (manyobject != null)
					fn = fn + "." + manyobject._getNameField().getFieldname();
			}
			fieldnames.add(fn);
		}
		SimpleDateFormat dformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		XSSFWorkbook workbook = ExcelUtils.createNewExcel(file.getInputStream());
		JSONArray array = new JSONArray();
		Sheet sheet = workbook.getSheetAt(0);
		int rowNum = sheet.getLastRowNum();// 获得总行数
		DataFormatter formatter = new DataFormatter(); // 用这个可读取文本，数值的单元格
		FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
		for (int row = 4; row < rowNum + 1; row++) { // 第五行开始是数据
			XSSFRow arow = (XSSFRow) sheet.getRow(row);
			if (arow != null) {
				JSONObject jsonobject = new JSONObject();
				for (int col = 0; col < Math.min(fieldnames.size(), arow.getLastCellNum()); col++) {
					Cell cell = arow.getCell(col);
					if (cell == null)
						continue;
					if (cell.getCellTypeEnum() == CellType.NUMERIC) {
						if (HSSFDateUtil.isCellDateFormatted(cell)) { // 日期型
							Date date = HSSFDateUtil.getJavaDate(cell.getNumericCellValue());
							jsonobject.put(fieldnames.get(col), dformat.format(date));
						} else // 数值型
							jsonobject.put(fieldnames.get(col), cell.getNumericCellValue());
					} else if (cell.getCellTypeEnum() == CellType.FORMULA) { // 函数
						jsonobject.put(fieldnames.get(col), getCellValue(evaluator.evaluate(cell)));
					} else {
						String strValue = formatter.formatCellValue(cell);
						jsonobject.put(fieldnames.get(col), strValue);
					}
				}
				array.add(jsonobject);
			}
		}
		result.setTag(array);
		return result;
	}

	private static Object getCellValue(CellValue cell) {
		Object cellValue = cell.getStringValue();
		if (cell.getCellTypeEnum() == CellType.STRING)
			cellValue = cell.getStringValue();
		else if (cell.getCellTypeEnum() == CellType.NUMERIC)
			cellValue = cell.getNumberValue();
		return cellValue;
	}

}
