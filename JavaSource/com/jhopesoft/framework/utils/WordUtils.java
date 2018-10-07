package com.jhopesoft.framework.utils;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.poi.POIXMLDocument;
import org.apache.poi.POIXMLTextExtractor;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;

public class WordUtils {

	public static XWPFDocument createNewWord(InputStream inputStream) throws IOException {
		XWPFDocument doc = new XWPFDocument(inputStream);
		return doc;
	}

	public static XWPFDocument createNewWord(String template) throws Exception {
		OPCPackage pack = POIXMLDocument.openPackage(template);
		XWPFDocument doc = new XWPFDocument(pack);
		return doc;
	}

	// 根据{name} 形式来找到所有要替换的内容
	public static Set<String> getAllTemplateWord(XWPFDocument doc) throws IOException {
		// word 2007 图片不会被读取， 表格中的数据会被放在字符串的最后
		POIXMLTextExtractor extractor = new XWPFWordExtractor(doc);
		String wordtext = extractor.getText();
		extractor.close();
		return CommonUtils.getAllTemplateWord(wordtext);

	}

	/**
	 * 根据指定的参数值替换 word 文档
	 * 
	 * @param template
	 *          word模板
	 * @param param
	 *          需要替换的变量
	 * @throws Exception
	 */
	public static void replace(XWPFDocument doc, Map<String, Object> param) throws Exception {
		if (param != null && param.size() > 0) {
			// 处理段落
			List<XWPFParagraph> paragraphList = doc.getParagraphs();
			processParagraphs(paragraphList, param, doc);
			// 处理表格
			Iterator<XWPFTable> it = doc.getTablesIterator();
			while (it.hasNext()) {
				XWPFTable table = it.next();
				List<XWPFTableRow> rows = table.getRows();
				for (XWPFTableRow row : rows) {
					List<XWPFTableCell> cells = row.getTableCells();
					for (XWPFTableCell cell : cells) {
						List<XWPFParagraph> paragraphListTable = cell.getParagraphs();
						processParagraphs(paragraphListTable, param, doc);
					}
				}
			}
		}
	}

	/**
	 * 插入表格
	 * 
	 * @param table
	 * @param list
	 */
	public static void updataTable(XWPFTable table, List<List<Object>> resultList) {
		updataTable(table, resultList, null);
	}

	/**
	 * 插入表格
	 * 
	 * @param table
	 * @param list
	 * @param title
	 *          第一行标题
	 */
	public static void updataTable(XWPFTable table, List<List<Object>> resultList, String title) {
		boolean b = !CommonUtils.isEmpty(title);
		updataTable(table, resultList, title, b ? 1 : 0);
	}

	/**
	 * 插入表格
	 * 
	 * @param table
	 * @param list
	 * @param title
	 *          第一行标题
	 */
	public static void updataTable(XWPFTable table, List<List<Object>> resultList, String title, int rowIndex) {
		boolean b = !CommonUtils.isEmpty(title);
		if (b) {
			XWPFTableCell cell = table.getRow(0).getCell(0);
			cell.setText(title);
		}
		if (resultList.size() == 0)
			return;
		// 如果table的行数不够创建新行
		if (table.getRows().size() < (resultList.size() + rowIndex)) {
			int newRowNumber = resultList.size() + rowIndex - table.getRows().size();
			for (int i = 0; i < newRowNumber; i++) {
				table.createRow();
			}
		}
		for (int i = 0; i < resultList.size(); i++) {
			List<Object> list = resultList.get(i);
			for (int j = 0; j < list.size(); j++) {
				int index = i + rowIndex;
				XWPFTableCell cell = table.getRow(index).getCell(j);
				if (cell == null)
					cell = table.getRow(index).createCell();
				Object data = list.get(j);
				if (CommonUtils.isEmpty(data))
					continue;
				cell.setText(String.valueOf(data));
			}
		}
	}

	/**
	 * 处理段落
	 * 
	 * @param paragraphList
	 * @throws FileNotFoundException
	 * @throws InvalidFormatException
	 * 
	 *           估价报告出具日期：{orderdate::yyyy年MM月dd日} 估价报告出具日期：
	 *           {orderdate::yyyy年MM月dd日}
	 * 
	 * 
	 */
	private static void processParagraphs(List<XWPFParagraph> paragraphList, Map<String, Object> param, XWPFDocument doc)
			throws Exception {
		if (CommonUtils.isEmpty(paragraphList))
			return;
		for (XWPFParagraph paragraph : paragraphList) {
			unionRuns(paragraph);
			List<XWPFRun> runs = paragraph.getRuns();
			for (XWPFRun run : runs) {
				String text = run.getText(0);
				if (CommonUtils.isEmpty(text))
					continue;
				for (Entry<String, Object> entry : param.entrySet()) {
					String key = entry.getKey();
					if (text.indexOf(key) != -1) {
						Object value = entry.getValue();
						if (value instanceof String) {// 文本替换
							text = text.replace(key, value.toString());
						}
						run.setText(text, 0);
					}
				}
			}
		}
	}

	/**
	 * 把这个段落的所有的 {} 闭合区间的值都放在同一行上面。可能会有多个，一次换一个
	 * 
	 * @param paragraph
	 * @return 返回true 表示有换过一次，需要再换一次
	 * 
	 */
	private static void unionRuns(XWPFParagraph paragraph) {
		List<XWPFRun> runs = paragraph.getRuns();
		int start = -1;
		int end = -1;
		for (int i = 0; i < runs.size(); i++) {
			XWPFRun run = runs.get(i);
			String runText = run.text();
			if (start != -1) {
				if (hasEndChar(runText)) {
					end = i;
					break;
				}
			} else {
				if (hasStartButNotEnd(runText)) { // ｛｝不在同一行上
					start = i;
				}
			}
		}
		if (start != -1 && end != -1) {
			// 将 start 到 end 的行合并起来
			String unionText = "";
			for (int i = start + 1; i <= end; i++) {
				unionText += runs.get(start + 1).text();
				paragraph.removeRun(start + 1);
			}
			runs.get(start).setText(runs.get(start).text() + unionText, 0);
			unionRuns(paragraph);
		}
	}

	private static boolean hasEndChar(String text) {
		for (int i = 0; i < text.length(); i++) {
			char c = text.charAt(i);
			if (c == '}')
				return true;
		}
		return false;
	}

	/**
	 * 判断这一行是否是有 { 开头，但是没有 } 结束
	 * 
	 * @param text
	 * @return 返回true 表示有 { 开头，但没有 } 结尾，需要将下面的行接上来
	 */
	private static boolean hasStartButNotEnd(String text) {
		boolean hashead = false;
		for (int i = 0; i < text.length(); i++) {
			char c = text.charAt(i);
			if (hashead) {
				if (c == '}')
					hashead = false;
			} else {
				if (c == '{')
					hashead = true;
			}
		}
		return hashead;
	}

}
