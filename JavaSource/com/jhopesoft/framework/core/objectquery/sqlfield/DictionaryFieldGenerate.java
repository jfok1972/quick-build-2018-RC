package com.jhopesoft.framework.core.objectquery.sqlfield;

import com.jhopesoft.framework.core.jdbc.SqlFunction;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dictionary.FDictionary;

public class DictionaryFieldGenerate {

	public static String getDictionaryTextField(String fieldname, FDictionary dictionary) {
		SqlFunction sf = Local.getDao().getSf();
		String titleField = "title";

		if (dictionary.getIsdisplaycode()) {
			titleField = sf.link(new String[] { "vcode", "'-'", titleField });
		}

		if (dictionary.getIsdisplayorderno()) {
			titleField = sf.link(new String[] { "orderno", "'-'", titleField });
		}

		String linkname = dictionary.getIslinkedorderno() ? "orderno"
				: dictionary.getIslinkedcode() ? "vcode" : dictionary.getIslinkedtext() ? "title" : "ddetailid";

		String result = "( select " + titleField + " from f_dictionarydetail f_d_d where f_d_d.dictionaryid = '"
				+ dictionary.getDictionaryid() + "' and f_d_d." + linkname + " = " + fieldname + " )";

		return result;
	}

}
