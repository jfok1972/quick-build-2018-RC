package com.jhopesoft.platform.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.CellCopyPolicy;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.GridParams;
import com.jhopesoft.framework.bean.GroupParameter;
import com.jhopesoft.framework.bean.SortParameter;
import com.jhopesoft.framework.core.objectquery.export.ExcelColumn;
import com.jhopesoft.framework.core.objectquery.export.ExcelExport;
import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserNavigateFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserParentFilter;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.attachment.FDataobjectattachment;
import com.jhopesoft.framework.dao.entity.datainorout.FRecordexcelscheme;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectview;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridsortscheme;
import com.jhopesoft.framework.utils.CommonFunction;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.ExcelUtils;
import com.jhopesoft.framework.utils.FieldTemplateTranslateUtils;
import com.jhopesoft.framework.utils.PdfUtils;
import com.jhopesoft.framework.utils.WordUtils;

@Service
public class DataExportService {

	@Autowired
	private DataObjectService dataObjectService;

	@Autowired
	private DaoImpl dao;

	@Autowired
	private AttachmentService attachmentService;

	public OutputStream generateExcelorPDF(String moduleName, GridParams pg, List<ExcelColumn> exportColumns,
			List<SortParameter> sort, GroupParameter group, List<UserDefineFilter> query, List<UserDefineFilter> filter,
			List<UserNavigateFilter> navigates, List<UserParentFilter> userParentFilters, List<UserDefineFilter> conditions,
			FDataobjectview viewscheme, FovGridsortscheme sortscheme, JSONObject sqlparam, boolean colorless,
			boolean usemonetary, Integer monetaryUnit, String monetaryText, boolean sumless) {

		ExcelColumn[] cs = new ExcelColumn[exportColumns.size()];

		for (int i = 0; i < exportColumns.size(); i++)
			cs[i] = exportColumns.get(i);
		JSONObject rowCountJson = new JSONObject();
		rowCountJson.put("rowCount", 0);

		ExcelColumn.setColRowSize(cs, 0, 0, rowCountJson);

		ExcelColumn.setAllLastRow(cs, rowCountJson.getIntValue("rowCount"));

		List<ExcelColumn> dataIndexColumns = new ArrayList<ExcelColumn>();
		ExcelColumn.genAllDataIndexColumns(cs, dataIndexColumns);

		List<ExcelColumn> allColumns = new ArrayList<ExcelColumn>();
		ExcelColumn.genAllColumns(cs, allColumns);

		Integer rowCount = rowCountJson.getIntValue("rowCount") + 1;
		Integer colCount = dataIndexColumns.size();

		List<?> resultList = dataObjectService.fetchDataInner(moduleName, pg, null, group, sort, query, filter, navigates,
				userParentFilters, viewscheme, sortscheme, sqlparam).getData();
		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		return new ExcelExport(colorless, usemonetary, monetaryUnit, monetaryText, sumless).GenExcel(module, conditions,
				resultList, group, null, rowCount, colCount, allColumns, dataIndexColumns);

	}

