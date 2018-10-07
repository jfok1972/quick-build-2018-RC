package com.jhopesoft.framework.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import com.jhopesoft.framework.exception.FileStreamException;

public class FileUtils {

	public static FileInputStream getFileInputStream(File file) {
		try {
			return new FileInputStream(file);
		} catch (FileNotFoundException e) {
			throw new FileStreamException(e);
		}
	}

	public static FileOutputStream getFileOutputStream(File file) {
		try {
			return new FileOutputStream(file);
		} catch (FileNotFoundException e) {
			throw new FileStreamException(e);
		}
	}

	public static long copy(File input, File output) {
		return copy(getFileInputStream(input), getFileOutputStream(output));
	}

	public static long copy(InputStream input, File output) {
		return copy(input, getFileOutputStream(output));
	}

	public static long copy(File input, OutputStream output) {
		return copy(getFileInputStream(input), output);
	}

	/**
	 * 文件复制
	 * @param is
	 * @param os
	 * @return 字节数
	 */
	public static long copy(InputStream is, OutputStream os) {
		try {
			BufferedInputStream bis = null;
			BufferedOutputStream bos = null;
			try {
				bis = is instanceof BufferedInputStream ? (BufferedInputStream) is : new BufferedInputStream(is);
				bos = os instanceof BufferedOutputStream ? (BufferedOutputStream) os : new BufferedOutputStream(os);
				int n = -1;
				while ((n = bis.read()) != -1) {
					bos.write(n);
				}
			} finally {
				if (bis != null)
					bis.close();
				if (bos != null)
					bos.close();
			}
		} catch (Exception e) {
			throw new FileStreamException(e);
		}
		return 0L;
	}

	public static long copy(InputStream is, StringBuffer sb) {
		try {
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			try {
				String n = null;
				while ((n = br.readLine()) != null) {
					sb.append(n);
				}
			} finally {
				if (br != null)
					br.close();
			}
		} catch (Exception e) {
			throw new FileStreamException(e);
		}
		return 0L;
	}



	/**
	 * 获取目录下的所有文件
	 * @param parent: 目录
	 * @param onlyDir: 是否只取子目录
	 * @return
	 */
	public static List<File> getAllChildFiles(File parent, final boolean onlyDir) {
		return getAllChildFiles(parent, onlyDir, null, null, null, null);
	}

	/**
	 * 获取目录下的所有文件
	 * @param parent: 目录
	 * @param onlyDir: 是否只取子目录
	 * @param dirRegex: 取目录匹配正则表达式
	 * @param dirIgnoreRegex: 取目录不匹配正则表达式
	 * @param fileRegex: 取文件匹配正则表达式
	 * @param fileIgnoreRegex: 取文件不匹配正则表达式
	 * @return
	 */
	public static List<File> getAllChildFiles(File parent, boolean onlyDir, String dirRegex, String dirIgnoreRegex,
			String fileRegex, String fileIgnoreRegex) {
		List<File> list = new ArrayList<File>();
		getAllChildFiles(list, parent, onlyDir, dirRegex, dirIgnoreRegex, fileRegex, fileIgnoreRegex);
		return list;
	}

	private static void getAllChildFiles(List<File> list, File parent, boolean onlyDir, String dirRegex,
			String dirIgnoreRegex, String fileRegex, String fileIgnoreRegex) {
		List<File> files = getChildFiles(parent, onlyDir, dirRegex, dirIgnoreRegex, fileRegex, fileIgnoreRegex);
		for (int i = 0; i < files.size(); i++) {
			File file = files.get(i);
			list.add(file);
			if (file.isDirectory()) {
				getAllChildFiles(list, file, onlyDir, dirRegex, dirIgnoreRegex, fileRegex, fileIgnoreRegex);
			}
		}
	}

	/**
	 * 获取目录下的所有文件
	 * @param parent: 目录
	 * @param onlyDir: 是否只取子目录
	 * @return
	 */
	public static List<File> getChildFiles(File parent, final boolean onlyDir) {
		return getChildFiles(parent, onlyDir, null, null, null, null);
	}

	/**
	 * 获取目录下的所有文件
	 * @param parent: 目录
	 * @param onlyDir: 是否只取子目录
	 * @param dirRegex: 取目录匹配正则表达式
	 * @param dirIgnoreRegex: 取目录不匹配正则表达式
	 * @param fileRegex: 取文件匹配正则表达式
	 * @param fileIgnoreRegex: 取文件不匹配正则表达式
	 * @return
	 */
	public static List<File> getChildFiles(File parent, final boolean onlyDir, final String dirRegex,
			final String dirIgnoreRegex, final String fileRegex, final String fileIgnoreRegex) {
		File[] fs = parent.listFiles(new FileFilter() {
			public boolean accept(File pathname) {
				if (onlyDir && !pathname.isDirectory())
					return false;
				String name = pathname.getName();
				if (pathname.isDirectory()) {
					if (dirRegex != null && !name.matches(dirRegex))
						return false;
					if (dirIgnoreRegex != null && name.matches(dirIgnoreRegex))
						return false;
				} else {
					if (fileRegex != null && !name.matches(fileRegex))
						return false;
					if (fileIgnoreRegex != null && name.matches(fileIgnoreRegex))
						return false;
				}
				return true;
			}
		});
		List<File> files = new ArrayList<File>();
		if (fs != null) {
			for (int i = 0; i < fs.length; i++) {
				if (fs[i].isDirectory())
					files.add(fs[i]);
			}
			for (int i = 0; i < fs.length; i++) {
				if (!fs[i].isDirectory())
					files.add(fs[i]);
			}
		}
		return files;
	}

	/**
	 * 删除目录（文件夹）以及目录下的文件
	 * @param sPath 被删除目录的文件路径
	 * @return 目录删除成功返回true，否则返回false
	 */
	public static boolean deleteDirectory(Object sPath) {
		return deleteDirectory(sPath, false);
	}

	/**
	 * 删除目录（文件夹）以及目录下的文件
	 * @param sPath 被删除目录的文件路径
	 * @param deldir 是否删除根目录
	 * @return 目录删除成功返回true，否则返回false
	 */
	public static boolean deleteDirectory(Object sPath, boolean deldir) {
		File dirFile = null;
		if (sPath instanceof String) {
			if (!((String) sPath).endsWith(File.separator)) {
				sPath = sPath + File.separator;
			}
			dirFile = new File((String) sPath);
		} else {
			dirFile = (File) sPath;
		}
		if (!dirFile.exists() || !dirFile.isDirectory()) {
			return false;
		}
		boolean flag = true;
		File[] files = dirFile.listFiles();
		for (int i = 0; i < files.length; i++) {
			if (files[i].isFile()) {
				flag = deleteFile(files[i].getAbsolutePath());
				if (!flag)
					break;
			} else {
				flag = deleteDirectory(files[i].getAbsolutePath(), deldir);
				if (!flag)
					break;
			}
		}
		if (!flag)
			return false;
		if (!deldir)
			return true;
		if (dirFile.delete()) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 删除单个文件
	 * @param sPath 被删除文件的文件名
	 * @return 单个文件删除成功返回true，否则返回false
	 */
	public static boolean deleteFile(String sPath) {
		boolean flag = false;
		File file = new File(sPath);
		if (file.isFile() && file.exists()) {
			file.delete();
			flag = true;
		}
		return flag;
	}

}
