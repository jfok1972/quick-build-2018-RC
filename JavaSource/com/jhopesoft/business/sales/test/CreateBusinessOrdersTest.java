package com.jhopesoft.business.sales.test;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.junit.Test;

import com.jhopesoft.business.sales.entity.SlCity;
import com.jhopesoft.business.sales.entity.SlCustomer;
import com.jhopesoft.business.sales.entity.SlOrder;
import com.jhopesoft.business.sales.entity.SlOrderdetail;
import com.jhopesoft.business.sales.entity.SlProduct;
import com.jhopesoft.business.sales.entity.SlProvince;
import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.dao.entity.system.FOrganization;
import com.jhopesoft.framework.dao.entity.system.FPersonnel;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.test.TestManager;
import com.jhopesoft.framework.utils.DateUtils;

/**
 * 
 * @author jiangfeng
 *
 */

public class CreateBusinessOrdersTest extends TestManager {

	/**
	 * 每运行一次建立2000张模拟订单，第一次运行的时候，会加入销售部门，销售人员
	 */

	@Test
	public void create2000Orders() {

		FOrganization org = dao.findByPropertyFirst(FOrganization.class, "orgcode", "0010");
		if (org == null) {
			createSalesOrganizations();
		}
		// 所有的客户单位
		List<SlCustomer> customers = dao.findAll(SlCustomer.class);
		// 所有的产品
		List<SlProduct> products = dao.findAll(SlProduct.class);
		// 所有的销售员
		List<FPersonnel> personnels = dao.findAll(FPersonnel.class);
		List<Integer> years = new ArrayList<Integer>();
		for (int i = 2007; i <= 2018; i++) {
			years.add(i);
		}
		for (int i = personnels.size() - 1; i >= 0; i--) {
			FPersonnel p = personnels.get(i);
			if (p.getOrderno() < 1000) {
				personnels.remove(i);
			}
		}
		List<SlCity> citys = new ArrayList<SlCity>(0); // 始发地市，只包括几个省的
		citys.addAll(dao.findById(SlProvince.class, "32").getSlCities());
		citys.addAll(dao.findById(SlProvince.class, "33").getSlCities());
		citys.addAll(dao.findById(SlProvince.class, "34").getSlCities());
		citys.addAll(dao.findById(SlProvince.class, "35").getSlCities());
		citys.addAll(dao.findById(SlProvince.class, "36").getSlCities());

		Map<Object, Integer> customermap = new HashMap<Object, Integer>(0);
		Integer aint = 10;
		for (SlCustomer customer : customers) {
			customermap.put(customer, aint++);
		}

		Map<Object, Integer> manmap = new HashMap<Object, Integer>(0);
		aint = 20;
		for (FPersonnel p : personnels) {
			manmap.put(p, aint++);
		}

		Map<Object, Integer> productmap = new HashMap<Object, Integer>(0);
		aint = 10;
		for (SlProduct p : products) {
			productmap.put(p, aint++);
		}

		Map<Object, Integer> citysmap = new HashMap<Object, Integer>(0);
		aint = 20;
		for (SlCity city : citys) {
			citysmap.put(city, aint++);
		}

		Map<Object, Integer> yearssmap = new HashMap<Object, Integer>(0);
		aint = 10;
		for (Integer y : years) {
			yearssmap.put(y, aint++);
		}

		for (int i = 0; i < 2000; i++) {
			@SuppressWarnings("deprecation")
			Date date = new Date((Integer) chanceSelect(yearssmap) - 1900, new Random().nextInt(11),
					new Random().nextInt(27) + 1);
			try {
				createOrder((SlCustomer) chanceSelect(customermap), (FPersonnel) chanceSelect(manmap), date,
						(SlCity) chanceSelect(citysmap), (SlCity) chanceSelect(citysmap), productmap, i);
			} catch (Exception e) {
			} finally {
			}
		}

	}

