package com.jhopesoft.framework.utils;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.CRC32;
import java.util.zip.CheckedOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CommonFunction {

	/**
	 * 根据传进来的code,找出所有的数字组，把最后一组＋1后返回
	 * 
	 * 例如传入 "熙旺1123产(2007)第001号"，反回 熙旺1123产(2007)第002号
	 * 
	 * @param code
	 * @return
	 */
	public static String getNextCode(String code) {
		Pattern pattern = Pattern.compile("(\\d+)");
		Matcher matcher = pattern.matcher(code);
		StringBuffer resultBuffer = new StringBuffer();
		int pos = -1;
		while (matcher.find()) {
			pos++;
		}
		if (pos == -1)
			return code + "-1";
		int i = -1;
		matcher = pattern.matcher(code);
		while (matcher.find()) {
			i++;
			if (i == pos) {
				Integer next = Integer.parseInt(matcher.group()) + 1;
				int len = matcher.group().length();
				String p = next.toString();
				for (int j = p.length(); j < len; j++)
					p = "0" + p;
				matcher.appendReplacement(resultBuffer, p);
			} else
				matcher.appendReplacement(resultBuffer, matcher.group());
		}
		matcher.appendTail(resultBuffer);
		return resultBuffer.toString();
	}

	public static HttpServletResponse downloadFileError(HttpServletResponse response, String errorMessage, Exception e)
			throws IOException {
		byte[] buffer = e.getClass().getName().getBytes("utf-8");
		if (errorMessage != null)
			buffer = errorMessage.getBytes("utf-8");
		long l = buffer.length;
		String fn = "下载文件时发生错误.txt";
		response.reset();
		response.addHeader("Content-Disposition", "attachment;filename=" + getDownLoadFileName(fn));
		response.addHeader("Content-Length", "" + l);
		OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
		response.setContentType("application/octet-stream");
		toClient.write(buffer);
		toClient.flush();
		toClient.close();
		return response;
	}

	public static HttpServletResponse download(OutputStream os, String downloadfilename, HttpServletResponse response)
			throws IOException {

		InputStream br = new ByteArrayInputStream(((ByteArrayOutputStream) os).toByteArray());
		return download(br, downloadfilename, "attachment", response);
	}

	public static HttpServletResponse downloadAndOpen(OutputStream os, String downloadfilename,
			HttpServletResponse response) throws IOException {

		InputStream br = new ByteArrayInputStream(((ByteArrayOutputStream) os).toByteArray());
		return download(br, downloadfilename, "inline", response);
	}

	public static HttpServletResponse downloadAndOpenPdf(OutputStream os, String downloadfilename,
			HttpServletResponse response) throws IOException {
		InputStream br = new ByteArrayInputStream(((ByteArrayOutputStream) os).toByteArray());
		response.addHeader("Content-Length", "" + br.available());
		response.setContentType("application/pdf;charset=gb2312");
		response.addHeader("Content-Disposition", "inline;filename=" + getDownLoadFileName(downloadfilename));
		CommonUtils.writeStreamToResponse(br, response);
		return response;
	}

	public static HttpServletResponse download(InputStream br, String downloadfilename, String attachmentORinline,
			HttpServletResponse response) throws IOException {
		response.reset();
		response.setBufferSize(5 * 1024 * 1024);
		// inline 支持在线打开，attachment 下载
		response.addHeader("Content-Disposition",
				attachmentORinline + ";filename=" + getDownLoadFileName(downloadfilename));
		// response.addHeader("Content-Length", "" + os...length());
		response.setContentType("application/octet-stream");
		OutputStream out = response.getOutputStream();
		byte[] buffer = new byte[1024 * 10];
		int len = 0;
		try {
			while ((len = br.read(buffer)) > 0) {
				out.write(buffer, 0, len);
				out.flush();
			}
		} catch (Exception e) {
		} finally {
			br.close();
			out.close();
		}
		return response;
	}

	/**
	 * chrome在下载文件的时候，文件名中不能有,号，如果有的话，需要包在双引号之间 删除不能用做文件名的符号
	 * 
	 * @param filename
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public static String getDownLoadFileName(String filename) throws UnsupportedEncodingException {
		return "\""
				+ new String(filename.getBytes("utf-8"), "iso8859-1").replace('"', '\'').replace('/', ' ').replace('\\', ' ')
						.replace(':', ' ').replace('*', ' ').replace('<', ' ').replace('>', ' ').replace('|', ' ').replace('?', ' ')
				+ "\"";
	}

	private static Integer count = 0;
	private static String lastDate = null;

	// 取得序号，每一分钟从头开始计数
	public static synchronized String genOrderNumberWithDate() {
		SimpleDateFormat sdf = new SimpleDateFormat("yy-MM-dd-HHmm");
		String dataString = sdf.format(new Date());
		if (dataString.equals(lastDate)) {
			count++;
		} else {
			lastDate = dataString;
			count = 1;
		}
		return dataString + count;
	}

	public static String getIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip))
			ip = request.getHeader("Proxy-Client-IP");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip))
			ip = request.getHeader("WL-Proxy-Client-IP");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip))
			ip = request.getRemoteAddr();
		return ip;
	}

	public static Boolean Zipfile(String filename, String zipfilename) {
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(filename), "ISO8859_1"));
			FileOutputStream f = new FileOutputStream(zipfilename);
			CheckedOutputStream ch = new CheckedOutputStream(f, new CRC32());
			ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(ch));
			int c;
			out.putNextEntry(new ZipEntry(filename));
			while ((c = in.read()) != -1)
				out.write(c);
			in.close();
			out.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public static String encodeByMD5(String str) {
		if (str == null) {
			return null;
		}
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("MD5");
			messageDigest.update(str.getBytes());
			return getFormattedText(messageDigest.digest());
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

	}

	private static String getFormattedText(byte[] bytes) {
		int len = bytes.length;
		StringBuilder buf = new StringBuilder(len * 2);
		for (int j = 0; j < len; j++) {
			buf.append(HEX_DIGITS[(bytes[j] >> 4) & 0x0f]);
			buf.append(HEX_DIGITS[bytes[j] & 0x0f]);
		}
		return buf.toString();
	}

	private static final char[] HEX_DIGITS = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e',
			'f' };
}
