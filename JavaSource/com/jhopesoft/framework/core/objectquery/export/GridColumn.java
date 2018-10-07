package com.jhopesoft.framework.core.objectquery.export;

import java.util.ArrayList;
import java.util.List;

public class GridColumn {
	private String text;
	private String gridFieldId;
	private String dataIndex;

	public GridColumn() {

	}

	public GridColumn(String text, String gridFieldId, String dataIndex) {
		super();
		this.text = text;
		this.gridFieldId = gridFieldId;
		this.dataIndex = dataIndex;
	}

	/**
	 * 根据字符串返回grid当前列表
	 * 
	 * @param str
	 * @return
	 */

	public static List<GridColumn> changeToGridColumn(String str) {
		if (str != null && str.length() > 1) {
			List<ExcelColumn> columns = ExcelColumn.changeToExportColumn(str);
			ExcelColumn[] cs = new ExcelColumn[columns.size()];
			for (int i = 0; i < columns.size(); i++)
				cs[i] = columns.get(i);
			List<GridColumn> result = new ArrayList<GridColumn>();
			genAllColumns(cs, result);
			return result;
		} else
			return null;
	}

	public static void genAllColumns(ExcelColumn[] items, List<GridColumn> gridColumns) {
		for (ExcelColumn column : items) {
			if (column.getDataIndex() != null && !column.getHidden())
				gridColumns.add(new GridColumn(column.getText(), column.getGridFieldId(), column.getDataIndex()));
			if (column.getItems() != null && !column.getHidden())
				genAllColumns(column.getItems(), gridColumns);
		}
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getGridFieldId() {
		return gridFieldId;
	}

	public void setGridFieldId(String gridFieldId) {
		this.gridFieldId = gridFieldId;
	}

	public String getDataIndex() {
		return dataIndex;
	}

	public void setDataIndex(String dataIndex) {
		this.dataIndex = dataIndex;
	}

}
