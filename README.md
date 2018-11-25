## Quick-Build-2018-RC

快速构建系统(Quick Build System)最终测试版

* 开发作者：蒋锋(QQ:78580822)
* QQ讨论群:386100815
* 特别感谢：刘明(木人)
* 系统网址：<http://www.jhopesoft.com>
* 演示地址：<http://www.jhopesoft.com:8080/quick-build>(用户名:administrator,密码:admin)

### 您所要准备的仅是一个业务数据库，其他的已就位!
* 模块和常规功能的前台配置、零代码的开发过程；<br/>
* 快速开发中小型的管理系统、后台管理系统以及大型系统快速原型化；<br/>
* 已有业务系统的商业智能(BI)分析的快速搭建；(可统一管理多个数据库服务器中的多个数据库)<br/>
* 软件开发新方式的极速体验；

### 开发前的准备
* 如果你只想使用本项目来架构你的业务系统，你要会使用一种java开发工具(eclipse)，了解tomcat发布项目的过程，以及有基本的数据库知识；
* 如果你想深入了解本项目中的开发过程和源代码，你需要了解java,spring mvc,hibernate等后台框架,mysql数据库,以及前台框架extjs,echarts等;

### 系统导入安装及运行
* 克隆项目：`git clone https://github.com/jfok1972/quick-build-2018-RC.git`，然后在eclipse中导入项目；<br/>或者在eclipse中从git导入项目：`https://github.com/jfok1972/quick-build-2018-RC.git`；
* 本项目是maven项目，开发工具中必须安装有maven插件，项目导入后会自动安装所有依赖的jar包。

> 请注意：更新依赖jar包时国外的Maven仓库可能会由于网络问题出现错误，有时候tomcat中无法启动项目也是由于这个原因，建议改为阿里云Aliyun仓库，教程请自行网上搜索。

* 创建mysql数据库，脚本在文件在 `/quick-build-2018-RC/WebContent/database/quickbuild-mysql.sql`中；安装时请参阅该目录下的数据库安装说明;
* maven安装好依赖的jar包后，将项目发布到tomcat后启动服务器。
* 打开浏览器输入网址:`localhost:8080/quick-build`运行程序。
* 系统中已建有一个超级管理员(administrator,主要用来进行系统架构)和一个系统管理员(admin,主要用来进行业务系统的相关设置)(初始密码均为:admin,其他用户和新建用户的初始密码均为：123456)。
* 当前版本中的快速构建部分为全开源的系统(遵循GPL3.0协议)；商业数据分析(BI)也集成在本系统内，前台开源但后台不提供源码，并且不能用于生产环境。

### 系统架构与开发资料

