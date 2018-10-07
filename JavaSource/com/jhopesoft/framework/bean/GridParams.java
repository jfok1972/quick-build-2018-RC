package com.jhopesoft.framework.bean;

public class GridParams {

	private boolean paging = true;
	private int start = 0;
	private int limit = 20;
	private String sortField;
	private String sortOrder;

	public GridParams() {

	}

	public GridParams(boolean paging, int start, int limit) {
		this.paging = paging;
		this.start = start;
		this.limit = limit;
	}

	public boolean isPaging() {
		return paging;
	}

	public void setPaging(boolean paging) {
		this.paging = paging;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public String getSortField() {
		return sortField;
	}

	public void setSortField(String sortField) {
		this.sortField = sortField;
	}

	public String getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(String sortOrder) {
		this.sortOrder = sortOrder;
	}
}
