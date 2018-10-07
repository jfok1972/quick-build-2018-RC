package com.jhopesoft.platform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.viewsetting.FovHomepagescheme;

@Service
public class ModuleSchemeService {

  @Autowired
  private DaoImpl dao;

  public FovHomepagescheme getModuleSchemeInfo(String moduleschemeid) {
    return dao.findById(FovHomepagescheme.class, moduleschemeid);
  }

}