	public void exportExcelScheme(String objectid, String schemeid, String recordids, String filetype, boolean inline)
			throws Exception {
		FRecordexcelscheme scheme = dao.findById(FRecordexcelscheme.class, schemeid);
		FDataobject dataobject = scheme.getFDataobject();
		FDataobject excelSchemeobject = DataObjectUtils.getDataObject(FRecordexcelscheme.class.getSimpleName());

		FDataobjectattachment attachment = dao.findByPropertyFirst(FDataobjectattachment.class, "objectid",
				excelSchemeobject.getObjectid(), "idvalue", schemeid);
		if (attachment == null) {
			CommonFunction.downloadFileError(Local.getResponse(), "没有找到当前方案的附件文件!", null);
			return;
		}
		String ids[];
		if (BooleanUtils.isTrue(scheme.getAllowrecords())) {
			ids = recordids.split(",");
		} else {
			ids = new String[] { recordids.split(",")[0] };
		}
		FDataobject recordObject = DataObjectUtils.getDataObject(objectid);
		Map<String, Object> recordMap = dataObjectService.getObjectRecordMap(objectid, ids[0]);
		String recordtitle = recordMap.get(dataobject.getNamefield()).toString();
		Object record = null;
		if (StringUtils.isNotBlank(recordObject.getClassname())) {
			Class<?> objectClass = Class.forName(recordObject.getClassname());
			record = dao.findById(objectClass, ids[0]);
		}
		String filename = recordtitle + "--" + attachment.getFilename();
		// 原始上传文件流
		InputStream inputStream = attachmentService.getOriginalFileStream(attachment);

		if (attachment.getSuffixname().equalsIgnoreCase("xlsx")) {
			// excel文件
			XSSFWorkbook excelDocument = ExcelUtils.createNewExcel(inputStream);
			// excelDocument.setSheetName(0, recordtitle);
			// ExcelUtils.replace(excelDocument.getSheetAt(0), record, recordMap);

			if (BooleanUtils.isTrue(scheme.getMultisheet()))
				createExcelSheets(recordObject, ids, excelDocument);
			else
				createOneByOne(recordObject, ids, excelDocument, scheme);

			OutputStream fopts = new ByteArrayOutputStream();
			excelDocument.write(fopts);

			if (ids.length > 1)
				filename = recordtitle + "等" + ids.length + "条--" + attachment.getFilename();

			if (filetype != null && filetype.equals("pdf")) {
				ByteArrayOutputStream pdfos = new ByteArrayOutputStream();
				InputStream inputstream = new ByteArrayInputStream(((ByteArrayOutputStream) fopts).toByteArray());
				PdfUtils.convert(inputstream, pdfos, "xlsx", "pdf");
				if (inline)
					CommonFunction.downloadAndOpenPdf(pdfos, filename.replace(".xlsx", ".pdf"), Local.getResponse());
				else
					CommonFunction.download(pdfos, filename.replace(".xlsx", ".pdf"), Local.getResponse());
			} else
				CommonFunction.download(fopts, filename, Local.getResponse());
		} else {
			// word文件,只能第一条记录
			XWPFDocument wordDocument = WordUtils.createNewWord(inputStream);
			Set<String> templateWord = WordUtils.getAllTemplateWord(wordDocument);
			Map<String, Object> param = new HashMap<String, Object>();
			for (String key : templateWord) {
				String value = FieldTemplateTranslateUtils.getStringValue(key, record, recordMap, dataobject);
				if (value.equals(FieldTemplateTranslateUtils.NOSUCHPROPERTY))
					continue;
				param.put(key, value);
			}
			WordUtils.replace(wordDocument, param);
			OutputStream fopts = new ByteArrayOutputStream();
			wordDocument.write(fopts);
			if (filetype != null && filetype.equals("pdf")) {
				ByteArrayOutputStream pdfos = new ByteArrayOutputStream();
				InputStream inputstream = new ByteArrayInputStream(((ByteArrayOutputStream) fopts).toByteArray());
				PdfUtils.convert(inputstream, pdfos, "docx", "pdf");
				if (inline)
					CommonFunction.downloadAndOpenPdf(pdfos, filename.replace(".docx", ".pdf"), Local.getResponse());
				else
					CommonFunction.download(pdfos, filename.replace(".docx", ".pdf"), Local.getResponse());
			} else
				CommonFunction.download(fopts, filename, Local.getResponse());
		}
	}

	/**
	 * 多个记录顺序写入的功能，比如说公司人员登录表，多选的人员都放在一起。 从 start开始，到end结束的行 每一个记录都复制一份，然后再写入数据
	 * 如果没有设置，那么从头至尾，都复制一份
	 */

