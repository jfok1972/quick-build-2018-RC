package com.jhopesoft.framework.core.objectquery.export;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.jhopesoft.framework.bean.FieldType;
import com.jhopesoft.framework.bean.GridFieldInfo;
import com.jhopesoft.framework.bean.GroupParameter;
import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridschemecolumn;
import com.jhopesoft.framework.utils.TypeChange;

import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.format.PageOrientation;
import jxl.format.PaperSize;
import jxl.format.UnderlineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.DateFormat;
import jxl.write.Label;
import jxl.write.NumberFormat;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;

public class ExcelExport {

	private Integer[] width;

	private boolean colorless;
	private boolean sumless;
	private boolean usemonetary;
	private Integer monetaryUnit;
	private String monetaryText;

	Integer x = 0;
	WritableWorkbook workbook = null;
	WritableSheet sheet = null;

	/**
	 * 在sheet中画出表头组
	 * 
	 * @param rowCount
	 * @param colCount
	 * @param allColumns
	 * @throws RowsExceededException
	 * @throws WriteException
	 */
	public void drawColumnHeader(List<ExcelColumn> allColumns, int gcol) throws RowsExceededException, WriteException {

		for (ExcelColumn column : allColumns) {
			if (column.getFirstCol() != column.getLastCol() || column.getFirstRow() != column.getLastRow()) {
				sheet.mergeCells(column.getFirstCol() + gcol, x + column.getFirstRow(), column.getLastCol() + gcol,
						x + column.getLastRow());
			}
			sheet.addCell(new Label(column.getFirstCol() + gcol, x + column.getFirstRow(),
					column._getText("", false).replaceAll("--", "\n"), wcf_tabletitle));
		}
	}

