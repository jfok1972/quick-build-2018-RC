/*============= 建立简易销售系统的业务系统的所有sql语句================*/


CREATE TABLE `sl_area` (
`id_` varchar(2) NOT NULL COMMENT '地区id|基本信息',
`name_` varchar(50) NOT NULL COMMENT '地区名称',
`area_` double(20,2) NULL COMMENT '面积',
`population_size_` int NULL COMMENT '人口数量',
`density_` decimal(20,4) NULL COMMENT '人口密度',
`province_number_` int NULL COMMENT '省个数',
`percent_` decimal(10,4) NULL COMMENT '面积百分比',
`important_` bit(1) NULL DEFAULT 0 COMMENT '重要',
`image_` longblob NULL COMMENT '图像|附加信息',
`datetime_` datetime NULL COMMENT '日期时间',
`date_` date NULL COMMENT '日期',
`remark_` text NULL COMMENT '备注',
`creater_` varchar(40) NULL COMMENT '创建者',
`createdate_` datetime NULL COMMENT '创建日期',
`lastmodifier_` varchar(40) NULL COMMENT '最后修改者',
`lastmodifydate_` datetime NULL COMMENT '最后修改日期',
PRIMARY KEY (`id_`) ,
UNIQUE INDEX `IX_SL_AREA_NAME_` (`name_` ASC)
)
COMMENT = '地区';

CREATE TABLE `sl_province` (
`id_` varchar(10) NOT NULL COMMENT '省份id',
`name_` varchar(50) NOT NULL COMMENT '名称',
`short_name_` varchar(10) NOT NULL COMMENT '简称',
`area_id_` varchar(10) NOT NULL COMMENT '所属地区',
`image_` longblob NULL COMMENT '图像',
`remark_` text NULL COMMENT '备注',
PRIMARY KEY (`id_`) ,
UNIQUE INDEX `ix_province_name` (`name_` ASC)
)
COMMENT = '省';

CREATE TABLE `sl_city` (
`id_` varchar(10) NOT NULL COMMENT '市id',
`name_` varchar(50) NOT NULL COMMENT '城市名称',
`province_id_` varchar(10) NOT NULL COMMENT '所属省',
`post_code` varchar(10) NULL COMMENT '邮政编码',
`remark_` text NULL COMMENT '备注',
PRIMARY KEY (`id_`) ,
UNIQUE INDEX `ix_city_name` (`province_id_` ASC, `name_` ASC)
)
COMMENT = '市';

CREATE TABLE `sl_customer` (
`id_` varchar(40) NOT NULL COMMENT '单位id',
`name_` varchar(50) NOT NULL COMMENT '单位名称',
`cityid_` varchar(10) NOT NULL COMMENT '所在城市id',
`tradeid_` varchar(4) NOT NULL COMMENT '所属行业',
`ratelevel` varchar(2) NOT NULL COMMENT '客户等级',
PRIMARY KEY (`id_`) ,
UNIQUE INDEX `IX_customer_name` (`name_` ASC)
)
COMMENT = '客户单位';

CREATE TABLE `sl_trade` (
`id_` varchar(4) NOT NULL COMMENT '行业编码',
`name_` varchar(50) NOT NULL COMMENT '行业名称',
PRIMARY KEY (`id_`) ,
UNIQUE INDEX `IX_trade_name` (`name_` ASC)
)
COMMENT = '行业';

CREATE TABLE `sl_producttype` (
`id_` varchar(4) NOT NULL COMMENT '类别编码',
`name_` varchar(50) NOT NULL COMMENT '类别名称',
PRIMARY KEY (`id_`) ,
UNIQUE INDEX `IX_producttype_name` (`name_` ASC)
)
COMMENT = '商品类别';

CREATE TABLE `sl_product` (
`id_` varchar(10) NOT NULL COMMENT '商品编码',
`typeid_` varchar(4) NOT NULL COMMENT '商品类别id',
`name_` varchar(50) NOT NULL COMMENT '商品名称',
`provinceid_` varchar(10) NOT NULL COMMENT '产地省id',
`unit_text_` varchar(20) NULL COMMENT '计量单位',
`unit_price_` decimal(10,2) NULL COMMENT '销售单价',
`cost_price_` decimal(10,2) NULL COMMENT '成本价',
PRIMARY KEY (`id_`) ,
UNIQUE INDEX `IX_product_name` (`name_` ASC)
)
COMMENT = '商品';

