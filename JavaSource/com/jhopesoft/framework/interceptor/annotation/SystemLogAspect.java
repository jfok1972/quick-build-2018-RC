package com.jhopesoft.framework.interceptor.annotation;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jhopesoft.framework.critical.Local;

@Aspect
public class SystemLogAspect {

	// 本地异常日志记录对象
	private static final Logger logger = LoggerFactory.getLogger(SystemLogAspect.class);

	// Service层切点
	@Pointcut("execution(* com.jhopesoft..*.service.*Service.*(..))")
	public void serviceAspect() {
	}

	// Controller层切点
	@Pointcut("execution(* com.jhopesoft..*.controller.*.*(..))")
	public void controllerAspect() {
	}

	@Before(value = "controllerAspect()")
	public void doBefore(JoinPoint joinPoint) {
		try {

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("异常信息:{}", e.getMessage());
		}
	}

	@Around(value = "controllerAspect()")
	public Object aroundPointcut(ProceedingJoinPoint pjp) throws Throwable {
		Object retVal;
		try {
			retVal = pjp.proceed();
		} finally {
			if (Local.isRemoteBusinessDao() && Local.getBusinessDao() != null) {
				Local.getBusinessDao().close();// 关闭业务数据库的当前dao
				System.out.println("业务business:close");
			}
			// Local.setCriticalObject(null); 不能设置为null，fastjson会找不到dao
		}
		return retVal;
	}

	@AfterThrowing(pointcut = "controllerAspect()", throwing = "e")
	public void doControllerAfterThrowing(JoinPoint joinPoint, Throwable e) {
		writeErrorLog(joinPoint, e);
	}

	@AfterThrowing(pointcut = "serviceAspect()", throwing = "e")
	public void doServiceAfterThrowing(JoinPoint joinPoint, Throwable e) {
		writeErrorLog(joinPoint, e);
	}

	private void writeErrorLog(JoinPoint joinPoint, Throwable e) {
		try {

		} catch (Exception ex) {
			// ex.printStackTrace();
			System.out.println("异常信息:" + ex.getMessage());
			logger.error("异常信息:{}", ex.getMessage());
		}
	}
}