	@SuppressWarnings("unchecked")
	public OutputStream GenExcel(FDataobject module, List<UserDefineFilter> conditionList, List<?> fu_value,
			GroupParameter group, Integer schemeOrder, Integer rowCount, Integer colCount, List<ExcelColumn> allColumns,
			List<ExcelColumn> dataIndexColumns) {

		String groupFieldname = null;
		if (group != null && group.getProperty() != null && group.getProperty().length() > 0) {
			
			groupFieldname = group.getTextProperty() == null ? group.getProperty() : group.getTextProperty();
			group.setTitle(groupFieldname);
		}

		List<GridFieldInfo> gridFieldInfos = new ArrayList<GridFieldInfo>();
		
		for (ExcelColumn column : dataIndexColumns) {

			if (groupFieldname != null) {
				if (groupFieldname.equals(column.getDataIndex()))
					group.setTitle(column.getText());
			}

			if (column.getGridFieldId() != null) {
				FovGridschemecolumn schemeColumn = Local.getDao().findById(FovGridschemecolumn.class, column.getGridFieldId());

				FDataobjectfield field = schemeColumn.getFDataobjectfield();

				if (field != null) {
					GridFieldInfo info = new GridFieldInfo();
					info.setAllowSubTotal(field.getAllowsummary());
					info.setFieldId(field.getFieldid());
					info.setFieldname(column.getDataIndex());
					info.setFieldtype(field.getFieldtype());
					info.setTitle(field.getFieldtitle());
					info.setUnitText(field.getUnittext());
					info.setIsmonetary(column.isIsmonetary());
					
					if (info.getFieldtype().toLowerCase().equals("percent")) {
						info.setDivisor(field.getDivisor());
						info.setDenominator(field.getDenominator());
					}
					if (column.isIsmonetary() && usemonetary && monetaryUnit != 1) {
						column.setUnittext(monetaryText + (StringUtils.isEmpty(column.getUnittext()) ? "" : column.getUnittext()));
					} else {
						info.setIsmonetary(false);
						column.setIsmonetary(false);
					}
					gridFieldInfos.add(info);

				}
			} else {
				GridFieldInfo info = new GridFieldInfo();
				info.setAllowSubTotal(true);
				info.setFieldname(column.getDataIndex());
				info.setFieldtype("Integer");
				gridFieldInfos.add(info);

			}

		}

		OutputStream os = new ByteArrayOutputStream();
		try {
			workbook = Workbook.createWorkbook(os);
			workbook.setColourRGB(Colour.LIGHT_TURQUOISE2, 0xF8, 0xFF, 0xEF);
			workbook.setColourRGB(Colour.PALE_BLUE, 0xbb, 0xdd, 0xff);
			workbook.setColourRGB(Colour.GRAY_25, 0xE8, 0xEF, 0xEF);
			sheet = workbook.createSheet(module.getTitle(), 0);
			sheet.getSettings().setTopMargin(0.5d);
			sheet.getSettings().setLeftMargin(0.5d);
			sheet.getSettings().setRightMargin(0.5d);
			sheet.getSettings().setBottomMargin(0.5d);
			sheet.getSettings().setDisplayZeroValues(false);
			Integer groupcolumns = groupFieldname != null ? 2 : 0;
			
			Integer maxY = gridFieldInfos.size() - 1 + groupcolumns;

			sheet.setRowView(x, 800, false);
			sheet.mergeCells(0, x, maxY, x);
			sheet.addCell(new Label(0, x, module.getTitle() + "列表", wcf_title));
			x++;
			
			Integer halfy = maxY / 2;
			sheet.mergeCells(0, x, halfy, x);
			sheet.setRowView(x, 400, false);
			sheet.addCell(
					new Label(0, x, "单位名称:" + Local.getUserBean().getCompanyname() + "--" + Local.getUsername(), wcf_futitle));

			
			sheet.mergeCells(halfy + 1, x, maxY, x);
			sheet.addCell(new Label(halfy + 1, x, "记录数:" + fu_value.size() + "   日期:" + TypeChange.DateToString(new Date()),
					wcf_futitle_right));
			
			
			
			
			
			
			

			
			x++;
			if (conditionList != null)
				for (int i = 0; i < conditionList.size(); i++) {
					sheet.mergeCells(0, x, maxY, x);
					sheet.setRowView(x, 400, false);
					sheet.addCell(new Label(0, x++, conditionList.get(i).toString(), wcf_futitle));
				}

			width = new Integer[gridFieldInfos.size() + groupcolumns];
			for (int i = 0; i < width.length; i++)
				width[i] = 5;

			
			if (groupcolumns == 2) {
				if (rowCount > 1) {
					sheet.mergeCells(0, x, 0, x + rowCount - 1);
					sheet.mergeCells(1, x, 1, x + rowCount - 1);
				}
				sheet.addCell(new Label(0, x, group.getTitle(), wcf_tabletitle));
				sheet.addCell(new Label(1, x, "记录数", wcf_tabletitle));
				width[0] = 15;
			}

			drawColumnHeader(allColumns, groupcolumns);

			x += rowCount;
			

			String groupValue = "unused";

			
			if (!sumless) {
				CalcHjAndWirte(fu_value, sheet, x, groupcolumns, gridFieldInfos);
				x++;
			}

			for (int i = 0; i < fu_value.size(); i++) {
				Map<String, Object> v = (Map<String, Object>) fu_value.get(i);

				if (groupcolumns == 2) {

					
					String thisgroupvalue = null;
					{
						try {
							thisgroupvalue = v.get(groupFieldname).toString();
						} catch (Exception e) {
							thisgroupvalue = "";
						}
					}
					if (!groupValue.equals(thisgroupvalue)) {
						groupValue = thisgroupvalue;
						CalcSubHjAndWirte(fu_value, sheet, x, groupcolumns, groupFieldname, thisgroupvalue, gridFieldInfos);
						x++;
					}
				}
				
				for (int k = 0; k < groupcolumns; k++)
					sheet.addCell(new Label(k, x, "", wcf_normal_left));

				sheet.setRowView(x, 320, false);
				for (int j = 0; j < gridFieldInfos.size(); j++) {
					GridFieldInfo fd = gridFieldInfos.get(j);
					if (fd == null)
						continue;
					Object fv = null;
					String fieldName = fd.getFactFieldname();
					if (fd.getValueFieldname() != null)
						fieldName = fd.getValueFieldname();

					boolean manytomany = false;
					if (fieldName.endsWith("_detail")) {
						FDataobjectfield field = module._getModuleFieldByFieldName(fieldName.replace("_detail", ""));
						if (field != null && field._isManyToMany())
							manytomany = true;
					}
					try {
						fv = v.get(fieldName);
					} catch (Exception e) {
						fv = "";
					}
					fv = TypeChange.ZerotoSpace(fv);
					width[j + groupcolumns] = Min(Max(width[j + groupcolumns], fv.toString().getBytes("GBK").length + 1), 50);
					
					
					
					
					
					
					if (fd.getFieldtype().toLowerCase().equals("double") || fd.getFieldtype().toLowerCase().equals("float")
							|| fd.getFieldtype().toLowerCase().equals("money")) {
						Double dv = TypeChange.StringtoDouble(fv.toString());
						if (fd.isIsmonetary())
							dv = dv / monetaryUnit;
						if (!(dv == 0)) {
							sheet.addCell(new jxl.write.Number(j + groupcolumns, x, dv, wcf_normal_right_double));
							width[j + groupcolumns] = Min(
									Max(width[j + groupcolumns],
											TypeChange.DoubletoString(TypeChange.StringtoDouble(fv.toString())).replaceAll(",", "").length()),
									50);
						} else
							sheet.addCell(new Label(j + groupcolumns, x, "", wcf_normal_left));
					} else if (fd.getFieldtype().toLowerCase().equals("percent")) {
						Double dv = TypeChange.StringtoDouble(fv.toString());
						if (!(dv == 0)) {
							sheet.addCell(new jxl.write.Number(j + groupcolumns, x, dv, wcf_normal_right_percent));
							width[j + groupcolumns] = Min(Max(width[j + groupcolumns],
									TypeChange.DoubletoString(TypeChange.StringtoDouble(fv.toString())).replaceAll(",", "").length() + 1),
									50);
						} else
							sheet.addCell(new Label(j + groupcolumns, x, "", wcf_normal_left));
					} else if (fd.getFieldtype().toLowerCase().startsWith("int")) {
						Integer intv = TypeChange.StringtoInteger(fv.toString());
						if (fd.isIsmonetary())
							intv = intv / monetaryUnit;
						sheet.addCell(new jxl.write.Number(j + groupcolumns, x, intv, wcf_normal_right_int));
					}

					else if (fd.getFieldtype().toLowerCase().equals("date")) {
						if (TypeChange.StringToDate(fv.toString()) != null)
							sheet.addCell(new jxl.write.DateTime(j + groupcolumns, x, TypeChange.StringToDate(fv.toString()),
									wcf_normal_right_date));
						else
							sheet.addCell(new Label(j + groupcolumns, x, "", wcf_normal_right_date));

					} else if (fd.getFieldtype().toLowerCase().equals("blob") || fd.getFieldtype().toLowerCase().equals("image")
							|| fd.getFieldtype().toLowerCase().equals("file"))
						sheet.addCell(new Label(j + groupcolumns, x, "", wcf_normal_left));

					else
						sheet.addCell(new Label(j + groupcolumns, x, manytomany ? changeManyToMany(fv.toString()) : fv.toString(),
								wcf_normal_left));

				}
				x++;
			}

			
			int sumwidth = 0;
			for (int j = 0; j < gridFieldInfos.size() + groupcolumns; j++) {
				if (width[j] >= 20)
					width[j] = width[j] * 9 / 10;
				sumwidth += width[j];
			}
			if (sumwidth < 70)
				for (int j = 0; j < gridFieldInfos.size() + groupcolumns; j++)
					width[j] = width[j] * 90 / sumwidth;
			for (int j = 0; j < gridFieldInfos.size() + groupcolumns; j++) {
				sheet.setColumnView(j, width[j]);
			}
			if (sumwidth > 92)
				sheet.setPageSetup(PageOrientation.LANDSCAPE);
			if (sumwidth > 135)
				sheet.getSettings().setPaperSize(PaperSize.A3);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				workbook.write();
				workbook.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return os;
	}

	/**
	 * 如果是manytomany导出的时候是
	 * 20,竣工验收合格单,402882e5634a000701634a09e5cf0025|||50,发票,402882e5634a000701634a09e5f10027
	 * 的格式，需要取中间的文字
	 * 
	 * @param str
	 * @return
	 */
	private String changeManyToMany(String str) {
		if (StringUtils.isEmpty(str))
			return "";
		String records[] = str.split("\\|\\|\\|");
		String result[] = new String[records.length];
		int i = 0;
		for (String record : records) {
			String part[] = record.split(",");
			if (part.length >= 2)
				result[i++] = part[1];
		}
		return String.join(",", result);
	}

	@SuppressWarnings("unchecked")
	public void CalcSubHjAndWirte(List<?> fu_value,

			WritableSheet sheet, int x, int groupcolumns, String groupfieldname, String groupvalue,
			List<GridFieldInfo> gridFieldInfos) {
		Map<String, Object> totalValue = null;
		try {
			if (fu_value.size() > 0) {
				totalValue = new HashMap<String, Object>();
			} else
				return;
			int count = 0;
			
			for (int i = 0; i < fu_value.size(); i++) {
				Map<String, Object> v = (Map<String, Object>) fu_value.get(i);
				String nowGroupValueString = "";
				try {
					nowGroupValueString = v.get(groupfieldname).toString();
				} catch (Exception e) {

				}
				if (nowGroupValueString.equals(groupvalue)) {
					count++;
					for (int j = 0; j < gridFieldInfos.size(); j++) {
						GridFieldInfo fd = gridFieldInfos.get(j);
						
						try {
							if (fd.getAllowSubTotal()) {
								if (fd.getFieldtype().equalsIgnoreCase(FieldType.Integer.getValue())) {
									totalValue.put(fd.getFactFieldname(), TypeChange.itoi((Integer) totalValue.get(fd.getFactFieldname()))
											+ TypeChange.itoi(v.get(fd.getFactFieldname())));
								} else if (fd.getFieldtype().equalsIgnoreCase(FieldType.Percent.getValue())
										&& fd.getDivisor() != null) {
									
									totalValue.put(fd.getDivisorKey(),
											TypeChange.dtod(totalValue.get(fd.getDivisorKey())) + TypeChange.dtod(v.get(fd.getDivisor())));
									totalValue.put(fd.getDenominatorKey(), TypeChange.dtod(totalValue.get(fd.getDenominatorKey()))
											+ TypeChange.dtod(v.get(fd.getDenominator())));
								} else {
									totalValue.put(fd.getFactFieldname(), TypeChange.dtod((Double) totalValue.get(fd.getFactFieldname()))
											+ TypeChange.dtod(v.get(fd.getFactFieldname())));
								}
							}
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				}
			}
			

			for (int j = 0; j < gridFieldInfos.size(); j++) {
				GridFieldInfo fd = gridFieldInfos.get(j);
				if (fd.getAllowSubTotal()) {
					Object fv = null;
					try {
						fv = totalValue.get(fd.getFactFieldname());
					} catch (Exception e) {
						fv = "";
					}
					fv = TypeChange.ZerotoSpace(fv);
					if (fd.getFieldtype().equals(FieldType.Integer.getValue())) {
						width[j + groupcolumns] = Min(Max(width[j + groupcolumns], fv.toString().getBytes("GBK").length), 50);
						sheet.addCell(new jxl.write.Number(j + groupcolumns, x, TypeChange.StringtoInteger((fv.toString())),
								_total_wcf_normal_right_int));
					} else if (fd.getFieldtype().equalsIgnoreCase(FieldType.Percent.getValue()) && fd.getDivisor() != null) {

						double div = (Double) totalValue.get(fd.getDivisorKey());
						double deno = (Double) totalValue.get(fd.getDenominatorKey());

						sheet.addCell(new jxl.write.Number(j + groupcolumns, x, deno == 0.0 ? 0.0 : div / deno,
								_total_wcf_normal_right_percent));

					} else {
						Double dv = TypeChange.StringtoDouble(fv.toString());
						if (!(dv == 0)) {
							sheet.addCell(new jxl.write.Number(j + groupcolumns, x, dv, _total_wcf_normal_right_double));
							width[j + groupcolumns] = Min(
									Max(width[j + groupcolumns],
											TypeChange.DoubletoString(TypeChange.StringtoDouble(fv.toString())).replaceAll(",", "").length()),
									50);
						} else
							sheet.addCell(new Label(j + groupcolumns, x, "", wcf_normal_left));
					}
				} else
					sheet.addCell(new Label(j + groupcolumns, x, "", _total_wcf_normal_left));
			}
			sheet.setRowView(x, 320, false);
			String tString = groupvalue + "〖小计〗";
			sheet.addCell(new Label(0, x, tString, _total_wcf_normal_left));
			width[0] = Min(Max(width[0], tString.getBytes("GBK").length), 50);
			sheet.addCell(new jxl.write.Number(1, x, count, _total_wcf_normal_right_int));

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@SuppressWarnings("unchecked")
	public void CalcHjAndWirte(List<?> fu_value, WritableSheet sheet, int x, int groupcolumns,
			List<GridFieldInfo> gridFieldInfos) {
		Map<String, Object> totalValue = null;
		try {
			if (fu_value.size() > 0) {
				totalValue = new HashMap<String, Object>();
			} else
				return;

			
			for (int i = 0; i < fu_value.size(); i++) {
				Map<String, Object> v = (Map<String, Object>) fu_value.get(i);
				for (int j = 0; j < gridFieldInfos.size(); j++) {
					GridFieldInfo fd = gridFieldInfos.get(j);
					
					try {
						if (fd != null)
							if (fd.getAllowSubTotal()) {
								if (fd.getFieldtype().equalsIgnoreCase(FieldType.Integer.getValue())) {
									totalValue.put(fd.getFactFieldname(), TypeChange.itoi(totalValue.get(fd.getFactFieldname()))
											+ TypeChange.itoi(v.get(fd.getFactFieldname())));
								} else if (fd.getFieldtype().equalsIgnoreCase(FieldType.Percent.getValue())
										&& fd.getDivisor() != null) {
									
									totalValue.put(fd.getDivisorKey(),
											TypeChange.dtod(totalValue.get(fd.getDivisorKey())) + TypeChange.dtod(v.get(fd.getDivisor())));
									totalValue.put(fd.getDenominatorKey(), TypeChange.dtod(totalValue.get(fd.getDenominatorKey()))
											+ TypeChange.dtod(v.get(fd.getDenominator())));
								} else {
									totalValue.put(fd.getFactFieldname(), TypeChange.dtod((Double) totalValue.get(fd.getFactFieldname()))
											+ TypeChange.dtod(v.get(fd.getFactFieldname())));
								}
							}
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
			

			for (int j = 0; j < gridFieldInfos.size(); j++) {
				GridFieldInfo fd = gridFieldInfos.get(j);
				if (fd == null)
					continue;
				if (fd.getAllowSubTotal()) {
					Object fv = null;
					try {
						fv = totalValue.get(fd.getFactFieldname());
					} catch (Exception e) {
						fv = "";
					}
					fv = TypeChange.ZerotoSpace(fv);
					if (fd.getFieldtype().equalsIgnoreCase(FieldType.Integer.getValue())) {
						Integer iv = TypeChange.StringtoInteger(fv.toString());
						if (fd.isIsmonetary())
							iv = iv / monetaryUnit;
						width[j + groupcolumns] = Min(Max(width[j + groupcolumns], fv.toString().getBytes("GBK").length), 50);
						sheet.addCell(new jxl.write.Number(j + groupcolumns, x, iv, _total_wcf_normal_right_int));
					} else if (fd.getFieldtype().equalsIgnoreCase(FieldType.Percent.getValue()) && fd.getDivisor() != null) {

						double div = (Double) totalValue.get(fd.getDivisorKey());
						double deno = (Double) totalValue.get(fd.getDenominatorKey());

						sheet.addCell(new jxl.write.Number(j + groupcolumns, x, deno == 0.0 ? 0.0 : div / deno,
								_total_wcf_normal_right_percent));

					} else {
						Double dv = TypeChange.StringtoDouble(fv.toString());
						if (fd.isIsmonetary())
							dv = dv / monetaryUnit;
						sheet.addCell(new jxl.write.Number(j + groupcolumns, x, dv, _total_wcf_normal_right_double));
						width[j + groupcolumns] = Min(
								Max(width[j + groupcolumns],
										TypeChange.DoubletoString(TypeChange.StringtoDouble(fv.toString())).replaceAll(",", "").length()),
								50);
					}

				} else
					sheet.addCell(new Label(j + groupcolumns, x, "", _total_wcf_normal_left));
			}
			sheet.setRowView(x, 320, false);
			int zjpos = 0;
			for (int j = 0; j < gridFieldInfos.size(); j++) {
				GridFieldInfo fd = gridFieldInfos.get(j);
				if (fd.getFieldtype().equalsIgnoreCase("string")) {
					zjpos = j;
					break;
				}
			}
			if (groupcolumns == 0) { 
				String tString = "〖总计(" + fu_value.size() + "条)〗";
				sheet.addCell(new Label(zjpos, x, tString, _total_wcf_normal_left));
				width[zjpos] = Min(Max(width[zjpos], tString.getBytes("GBK").length), 50);
			} else { 
				String tString = "〖总  计〗"; 
				sheet.addCell(new Label(0, x, tString, _total_wcf_normal_left));
				width[0] = Min(Max(width[0], tString.getBytes("GBK").length), 50);
				sheet.addCell(new jxl.write.Number(1, x, fu_value.size(), _total_wcf_normal_right_int));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private static Integer Max(int v1, int v2) {
		if (v1 > v2)
			return v1;
		else
			return v2;
	}

	private static Integer Min(int v1, int v2) {
		if (v1 > v2)
			return v2;
		else
			return v1;
	}

	WritableFont boldFont;
	WritableFont HeaderFont = new WritableFont(WritableFont.createFont("宋体"), 9); 
	WritableFont NormalFont = new WritableFont(WritableFont.createFont("宋体"), 9);
	WritableFont NumberFont; 
	WritableFont PercentFont; 
	WritableFont DateFont; 
	WritableFont TitleHeaderFont; 

	
	WritableCellFormat wcf_title;
	
	WritableCellFormat wcf_futitle;
	
	WritableCellFormat wcf_futitle_right;
	
	WritableCellFormat wcf_tabletitle;
	
	WritableCellFormat wcf_normal_left;
	
	NumberFormat twodps;
	
	NumberFormat pertwodps;
	
	WritableCellFormat wcf_normal_right_double;
	
	DateFormat datewodps = new DateFormat("yyyy-mm-dd");
	WritableCellFormat wcf_normal_right_date;
	
	NumberFormat intdps = new NumberFormat("#;-#;", NumberFormat.COMPLEX_FORMAT);
	WritableCellFormat wcf_normal_right_int;
	
	WritableCellFormat wcf_normal_center;
	WritableCellFormat _total_wcf_normal_right_double;
	WritableCellFormat _total_wcf_normal_right_percent;
	WritableCellFormat _total_wcf_normal_right_int;
	WritableCellFormat _total_wcf_normal_right_date;
	WritableCellFormat _total_wcf_normal_left;

	WritableCellFormat wcf_normal_right_percent;

	public ExcelExport(boolean colorless, boolean usemonetary, Integer monetaryUnit, String monetaryText,
			boolean sumless) {
		this.setColorless(colorless);
		this.setUsemonetary(usemonetary);
		this.setMonetaryUnit(monetaryUnit);
		this.setMonetaryText(monetaryText);
		this.sumless = sumless;
		try {
			if (colorless) {
				boldFont = new WritableFont(WritableFont.createFont("黑体"), 14, WritableFont.BOLD, false,
						UnderlineStyle.NO_UNDERLINE);
				NumberFont = new WritableFont(WritableFont.createFont("宋体"), 9, WritableFont.NO_BOLD, false,
						UnderlineStyle.NO_UNDERLINE); 
				PercentFont = new WritableFont(WritableFont.createFont("宋体"), 9, WritableFont.NO_BOLD, false,
						UnderlineStyle.NO_UNDERLINE); 
				DateFont = new WritableFont(WritableFont.createFont("宋体"), 9, WritableFont.NO_BOLD, false,
						UnderlineStyle.NO_UNDERLINE); 
				TitleHeaderFont = new WritableFont(WritableFont.createFont("黑体"), 10, WritableFont.BOLD, false,
						UnderlineStyle.NO_UNDERLINE); 
			} else {
				boldFont = new WritableFont(WritableFont.createFont("黑体"), 14, WritableFont.BOLD, false,
						UnderlineStyle.NO_UNDERLINE, Colour.DARK_BLUE);
				NumberFont = new WritableFont(WritableFont.createFont("宋体"), 9, WritableFont.NO_BOLD, false,
						UnderlineStyle.NO_UNDERLINE, Colour.BLUE); 
				PercentFont = new WritableFont(WritableFont.createFont("宋体"), 9, WritableFont.NO_BOLD, false,
						UnderlineStyle.NO_UNDERLINE, Colour.GREEN); 
				DateFont = new WritableFont(WritableFont.createFont("宋体"), 9, WritableFont.NO_BOLD, false,
						UnderlineStyle.NO_UNDERLINE, Colour.DARK_BLUE); 
				TitleHeaderFont = new WritableFont(WritableFont.createFont("黑体"), 10, WritableFont.BOLD, false,
						UnderlineStyle.NO_UNDERLINE, Colour.DARK_BLUE); 
			}
			
			wcf_title = new WritableCellFormat(boldFont);
			
			wcf_futitle = new WritableCellFormat(HeaderFont);
			
			wcf_futitle_right = new WritableCellFormat(HeaderFont);
			
			wcf_tabletitle = new WritableCellFormat(TitleHeaderFont);
			
			wcf_normal_left = new WritableCellFormat(NormalFont);
			
			twodps = new NumberFormat("#.00;-#.00;", NumberFormat.COMPLEX_FORMAT);
			
			pertwodps = new NumberFormat("0.00%;-0.00%;", NumberFormat.COMPLEX_FORMAT);
			
			wcf_normal_right_double = new WritableCellFormat(NumberFont, twodps);
			
			wcf_normal_right_date = new WritableCellFormat(DateFont, datewodps);
			
			wcf_normal_right_int = new WritableCellFormat(NumberFont, intdps);
			
			wcf_normal_center = new WritableCellFormat(NormalFont);
			_total_wcf_normal_right_double = new WritableCellFormat(NumberFont, twodps);
			_total_wcf_normal_right_percent = new WritableCellFormat(PercentFont, pertwodps);
			_total_wcf_normal_right_int = new WritableCellFormat(NumberFont, intdps);
			_total_wcf_normal_right_date = new WritableCellFormat(DateFont, datewodps);
			_total_wcf_normal_left = new WritableCellFormat(NormalFont);

			wcf_normal_right_percent = new WritableCellFormat(PercentFont, pertwodps);

			
			wcf_title.setBorder(Border.NONE, BorderLineStyle.THIN); 
			wcf_title.setVerticalAlignment(VerticalAlignment.CENTRE); 
			wcf_title.setAlignment(Alignment.CENTRE); 
			if (!colorless)
				wcf_title.setBackground(Colour.LIGHT_TURQUOISE2);
			wcf_title.setWrap(true); 

			
			wcf_futitle.setBorder(Border.NONE, BorderLineStyle.THIN); 
			wcf_futitle.setVerticalAlignment(VerticalAlignment.CENTRE); 
			wcf_futitle.setAlignment(Alignment.LEFT); 
			if (!colorless)
				wcf_futitle.setBackground(Colour.LIGHT_TURQUOISE2);
			wcf_futitle.setWrap(true); 

			
			wcf_futitle_right.setBorder(Border.NONE, BorderLineStyle.THIN); 
			wcf_futitle_right.setVerticalAlignment(VerticalAlignment.CENTRE); 
			wcf_futitle_right.setAlignment(Alignment.RIGHT); 
			if (!colorless)
				wcf_futitle_right.setBackground(Colour.LIGHT_TURQUOISE2);
			wcf_futitle_right.setWrap(true); 

			
			wcf_tabletitle.setBorder(Border.ALL, BorderLineStyle.THIN); 
			wcf_tabletitle.setVerticalAlignment(VerticalAlignment.CENTRE); 
			wcf_tabletitle.setAlignment(Alignment.CENTRE); 
			if (!colorless)
				wcf_tabletitle.setBackground(Colour.PALE_BLUE);
			wcf_tabletitle.setWrap(true); 

			
			wcf_normal_left.setBorder(Border.ALL, BorderLineStyle.THIN); 
			wcf_normal_left.setVerticalAlignment(VerticalAlignment.CENTRE); 
			wcf_normal_left.setAlignment(Alignment.LEFT);
			if (!colorless)
				wcf_normal_left.setBackground(Colour.LIGHT_TURQUOISE2);
			wcf_normal_left.setWrap(true); 

			
			wcf_normal_right_double.setBorder(Border.ALL, BorderLineStyle.THIN); 
			wcf_normal_right_double.setVerticalAlignment(VerticalAlignment.CENTRE); 
			wcf_normal_right_double.setAlignment(Alignment.RIGHT);
			if (!colorless)
				wcf_normal_right_double.setBackground(Colour.LIGHT_TURQUOISE2);
			wcf_normal_right_double.setWrap(false); 
			
			wcf_normal_right_percent.setBorder(Border.ALL, BorderLineStyle.THIN); 
			wcf_normal_right_percent.setVerticalAlignment(VerticalAlignment.CENTRE); 
			wcf_normal_right_percent.setAlignment(Alignment.RIGHT);
			if (!colorless)
				wcf_normal_right_percent.setBackground(Colour.LIGHT_TURQUOISE2);
			wcf_normal_right_percent.setWrap(false); 

			
			wcf_normal_right_date.setBorder(Border.ALL, BorderLineStyle.THIN); 
			wcf_normal_right_date.setVerticalAlignment(VerticalAlignment.CENTRE); 
			wcf_normal_right_date.setAlignment(Alignment.RIGHT);
			if (!colorless)
				wcf_normal_right_date.setBackground(Colour.LIGHT_TURQUOISE2);
			wcf_normal_right_date.setWrap(false); 

			
			wcf_normal_right_int.setBorder(Border.ALL, BorderLineStyle.THIN); 
			wcf_normal_right_int.setVerticalAlignment(VerticalAlignment.CENTRE); 
			wcf_normal_right_int.setAlignment(Alignment.RIGHT);
			if (!colorless)
				wcf_normal_right_int.setBackground(Colour.LIGHT_TURQUOISE2);
			wcf_normal_right_int.setWrap(false); 

			
			wcf_normal_center.setBorder(Border.ALL, BorderLineStyle.THIN); 
			wcf_normal_center.setVerticalAlignment(VerticalAlignment.CENTRE); 
			wcf_normal_center.setAlignment(Alignment.CENTRE);
			if (!colorless)
				wcf_normal_center.setBackground(Colour.LIGHT_TURQUOISE2);
			wcf_normal_center.setWrap(true); 

			_total_wcf_normal_right_double.setBorder(Border.ALL, BorderLineStyle.THIN); 
			_total_wcf_normal_right_double.setVerticalAlignment(VerticalAlignment.CENTRE); 
			_total_wcf_normal_right_double.setAlignment(Alignment.RIGHT);
			if (!colorless)
				_total_wcf_normal_right_double.setBackground(Colour.GRAY_25);
			_total_wcf_normal_right_double.setWrap(false); 
			_total_wcf_normal_right_percent.setBorder(Border.ALL, BorderLineStyle.THIN); 
			_total_wcf_normal_right_percent.setVerticalAlignment(VerticalAlignment.CENTRE); 
			_total_wcf_normal_right_percent.setAlignment(Alignment.RIGHT);
			if (!colorless)
				_total_wcf_normal_right_percent.setBackground(Colour.GRAY_25);
			_total_wcf_normal_right_percent.setWrap(false); 
			_total_wcf_normal_right_int.setBorder(Border.ALL, BorderLineStyle.THIN); 
			_total_wcf_normal_right_int.setVerticalAlignment(VerticalAlignment.CENTRE); 
			_total_wcf_normal_right_int.setAlignment(Alignment.RIGHT);
			if (!colorless)
				_total_wcf_normal_right_int.setBackground(Colour.GRAY_25);
			_total_wcf_normal_right_int.setWrap(true); 
			_total_wcf_normal_right_date.setBorder(Border.ALL, BorderLineStyle.THIN); 
			_total_wcf_normal_right_date.setVerticalAlignment(VerticalAlignment.CENTRE); 
			_total_wcf_normal_right_date.setAlignment(Alignment.RIGHT);
			if (!colorless)
				_total_wcf_normal_right_date.setBackground(Colour.GRAY_25);
			_total_wcf_normal_right_date.setWrap(false); 
			_total_wcf_normal_left.setBorder(Border.ALL, BorderLineStyle.THIN); 
			_total_wcf_normal_left.setVerticalAlignment(VerticalAlignment.CENTRE); 
			_total_wcf_normal_left.setAlignment(Alignment.LEFT);
			if (!colorless)
				_total_wcf_normal_left.setBackground(Colour.GRAY_25);
			_total_wcf_normal_left.setWrap(true); 

		} catch (Exception e) {
		}

	}

	public boolean isUsemonetary() {
		return usemonetary;
	}

	public void setUsemonetary(boolean usemonetary) {
		this.usemonetary = usemonetary;
	}

	public Integer getMonetaryUnit() {
		return monetaryUnit;
	}

	public void setMonetaryUnit(Integer monetaryUnit) {
		this.monetaryUnit = monetaryUnit;
	}

	public String getMonetaryText() {
		return monetaryText;
	}

	public void setMonetaryText(String monetaryText) {
		this.monetaryText = monetaryText;
	}

	public boolean isColorless() {
		return colorless;
	}

	public void setColorless(boolean colorless) {
		this.colorless = colorless;
	}

	public class ExcelHeaderSpan {
		String title;
		int firstCol;
		int lastCol;
		boolean displayed;

		public ExcelHeaderSpan(String title, boolean displayed) {
			this.title = title;
			this.displayed = displayed;
			firstCol = 0;
			lastCol = 0;
		}

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public int getFirstCol() {
			return firstCol;
		}

		public void setFirstCol(int firstCol) {
			this.firstCol = firstCol;
		}

		public int getLastCol() {
			return lastCol;
		}

		public void setLastCol(int lastCol) {
			this.lastCol = lastCol;
		}

		public boolean isDisplayed() {
			return displayed;
		}

		public void setDisplayed(boolean displayed) {
			this.displayed = displayed;
		}

	}
}