CREATE TABLE `sl_order` (
`id_` varchar(40) NOT NULL COMMENT '订单id',
`code_` varchar(50) NOT NULL COMMENT '订单编号',
`customerid_` varchar(40) NOT NULL COMMENT '客户单位id',
`personnelid_` varchar(40) NOT NULL COMMENT '销售人员id',
`order_date_` date NOT NULL COMMENT '销售日期',
`fromcityid_` varchar(10) NOT NULL COMMENT '始发地市id',
`tocityid_` varchar(10) NOT NULL COMMENT '目的地市id',
`amount_` decimal(12,2) NULL COMMENT '合同总额',
`already_amount_` decimal(12,2) NULL COMMENT '已收款项',
PRIMARY KEY (`id_`) ,
UNIQUE INDEX `IX_order_code` (`code_` ASC)
)
COMMENT = '销售订单';

CREATE TABLE `sl_orderdetail` (
`id_` varchar(40) NOT NULL COMMENT '订单明细id',
`orderid_` varchar(40) NOT NULL COMMENT '销售订单id',
`productid_` varchar(10) NOT NULL COMMENT '商品id',
`name_` varchar(50) NULL COMMENT '订单明细说明',
`numbers_` decimal(10,2) NULL COMMENT '数量',
`unit_price_` decimal(10,2) NULL COMMENT '单价',
`amount_` decimal(12,2) NULL COMMENT '金额',
PRIMARY KEY (`id_`) 
)
COMMENT = '订单明细';


ALTER TABLE `sl_province` ADD CONSTRAINT `fk_SL_PROVINCE_SL_AREA_1` FOREIGN KEY (`area_id_`) REFERENCES `sl_area` (`id_`);
ALTER TABLE `sl_city` ADD CONSTRAINT `fk_sl_city_sl_province_1` FOREIGN KEY (`province_id_`) REFERENCES `sl_province` (`id_`);
ALTER TABLE `sl_customer` ADD CONSTRAINT `fk_sl_customer_sl_city_1` FOREIGN KEY (`cityid_`) REFERENCES `sl_city` (`id_`);
ALTER TABLE `sl_customer` ADD CONSTRAINT `fk_sl_customer_sl_trade_1` FOREIGN KEY (`tradeid_`) REFERENCES `sl_trade` (`id_`);
ALTER TABLE `sl_product` ADD CONSTRAINT `fk_sl_product_sl_producttype_1` FOREIGN KEY (`typeid_`) REFERENCES `sl_producttype` (`id_`);
ALTER TABLE `sl_order` ADD CONSTRAINT `fk_sl_order_sl_customer_1` FOREIGN KEY (`customerid_`) REFERENCES `sl_customer` (`id_`);
ALTER TABLE `sl_order` ADD CONSTRAINT `fk_sl_order_f_personnel_1` FOREIGN KEY (`personnelid_`) REFERENCES `f_personnel` (`personnelid`);
ALTER TABLE `sl_order` ADD CONSTRAINT `fk_sl_order_sl_city_1` FOREIGN KEY (`fromcityid_`) REFERENCES `sl_city` (`id_`);
ALTER TABLE `sl_order` ADD CONSTRAINT `fk_sl_order_sl_city_2` FOREIGN KEY (`tocityid_`) REFERENCES `sl_city` (`id_`);
ALTER TABLE `sl_orderdetail` ADD CONSTRAINT `fk_sl_orderdetail_sl_order_1` FOREIGN KEY (`orderid_`) REFERENCES `sl_order` (`id_`);
ALTER TABLE `sl_orderdetail` ADD CONSTRAINT `fk_sl_orderdetail_sl_product_1` FOREIGN KEY (`productid_`) REFERENCES `sl_product` (`id_`);
ALTER TABLE `sl_product` ADD CONSTRAINT `fk_sl_product_sl_province_1` FOREIGN KEY (`provinceid_`) REFERENCES `sl_province` (`id_`);

