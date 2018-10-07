package com.jhopesoft.framework.bean;

import java.io.Serializable;
import java.util.List;
/**
 * 
 * @author jiangfeng
 *
 * @param <E>
 */
public class PageInfo<E> implements Serializable {

  private static final long serialVersionUID = 1L;

  /** 起始位置 */
  private int start = 1;

  /** 页面大小 */
  private int limit = 20;

  /** 总行数 */
  private int total;

  /**
   * 花费的时间，毫秒
   */
  private long spendtime;

  /** 数据 */
  private List<E> data;

  /** 备用1 */
  private String spare1;

  /** 备用2 */
  private String spare2;

  /** 备用3 */
  private String spare3;

  /** 备用4 */
  private Object spare4;


  public PageInfo() {}

  public PageInfo(int start, int limit) {
    setStart(start);
    setLimit(limit);
  }

  public PageInfo(int start, int limit, int total, List<E> data) {
    setStart(start);
    setLimit(limit);
    setTotal(total);
    setData(data);
  }

  /** 当前页 */
  public int getCurpage() {
    return start / limit;
  }

  /** 总页数 */
  public int getTotalpage() {
    return (total + limit - 1) / limit;
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

  public int getTotal() {
    return total;
  }

  public void setTotal(int total) {
    this.total = total;
  }

  public List<E> getData() {
    return data;
  }

  public void setData(List<E> data) {
    this.data = data;
  }

  public String getSpare1() {
    return spare1;
  }

  public void setSpare1(String spare1) {
    this.spare1 = spare1;
  }

  public String getSpare2() {
    return spare2;
  }

  public void setSpare2(String spare2) {
    this.spare2 = spare2;
  }

  public String getSpare3() {
    return spare3;
  }

  public void setSpare3(String spare3) {
    this.spare3 = spare3;
  }

  public Object getSpare4() {
    return spare4;
  }

  public void setSpare4(Object spare4) {
    this.spare4 = spare4;
  }

  public long getSpendtime() {
    return spendtime;
  }

  public void setSpendtime(long spendtime) {
    this.spendtime = spendtime;
  }
}
