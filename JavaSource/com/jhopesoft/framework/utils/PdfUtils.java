package com.jhopesoft.framework.utils;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.lang3.SystemUtils;
import org.jodconverter.OfficeDocumentConverter;
import org.jodconverter.document.DefaultDocumentFormatRegistry;
import org.jodconverter.document.DocumentFormat;
import org.jodconverter.office.DefaultOfficeManagerBuilder;
import org.jodconverter.office.ExternalOfficeManagerBuilder;
import org.jodconverter.office.OfficeException;
import org.jodconverter.office.OfficeManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PdfUtils {
  private static final Logger logger = LoggerFactory.getLogger(PdfUtils.class);

  public static final String PARAMETER_OFFICE_HOME = "office.home";
  public static final String PARAMETER_OFFICE_PORT = "office.port";
  public static final String PARAMETER_OFFICE_PROFILE = "office.profile";
  private static OfficeManager officeManager;
  private static OfficeDocumentConverter documentConverter;
  private static DefaultDocumentFormatRegistry formatReg = DefaultDocumentFormatRegistry.create();

  public static DocumentFormat getFormatByFileExtension(String extension) {
    return formatReg.getFormatByExtension(extension);
  }

  public static boolean convert(File inputFile, File outputFile) {
    return convert(inputFile, null, outputFile, null);
  }

  public static boolean convert(InputStream inputStream, OutputStream outputStream) {
    return convert(inputStream, null, outputStream, null);
  }

  public static boolean convert(InputStream inputStream, OutputStream outputStream, DocumentFormat outputFormat) {
    return convert(inputStream, null, outputStream, outputFormat);
  }

  public static boolean convert(InputStream inputStream, OutputStream outputStream, String inputExtension,
      String outputExtension) {
    return convert(inputStream, PdfUtils.getFormatByFileExtension(inputExtension), outputStream,
        PdfUtils.getFormatByFileExtension(outputExtension));
  }

  public static boolean convert(InputStream inputStream, OutputStream outputStream, DocumentFormat inputFormat,
      DocumentFormat outputFormat) {
    return convert(inputStream, inputFormat, outputStream, outputFormat);
  }

  /**
   * 文件转换为pdf
   * 
   * @param input file或 InputStream
   * @param inputFormat
   * @param output file或 OutputStream
   * @param outputFormat
   * @return
   */
  private static boolean convert(Object input, DocumentFormat inputFormat, Object output, DocumentFormat outputFormat) {
    if (documentConverter == null) try {
      initOpenOffice();
    } catch (IOException | OfficeException e1) {
      e1.printStackTrace();
      throw new RuntimeException(e1);
    }
    File inputFile = null, outputFile = null;
    boolean isInputStream = true, isOutputStream = true;
    try {
      long startTime = System.currentTimeMillis();
      if (input instanceof File) {
        inputFile = (File) input;
        isInputStream = false;
      } else if (input instanceof InputStream) {
        String filename = inputFormat == null ? "" : "." + inputFormat.getExtension();
        inputFile = File.createTempFile("document", filename);
        FileUtils.copy((InputStream) input, inputFile);
      }
      if (output instanceof File) {
        isOutputStream = false;
        outputFile = (File) output;
      } else if (output instanceof OutputStream) {
        String filename = outputFormat == null ? "pdf" : outputFormat.getExtension();
        outputFile = File.createTempFile("document", "." + filename);
      }
      if (inputFormat == null && outputFormat != null) {
        documentConverter.convert(inputFile, outputFile, outputFormat);
      } else {
        documentConverter.convert(inputFile, outputFile);
      }
      if (isOutputStream) {
        FileUtils.copy(outputFile, (OutputStream) output);
      }
      long conversionTime = System.currentTimeMillis() - startTime;
      logger.info(String.format("successful conversion: %s [%db] in %dms", inputFile.getName(), inputFile.length(),
          conversionTime));
      return true;
    } catch (Exception e) {
      logger.error(e.getMessage());
      return false;
    } finally {
      if (isInputStream && inputFile != null) {
        inputFile.delete();
      }
      if (isOutputStream && outputFile != null) {
        outputFile.delete();
      }
    }
  }

  /**
   * 启动OpenOffice服务
   * 
   * @return
   * @throws IOException
   * @throws OfficeException
   */
  public static void initOpenOffice() throws IOException, OfficeException {
    logger.info(String.format("open offcie start: %s", DateUtils.format("yyyy-MM-dd HH:mm:ss")));
    if (SystemUtils.IS_OS_MAC) {
      try {
        // 如果是macos 那么启动的时候，不能获得manager实例，但是是可以启动的，然后第二次的时候就能获取实例了。
        // 如果是windows 那么会自动寻找安装路径，进行启动，默认端口号2002
        ExternalOfficeManagerBuilder externalProcessOfficeManager = new ExternalOfficeManagerBuilder();
        externalProcessOfficeManager.setConnectOnStart(true);
        externalProcessOfficeManager.setPortNumber(2002);
        officeManager = externalProcessOfficeManager.build();
        officeManager.start();
        documentConverter = new OfficeDocumentConverter(officeManager);
        return;
      } catch (Exception ex) {
        ex.printStackTrace();
      }
    }

    String home = ProjectUtils.getInitParameter(PARAMETER_OFFICE_HOME);
    String port = ProjectUtils.getInitParameter(PARAMETER_OFFICE_PORT);
    String profile = ProjectUtils.getInitParameter(PARAMETER_OFFICE_PROFILE);
    if (!CommonUtils.isEmpty(home)) System.setProperty("office.home", home);
    DefaultOfficeManagerBuilder builder = new DefaultOfficeManagerBuilder();
    if (!CommonUtils.isEmpty(profile)) builder.setTemplateProfileDir(new File(profile));
    if (!CommonUtils.isEmpty(port)) { // 启动多个服务，解决并发问题。
      String[] ports = port.trim().split(",");
      int[] portsInt = new int[ports.length];
      for (int i = 0; i < portsInt.length; i++) {
        portsInt[i] = Integer.valueOf(ports[i]);
      }
      builder.setPortNumbers(portsInt);
    }
    officeManager = builder.build();
    officeManager.start();
    documentConverter = new OfficeDocumentConverter(officeManager);
  }

  protected static void destroy() {
    if (officeManager != null) {
      try {
        officeManager.stop();
      } catch (OfficeException e) {}
    }
  }

  public static OfficeManager getOfficeManager() {
    return officeManager;
  }

  public static OfficeDocumentConverter getDocumentConverter() {
    return documentConverter;
  }
}