	public void createOneByOne(FDataobject dataobject, String ids[], XSSFWorkbook excelDocument,
			FRecordexcelscheme scheme) throws Exception {
		XSSFSheet sheet = excelDocument.getSheetAt(0);
		int modelRow = sheet.getLastRowNum();
		for (int i = 1; i < ids.length; i++) {
			String recordid = ids[i];
			Map<String, Object> recordMap = dataObjectService.getObjectRecordMap(dataobject.getObjectid(), recordid);
			Object record = null;
			if (StringUtils.isNotBlank(dataobject.getClassname())) {
				Class<?> objectClass = Class.forName(dataobject.getClassname());
				record = dao.findById(objectClass, recordid);
			}
			// 重新把0-allrow,复制一份，然后 从第1个开始 添入数据
			int firstRow = sheet.getLastRowNum() + 1;
			sheet.copyRows(scheme.getStartrow() == null ? 0 : scheme.getStartrow(), modelRow, firstRow, new CellCopyPolicy());
			ExcelUtils.replace(sheet, record, recordMap, firstRow, dataobject);
		}
		// 加入第一个
		String recordid = ids[0];
		Map<String, Object> recordMap = dataObjectService.getObjectRecordMap(dataobject.getObjectid(), recordid);
		Object record = null;
		if (StringUtils.isNotBlank(dataobject.getClassname())) {
			Class<?> objectClass = Class.forName(dataobject.getClassname());
			record = dao.findById(objectClass, recordid);
		}
		sheet.createRow(sheet.getLastRowNum() + 1); // 如果有onetomany会删掉最后一行，因此最后加上一行
		ExcelUtils.replace(sheet, record, recordMap, 0, dataobject);

		// 取消所有model部分单元的合并
		// List<Integer> removed = new ArrayList<Integer>();
		// int sheetMergeCount = sheet.getNumMergedRegions();
		// for (int i = 0; i < sheetMergeCount; i++) {
		// CellRangeAddress range = sheet.getMergedRegion(i);
		// if (range.getFirstRow() <= modelRow) {
		// removed.add(i);
		// }
		// }
		// sheet.removeMergedRegions(removed);
		// for (int i = 0; i < modelRow; i++) {
		// Row row = sheet.getRow(i);
		// if (row != null)
		// sheet.removeRow(sheet.getRow(i));
		// }
		// sheet.shiftRows(modelRow + 1, sheet.getLastRowNum(), -modelRow - 1, true,
		// false);
	}

	/**
	 * 一个记录写入一个sheet的功能，比如说公司人员登录表，多选的人员都放在一起。 这个必须选中一些记录，如果是全部的话可能会太多了
	 * 
	 */

	public void createExcelSheets(FDataobject dataobject, String ids[], XSSFWorkbook excelDocument) throws Exception {
		XSSFSheet firstSheet = excelDocument.getSheetAt(0);
		for (int i = 1; i < ids.length; i++) {
			String recordid = ids[i];
			Map<String, Object> recordMap = dataObjectService.getObjectRecordMap(dataobject.getObjectid(), recordid);
			String recordtitle = recordMap.get(dataobject.getNamefield()).toString();
			Object record = null;
			if (StringUtils.isNotBlank(dataobject.getClassname())) {
				Class<?> objectClass = Class.forName(dataobject.getClassname());
				record = dao.findById(objectClass, recordid);
			}
			XSSFSheet sheet = excelDocument.cloneSheet(0, getUniqueTitle(excelDocument, recordtitle, 0));
			BeanUtils.copyProperties(firstSheet.getPrintSetup(), sheet.getPrintSetup());
			ExcelUtils.replace(sheet, record, recordMap, 0, dataobject);
		}

		String recordid = ids[0];
		Map<String, Object> recordMap = dataObjectService.getObjectRecordMap(dataobject.getObjectid(), recordid);
		String recordtitle = recordMap.get(dataobject.getNamefield()).toString();
		Object record = null;
		if (StringUtils.isNotBlank(dataobject.getClassname())) {
			Class<?> objectClass = Class.forName(dataobject.getClassname());
			record = dao.findById(objectClass, recordid);
		}
		excelDocument.setSheetName(0, getUniqueTitle(excelDocument, recordtitle, 0));
		ExcelUtils.replace(firstSheet, record, recordMap, 0, dataobject);
	}

	/**
	 * 防止sheetname重复,有些字符不能做为sheetName
	 * 
	 * @param excelDocument
	 * @param title
	 * @param i
	 * @return
	 */
	public String getUniqueTitle(XSSFWorkbook excelDocument, String title, int i) {
		title = title.replace('"', '\'').replace('/', ' ').replace('\\', ' ').replace(':', ' ').replace('*', ' ')
				.replace('<', ' ').replace('>', ' ').replace('|', ' ').replace('?', ' ').replace('[', ' ').replace(']', ' ');
		if (excelDocument.getSheet(title + (i == 0 ? "" : i)) != null)
			return getUniqueTitle(excelDocument, title, i + 1);
		else
			return title + (i == 0 ? "" : i);
	}

}
