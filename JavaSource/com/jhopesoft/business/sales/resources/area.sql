/*============= 建立地区、省、市三个模块 ================*/

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


ALTER TABLE `sl_province` ADD CONSTRAINT `fk_SL_PROVINCE_SL_AREA_1` FOREIGN KEY (`area_id_`) REFERENCES `sl_area` (`id_`);
ALTER TABLE `sl_city` ADD CONSTRAINT `fk_sl_city_sl_province_1` FOREIGN KEY (`province_id_`) REFERENCES `sl_province` (`id_`);

