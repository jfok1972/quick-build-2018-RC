package com.jhopesoft.framework.context;

public class ProjectContext {
	/**
	 * 获取项目空间 
	 * @return
	 */
	private static ProjectSpace projectSpace;
	
	public static ProjectSpace getProjectSpace() {
		if(projectSpace == null){
			projectSpace = new ProjectSpace();
		}
		return projectSpace;
	}

	public void setProjectSpace(ProjectSpace projectSpace) {
		ProjectContext.projectSpace = projectSpace;
	}

}
