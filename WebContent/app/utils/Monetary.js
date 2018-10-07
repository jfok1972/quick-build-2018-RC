/**
 * 金额单位的管理类
 */
Ext.define('app.utils.Monetary', {
  alternateClassName : 'Monetary',
  statics : {
    values : null,
    getAllMonetary : function() {
      if (!this.values) {
        // 初始化各种金额单位 元 千元 万元 百万元 亿元
        this.values = new Ext.util.MixedCollection();
        this.values.add('unit', this.createAMonetary('', 1, '个'));
        this.values.add('thousand', this.createAMonetary('千', 1000, '千'));
        this.values.add('tenthousand', this.createAMonetary('万', 10000, '万'));
        this.values.add('million', this.createAMonetary('M', 100 * 10000, '百万'));
        this.values.add('hundredmillion', this.createAMonetary('亿', 10000 * 10000, '亿'));
      }
      return this.values;
    },
    // 生成菜单中的 items
    getMonetaryMenu : function(param) {
      var items = [];
      this.getAllMonetary().eachKey(function(key, item) {
        var obj = {
          text : item.unittext,
          value : key
        }
        if (param) {
          for (var i in param)
            obj[i] = param[i];
        }
        // console.log(obj);
        items.push(obj);
      });
      return items;
    },
    createAMonetary : function(monetaryText, monetaryUnit, unittext) {
      return {
        monetaryColoredText : monetaryText ? '<span style="color:green;">' + monetaryText + '</span>' : '',
        monetaryText : monetaryText, // 跟在数值后面的金额单位文字,如
        // 100.00万
        monetaryUnit : monetaryUnit, // 显示的数值需要除的分子
        unittext : unittext
        // 跟在字段后面的单位如 合同金额(万元)
      };
    },
    getMonetary : function(key) {
      return this.getAllMonetary().get(key);
    },
    getMonetaryUnit : function(key) {
      return this.getAllMonetary().get(key).monetaryUnit;
    }
  }
});