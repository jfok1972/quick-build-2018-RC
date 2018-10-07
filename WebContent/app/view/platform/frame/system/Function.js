Ext.define('app.view.platform.frame.system.Function', {
  alternateClassName : 'systemFunction',
  requires : ['app.view.platform.design.userdefinefield.DesignWindow',
      'app.view.platform.design.datafilterCondition.DesignWindow'],
  statics : {
    /**
     * 为当前选中的人员创建一个登录用户
     */
    createPersonnelUser : function(param) {
      var personnelid = param.record.getIdValue(),
        mess = "为人员『" + param.record.getTitleTpl() + "』创建用户";
      EU.RS({
        url : 'platform/systemframe/createpersonnaluser.do',
        disableMask : false,
        params : {
          personnelid : personnelid
        },
        callback : function(result) {
          if (result.success) {
            Ext.Msg.show({
              title : '操作完成',
              message : mess + '成功!<br/><br/>' + result.message + '<br/><br/>请尽快通知其修改密码，并在用户模块中给其加入权限！',
              buttons : Ext.Msg.OK,
              icon : Ext.Msg.INFO
            })
            param.grid.refreshRecord(param.record);
          } else {
            Ext.Msg.show({
              title : '操作失败',
              message : mess + '失败!<br/><br/>' + '原因：' + result.message,
              buttons : Ext.Msg.OK,
              icon : Ext.Msg.ERROR
            })
          }
        }
      })
    },
    /**
     * 将模块方案，加入到系统模块中和公司模块中，并加入基本权限可浏览
     */
    addtoCompanyModule : function(param) {
      var homepageschemeid = param.record.getIdValue(),
        mess = "模块方案加入到公司模块中";
      EU.RS({
        url : 'platform/module/addtocompanymodule.do',
        disableMask : false,
        params : {
          homepageschemeid : homepageschemeid
        },
        callback : function(result) {
          if (result.success) {
            EU.toastInfo(mess + '成功!<br/><br/>加入的公司有：' + result.msg);
          } else {
            Ext.Msg.show({
              title : '操作失败',
              message : mess + '加入失败!<br/><br/>' + '原因：' + result.msg,
              buttons : Ext.Msg.OK,
              icon : Ext.Msg.ERROR
            })
          }
        }
      })
    },
    testDataSource : function(param) {
      var datasourceid = param.record.getIdValue();
      EU.RS({
        url : 'platform/datasource/testconnect.do',
        timeout : 60 * 1000,
        disableMask : false,
        params : {
          datasourceid : datasourceid
        },
        callback : function(result) {
          if (result.success) {
            EU.toastInfo('<span style="font-weight:400;color:green;">数据源连接测试成功!</span><br/><br/>连接字符串：' + result.tag);
          } else {
            Ext.Msg.show({
              title : '数据源连接测试失败',
              message : '连接字符串：' + result.tag + '<br/><br/>错误原因：' + result.msg,
              buttons : Ext.Msg.OK,
              icon : Ext.Msg.ERROR
            })
          }
        }
      })
    },
    breakDataSource : function(param) {
      var datasourceid = param.record.getIdValue();
      EU.RS({
        url : 'platform/datasource/breakconnect.do',
        timeout : 60 * 1000,
        disableMask : false,
        params : {
          datasourceid : datasourceid
        },
        callback : function(result) {
          if (result.success) {
            EU.toastInfo('数据源已从后台断开。');
          } else {
            Ext.Msg.show({
              title : '数据源断开失败',
              message : '<br/>错误原因：' + result.msg,
              buttons : Ext.Msg.OK,
              icon : Ext.Msg.ERROR
            })
          }
        }
      })
    },
    /**
     * 发布一个工作流
     * @param {} param
     */
    deployWorkFlow : function(param) {
      var workflowid = param.record.getIdValue();
      EU.RS({
        url : 'platform/workflowdesign/deploy.do',
        disableMask : true,
        params : {
          workflowid : workflowid
        },
        callback : function(result) {
          if (result.success) {
            EU.toastInfo("工作流已发布成功!");
            param.grid.getStore().reload();
          } else {
            Ext.Msg.show({
              title : '工作流发布失败',
              message : '<br/>' + result.msg,
              buttons : Ext.Msg.OK,
              icon : Ext.Msg.ERROR
            })
          }
        }
      })
    },
    /**
    * 刷新一个表的字段，将新增的字段导入到fdataobjectfield中
    * @param {} param
    */
    refreshFields : function(param) {
      // 找到当前父模块筛选的模块字段或者导航中的模块字段
      var parentobject = param.grid.getParentOrNavigateIdAndText('FDataobject');
      if (!parentobject) {
        EU.toastWarn('请先在导航列表中选择一个模块！');
        return;
      }
      EU.RS({
        url : 'platform/database/refreshtablefields.do',
        params : {
          objectid : parentobject.id
        },
        callback : function(result) {
          if (result.success) {
            if (result.tag) {
              EU.toastInfo('已成功刷新字段，共加入了 ' + result.tag + ' 个字字段, 字段名称是:<br/>' + result.msg);
              param.grid.getStore().reload();
            } else EU.toastInfo('没有发现新加入的字段');
          }
        }
      })
    },
    /**
     * 刷新一个表的字段，将新增的字段导入到fdataobjectfield中
     * @param {} param
     */
    refreshObjectFields : function(param) {
      var objectid = param.record.id;
      EU.RS({
        url : 'platform/database/refreshtablefields.do',
        params : {
          objectid : objectid
        },
        callback : function(result) {
          if (result.success) {
            if (result.tag) {
              EU.toastInfo('已成功刷新字段，共加入了 ' + result.tag + ' 个字字段, 字段名称是:<br/>' + result.msg);
              param.record.refreshRecord();
            } else EU.toastInfo('没有发现新加入的字段');
          }
        }
      })
    },
    // 已取消
    editUserDefineFieldExpression : function(param) {
      var record = param.record;
      if (record.get('fieldname').indexOf('udf') != 0) {
        EU.toastWarn('自定义字段的名称必须以 udf 开头');
        return;
      }
      Ext.widget('userdefinefielddesignwindow', param).show();
    },
    // 导入导航中所选择实体对象的所有可分组字段
    importDataminingExpandGroup : function(param) {
      // config = {
      // grid : grid,
      // moduleInfo : grid.moduleInfo,
      // objectName : grid.moduleInfo.fDataobject.objectname
      // };
      // 查找在导航模块里或者父模块限定中有没有实体对象。
      var dataobjectvalue = param.grid.getParentOrNavigateIdAndText('FDataobject');
      if (dataobjectvalue) {
        EU.RS({
          url : 'platform/datamining/importexpandgroup.do',
          params : {
            dataobjectid : dataobjectvalue.id
          },
          callback : function(result) {
            if (result.success) {
              EU.toastInfo(dataobjectvalue.text + ' 的所有可分组字段导入成功，共加入了 ' + result.tag + '条记录！');
              param.grid.refreshAll();
            }
          }
        })
      } else {
        EU.toastInfo('请先在导航中选择一个实体对象再进行此操作！');
      }
    },
    // 刷新当前模块的所有父模块
    refreshParentDefine : function(param) {
      var dataobjectvalue = param.grid.getParentOrNavigateIdAndText('FDataobject');
      if (dataobjectvalue) {
        EU.RS({
          url : 'platform/dataobjectparentdefine/refreshparentdefine.do',
          params : {
            dataobjectid : dataobjectvalue.id
          },
          callback : function(result) {
            if (result.success) {
              EU.toastInfo(dataobjectvalue.text + ' 的父模块刷新成功，共加入了 ' + result.tag + '条记录！');
              param.grid.refreshAll();
            }
          }
        })
      } else {
        EU.toastInfo('请先在导航中选择一个实体对象再进行此操作！');
      }
    },
    createOneToManyField : function(param) {
      var record = param.record;
      if (record.get('fieldrelation').toLowerCase() != 'manytoone') {
        EU.toastWarn('请选择一个多对一(manytoone)的字段！');
        return;
      }
      var mess = '模块『' + record.get('fieldtitle') + '』中建立『' + record.get('FDataobject.title') + '』的一对多关系';
      Ext.MessageBox.confirm('确定', '确定要在' + mess + '吗?', function(btn) {
        if (btn == 'yes') {
          Ext.Ajax.request({
            method : 'POST',
            url : 'platform/dataobjectfield/createonetomanyfield.do',
            params : {
              // fieldtype : record.get('fieldtype'),
              // linkedobjectid : record.get('FDataobject.objectid'),
              fieldid : record.get('fieldid')
            },
            success : function(response) {
              var result = Ext.decode(response.responseText, true);
              if (result.success) {
                Ext.Msg.show({
                  title : '操作成功',
                  message : mess + '已成功!',
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.INFO
                })
              } else {
                Ext.Msg.show({
                  title : '操作失败',
                  message : mess + '失败!<br/><br/>原因：' + result.msg,
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.INFO
                })
              }
            },
            failure : function(response) {
              Ext.Msg.alert('错误', mess + '失败!');
            }
          })
        }
      })
    },
    createManyToManyField : function(param) {
      var records = param.records,
        r1 = records[0],
        r2 = records[1];
      if (r1.get('FDataobject.objectid') != r2.get('FDataobject.objectid')) {
        EU.toastWarn('请选择相同模块下的二个字段！');
        return;
      }
      if (r1.get('fieldrelation').toLowerCase() != 'manytoone' || r2.get('fieldrelation').toLowerCase() != 'manytoone') {
        EU.toastWarn('请选择二个多对一(manytoone)的字段！');
        return;
      }
      var mess = '模块『' + r1.get('fieldtitle') + '』和『' + r2.get('fieldtitle') + '』之间建立多对多关系';
      Ext.MessageBox.confirm('确定', '确定要在' + mess + '吗?', function(btn) {
        if (btn == 'yes') {
          Ext.Ajax.request({
            method : 'POST',
            url : 'platform/dataobjectfield/createmanytomanyfield.do',
            params : {
              fieldid1 : r1.get('fieldid'),
              fieldid2 : r2.get('fieldid'),
              linkedobjectid : r1.get('FDataobject.objectid')
            },
            success : function(response) {
              var result = Ext.decode(response.responseText, true);
              if (result.success) {
                Ext.Msg.show({
                  title : '操作成功',
                  message : mess + '已成功!',
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.INFO
                })
              } else {
                Ext.Msg.show({
                  title : '操作失败',
                  message : mess + '失败!<br/><br/>原因：' + result.msg,
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.INFO
                })
              }
            },
            failure : function(response) {
              Ext.Msg.alert('错误', mess + '失败!');
            }
          })
        }
      })
    },
    resetPassword : function(param) {
      var record = param.record;
      var mess = '用户『' + record.getTitleTpl() + '』的密码';
      Ext.MessageBox.confirm('确定重置', '确定要重置' + mess + '吗?', function(btn) {
        if (btn == 'yes') {
          Ext.Ajax.request({
            method : 'POST',
            url : 'platform/systemframe/resetpassword.do',
            params : {
              userid : record.get('userid')
            },
            success : function(response) {
              Ext.Msg.show({
                title : '密码重置成功',
                message : mess + '已重置为123456，请通知其尽快修改!',
                buttons : Ext.Msg.OK,
                icon : Ext.Msg.INFO
              })
            },
            failure : function(response) {
              Ext.Msg.alert('错误', mess + '重置失败!');
            }
          })
        }
      })
    },
    updateAdditionFuntionToCModule : function(param) {
      var record = param.record;
      var mess = '将『' + record.getTitleTpl() + '』更新到所有公司的模块功能里';
      Ext.MessageBox.confirm('更新附加功能', '确定要' + mess + '吗?', function(btn) {
        if (btn == 'yes') {
          Ext.Ajax.request({
            method : 'POST',
            url : 'platform/userrole/updateadditionfunctiontocmodule.do',
            params : {
              functionid : record.getIdValue()
            },
            success : function(response) {
              var result = Ext.decode(response.responseText, true);
              if (result.success) {
                Ext.Msg.show({
                  title : '操作成功',
                  message : mess + '成功!<br/><br/>更新的公司有：' + result.msg,
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.INFO
                });
              } else {
                Ext.Msg.show({
                  title : '操作失败',
                  message : mess + '创建失败!<br/><br/>' + '原因：' + result.msg,
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.ERROR
                })
              }
            },
            failure : function(response) {
              Ext.Msg.alert('错误', mess + '失败!');
            }
          })
        }
      })
    },
    createUserView : function(param) {
      var record = param.record;
      var mess = '创建视图『' + record.getTitleTpl() + '』';
      Ext.MessageBox.confirm('创建视图', '确定要' + mess + '吗?', function(btn) {
        if (btn == 'yes') {
          Ext.Ajax.request({
            method : 'POST',
            url : 'platform/database/createuserview.do',
            params : {
              viewid : record.getIdValue()
            },
            success : function(response) {
              var result = Ext.decode(response.responseText, true);
              if (result.success) {
                Ext.Msg.show({
                  title : '操作成功',
                  message : mess + '成功!',
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.INFO
                });
              } else {
                Ext.Msg.show({
                  title : '操作失败',
                  message : mess + '创建失败!<br/><br/>' + '原因：' + result.msg,
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.ERROR
                })
              }
              param.grid.getStore().reload();
            },
            failure : function(response) {
              Ext.Msg.alert('错误', mess + '失败!');
            }
          })
        }
      })
    },
    dropUserView : function(param) {
      var record = param.record;
      var mess = '删除视图『' + record.getTitleTpl() + '』';
      Ext.MessageBox.confirm('删除视图', '确定要' + mess + '吗?', function(btn) {
        if (btn == 'yes') {
          Ext.Ajax.request({
            method : 'POST',
            url : 'platform/database/dropuserview.do',
            params : {
              viewid : record.getIdValue()
            },
            success : function(response) {
              var result = Ext.decode(response.responseText, true);
              if (result.success) {
                Ext.Msg.show({
                  title : '操作成功',
                  message : mess + '成功!',
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.INFO
                });
              } else {
                Ext.Msg.show({
                  title : '操作失败',
                  message : mess + '删除失败!<br/><br/>' + '原因：' + result.msg,
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.ERROR
                })
              }
              param.grid.getStore().reload();
            },
            failure : function(response) {
              Ext.Msg.alert('错误', mess + '失败!');
            }
          })
        }
      })
    },
    submitAproval : function(param) {
      var record = param.record;
      // 提交审批
      EU.showMsg({
        title : '提示信息',
        message : '确定提交『<em>' + record.getNameValue() + '</em>』审批吗？',
        option : 1,
        callback : function(rt) {
          if (rt == 'yes') {
            var url = "platform/workflow/runtime/startprocessinstance.do";
            EU.RS({
              url : url,
              scope : this,
              params : {
                key : record.entityName,
                formid : record.getIdValue()
              },
              callback : function(result) {
                if (result.success) {
                  EU.toastInfo("启动成功!");
                } else {
                  EU.toastError(result.message);
                }
              }
            });
          }
        }
      });
    }
  }
})