[系统的获得安装与运行视频讲解](https://v.youku.com/v_show/id_XMzg2MzUzMDQwNA==.html?spm=a2h0j.11185381.listitem_page1.5~A&&f=51517157)　[(网盘下载)](https://pan.baidu.com/s/1NbQnU3oqyYXuPIeza_MCdQ);<br/>
[快速构建系统开发手册(PDF)](http://www.jhopesoft.com/快速构建系统开发手册.pdf)；<br/>
[快速开发系统extjs4版开发博客专栏](https://blog.csdn.net/column/details/jfok1972-design.html);<br/>
[快速开发系统extjs5版开发博客专栏](https://blog.csdn.net/column/details/extjs5.html);<br/>
[快速开发系统extjs6版(当前版本)开发博客专栏](https://blog.csdn.net/column/details/cfcmms.html);

为了更直观的展示系统开发的速度，特录制了一个20分钟快速搭建某小型业务系统的商业数据分析(BI)的视频，建立数据分析并把查询结果显示在首页上。<br/>
[20分钟快速塔建业务系统的商业数据分析(BI)视频教程](https://v.youku.com/v_show/id_XMzg2MzUzOTg0NA==.html?spm=a2hzp.8253876.0.0&f=51517157)　[(网盘下载)](https://pan.baidu.com/s/1abcc3tLzxTvwJHIcv19Y5w)

### 系统基本功能、业务系统架构以及商业数据分析开发视频教程(不断更新中)

* [系统概述及主页面的说明](https://v.youku.com/v_show/id_XMzg2MzU0MzczMg==.html?spm=a2hzp.8253876.0.0&f=51517157)　[(网盘下载)](https://pan.baidu.com/s/1cjTlvmTRs92QYgEeSH_pjA)；
* [系统所有菜单功能简介](https://v.youku.com/v_show/id_XMzg2MzU0NzMyMA==.html?spm=a2hzp.8253876.0.0&f=51517157)　[(网盘下载)](https://pan.baidu.com/s/1wNqD4tgZlV-174MBxckS7A)；
* [系统模块界面及基本功能简介](https://v.youku.com/v_show/id_XMzg2MzU1MTIwNA==.html?spm=a2h0j.11185381.listitem_page1.5!5~A&&f=51517157)　[(网盘下载)](https://pan.baidu.com/s/1Eh86rew4VHbickXOhkGUGQ)；
* [系统内部配置表结构图说明](https://v.youku.com/v_show/id_XMzg2MzU1NzMwNA==.html?spm=a2h0j.11185381.listitem_page1.5!6~A&&f=51517157)　[(网盘下载)](https://pan.baidu.com/s/1fc_EX5OqZsox4CsApNOVnw)；
* [实体对象和字段及关联关系](http://v.youku.com/v_show/id_XMzg2NDI3NTQyMA==.html?f=51517157)　[(网盘下载)](https://pan.baidu.com/s/1qumypRjiLgPiiCI2bS9ToA)；
* [业务系统第一个模块的导入](http://v.youku.com/v_show/id_XMzg2NzgxNjMxNg==.html)　[(网盘下载)](https://pan.baidu.com/s/1OnObtdwdSjMJOFG0kDojgA)；
* [业务系统第一个模块导航筛选导出](http://v.youku.com/v_show/id_XMzg3MDQ4NTEzMg==.html)　[(网盘下载)](https://pan.baidu.com/s/1_VckK5aXKxC9Eb4ilkcJIA)；
* [业务模块的附件功能](http://v.youku.com/v_show/id_XMzg3ODM0ODU5Mg==.html)　[(网盘下载)](https://pan.baidu.com/s/18G38UQqULcU9dRip69GL_A)；
* [导入第二个模块及多对一字段的使用](http://v.youku.com/v_show/id_XMzg3OTc2MjQ1Ng==.html)　[(网盘下载)](https://pan.baidu.com/s/1Q-lKWS2W2y7a4YmxHE8ADg)；
* [模块的一对多字段及应用场景](http://v.youku.com/v_show/id_XMzg4MjA5NTAwMA==.html)　[(网盘下载)](https://pan.baidu.com/s/1SP767UdBGjcEeZyzjR9wSQ)；
* [导入第三个模块和祖孙关联关系](http://v.youku.com/v_show/id_XMzg4Mzg0Nzg2MA==.html)　[(网盘下载)](https://pan.baidu.com/s/1oWiRlIpiUITBCXCwaHL5hA)；
* [导入系统的其他模块和多级关联关系](http://v.youku.com/v_show/id_XMzg4NTU4OTM5Ng==.html)　[(网盘下载)](https://pan.baidu.com/s/1upiy_p9uWZ0bFV3Vhe8XpQ)；
* [业务数据的导入及订单的基本操作](http://v.youku.com/v_show/id_XMzg4NzI4ODkyNA==.html)　[(网盘下载)](https://pan.baidu.com/s/1sAyuZSG1DuaC2fLsCnPfww)；
* [实体对象附加字段的创建和用法](http://v.youku.com/v_show/id_XMzg4OTA1OTQ5Mg==.html)　[(网盘下载)](https://pan.baidu.com/s/1sgXfQYfrmH48ZOcW8FOZpQ)；
* [复杂的附加字段和sql语句的生成](http://v.youku.com/v_show/id_XMzg5MDY5MjY2MA==.html)　[(网盘下载)](https://pan.baidu.com/s/1ETawoxuVMapEJElAWSPCvA)；
* [模块视图方案的用法](http://v.youku.com/v_show/id_XMzg5MzgzODU1Ng==.html)　[(网盘下载)](https://pan.baidu.com/s/1d6tnCucZcWZgfERd7Fn7FQ)；
* [数据权限的用法和说明(核心功能)](http://v.youku.com/v_show/id_XMzg5Njk2OTUwNA==.html)　[(网盘下载)](https://pan.baidu.com/s/1ikQo5-q3stOcE6KpYGBknA)；
* [可选数据权限的用法和说明(核心功能)](http://v.youku.com/v_show/id_XMzg5ODgzMjM5Ng==.html)　[(网盘下载)](https://pan.baidu.com/s/1Wz5D79Du0Bsh408QtP0Pvg)；
* [模块图表和自定义排序功能](http://v.youku.com/v_show/id_XMzkwNTMzODUyOA==.html)　[(网盘下载)](https://pan.baidu.com/s/1I7HTCCeLzPxZ3ew73LUATw)；
* [业务系统加入工作流](http://v.youku.com/v_show/id_XMzkxNzgyOTI3Ng==.html)　[(网盘下载)](https://pan.baidu.com/s/1pJWj_TlMkkWi9WZ2FVNrvQ)；

### 商业数据分析(BI)的使用(此功能为本系统的最终目标。不断更新中)
* [商业智能分析(BI)的使用(1)选择分析字段、行展开、列展开、分析方案、字段列行的方案的初步介绍](http://v.youku.com/v_show/id_XMzkxOTI3NzUxNg==.html)　[(网盘下载)](https://pan.baidu.com/s/1P8YcL0Eh_RpGWwszOmHmGQ)；
* [商业智能分析(BI)的使用(2)聚合字段的设置](http://v.youku.com/v_show/id_XMzkxOTM3MDI5Ng==.html)　[(网盘下载)](https://pan.baidu.com/s/1j2XHVBJjpes0QOVslh_NFg)；
* [商业智能分析(BI)的使用(3)可分组字段或表达式的设置](http://v.youku.com/v_show/id_XMzkzNTgxMTYyNA==.html)　[(网盘下载)](https://pan.baidu.com/s/1rszDyRuOx3__FXU5eIVxZw)；
* 商业数据分析(BI)的进阶功能及图表；

### 系统源码分析和开发视频


### 建议和意见
* 如在使用过程中有任何建立或意见，以及发现有bug请联系我。

### 新版本的展望
* 新版本的开正在筹备中，后台准备使用spring boot,前台使用react + antd开发，如您有能力且有兴趣想参与后续版本的开发，可以与我联系。


开始加入吧！