	public void createOrder(SlCustomer customer, FPersonnel p, Date date, SlCity from, SlCity to,
			Map<Object, Integer> productmap, int ordi) {

		SlOrder order = new SlOrder(null, p, to, from, customer,
				customer.getName() + "" + DateUtils.format(date, "yyyy-MM-dd") + "的订单" + ordi + (new Random().nextInt(100)),
				date, null, null, null);

		dao.save(order);
		double sum = 0.0;
		for (int i = 0; i < new Random().nextInt(5) + 3; i++) {
			SlProduct product = (SlProduct) chanceSelect(productmap);
			BigDecimal numbers = new BigDecimal(new Random().nextInt(50) + 2);
			SlOrderdetail detail = new SlOrderdetail(null, order, product, product.getName(), numbers, product.getUnitPrice(),
					new BigDecimal(numbers.doubleValue() * product.getUnitPrice().doubleValue()));
			dao.save(detail);
			sum += detail.getAmount().doubleValue();
		}
		order.setAmount(new BigDecimal(sum));
		order.setAlreadyAmount(new BigDecimal(sum));
		@SuppressWarnings("deprecation")
		int y = date.getYear() + 1900 - 2006;
		int r = new Random().nextInt(y);
		if (r > 3) {
			order.setAlreadyAmount(new BigDecimal(sum * new Random().nextDouble()));
		}
		dao.update(order);
	}

	/**
	 * 随机返回列表中的一个值，应该有一个权重值的设置，使返回的数据有侧重点
	 * 
	 * @param list
	 * @return
	 */
	public Object chanceSelect(Map<Object, Integer> keyChanceMap) {
		Integer sum = 0;
		for (Integer value : keyChanceMap.values()) {
			sum += value;
		}
		// 从1开始
		Integer rand = new Random().nextInt(sum) + 1;
		for (Map.Entry<Object, Integer> entry : keyChanceMap.entrySet()) {
			rand = rand - entry.getValue();
			// 选中
			if (rand <= 0) {
				Object item = entry.getKey();
				return item;
			}
		}
		return null;
	}

	/**
	 * 生成销售部门的组织机构和销售人员
	 */
	@Test
	public void createSalesOrganizations() {
		Timestamp createdate = new Timestamp(System.currentTimeMillis());
		String creater = dao.findByPropertyFirst(FUser.class, "usercode", "admin").getUserid();
		FCompany company = dao.findById(FCompany.class, "00");
		FOrganization root = dao.findByPropertyFirst(FOrganization.class, "orgcode", "00");
		FOrganization salesroot = new FOrganization(company, root, "0010", "销售部", "0010", true, creater, createdate);
		dao.save(salesroot);

		FOrganization sales1 = new FOrganization(company, salesroot, "001001", "销售一科", "001001", true, creater, createdate);
		dao.save(sales1);
		FOrganization sales2 = new FOrganization(company, salesroot, "001002", "销售二科", "001002", true, creater, createdate);
		dao.save(sales2);
		FOrganization sales3 = new FOrganization(company, salesroot, "001003", "销售三科", "001003", true, creater, createdate);
		dao.save(sales3);
		FOrganization sales4 = new FOrganization(company, salesroot, "001004", "销售四科", "001004", true, creater, createdate);
		dao.save(sales4);
		FOrganization sales5 = new FOrganization(company, salesroot, "001005", "销售五科", "001005", true, creater, createdate);
		dao.save(sales5);
		FOrganization sales51 = new FOrganization(company, sales5, "00100501", "销售五科一处", "00100501", true, creater,
				createdate);
		dao.save(sales51);
		FOrganization sales52 = new FOrganization(company, sales5, "00100502", "销售五科二处", "00100502", true, creater,
				createdate);
		dao.save(sales52);
		FOrganization sales53 = new FOrganization(company, sales5, "00100503", "销售五科三处", "00100503", true, creater,
				createdate);
		dao.save(sales53);
		int i = 1001;
		dao.save(new FPersonnel(sales1, "sj", "宋江", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales1, "ljy", "卢俊义", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales1, "wy", "吴用", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales1, "gss", "公孙胜", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales2, "gs", "关胜", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales2, "lc", "林冲", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales2, "qm", "秦明", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales3, "hyz", "呼延灼", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales3, "hr", "花荣", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales3, "cj", "柴进", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales3, "ly", "李应", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales4, "zg", "朱仝", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales4, "lzs", "鲁智深", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales4, "ws", "武松", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales4, "dp", "董平", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales4, "zq", "张清", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales51, "yz", "杨志", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales51, "xn", "徐宁", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales51, "fc", "索超", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales52, "dz", "戴宗", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales52, "lt", "刘唐", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales52, "lk", "李逵", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales52, "sji", "史进", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales53, "mh", "穆弘", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales53, "lh", "雷横", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales53, "lj", "李俊", true, "00", i++, creater, createdate));
		dao.save(new FPersonnel(sales53, "yxe", "阮小二", true, "00", i++, creater, createdate));

	}

}
