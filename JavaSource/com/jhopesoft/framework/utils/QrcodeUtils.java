package com.jhopesoft.framework.utils;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.EnumMap;

import javax.imageio.ImageIO;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

public class QrcodeUtils {

  private static final int BLACK = 0xFF000000; // 二维码前景色
  private static final int WHITE = 0xFFFFFFFF; // 二维码背景色
  private static final EnumMap<EncodeHintType, Object> hints =
      new EnumMap<EncodeHintType, Object>(EncodeHintType.class);
  static {
    /*
     * 二维码的纠错级别(排错率),4个级别： L (7%)、 M (15%)、 Q (25%)、 H (30%)(最高H)
     * 纠错信息同样存储在二维码中，纠错级别越高，纠错信息占用的空间越多，那么能存储的有用讯息就越少；共有四级； 选择M，扫描速度快。
     */
    hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
    // 二维码边界空白大小 1,2,3,4 (4为默认,最大)
    hints.put(EncodeHintType.MARGIN, 1);
    hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
  }

  /**
   * 绘制二维码
   * 
   * @param contents 二维码字符串内容
   * @param size 二维码宽度和高度
   * @return image 二维码图片
   */
  public static BufferedImage encodeImg(String contents, int size) {
    BufferedImage image = null;
    try {
      BitMatrix matrix = new MultiFormatWriter().encode(contents, BarcodeFormat.QR_CODE, size, size, hints);
      image = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
      int width = matrix.getWidth();
      int height = matrix.getHeight();
      for (int x = 0; x < width; x++) {
        for (int y = 0; y < height; y++) {
          image.setRGB(x, y, matrix.get(x, y) ? BLACK : WHITE);
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return image;
  }

  /**
   * 生成二维码输出到流
   * 
   * @param contents 二维码内容
   * @param format 图片格式
   * @param stream 输出流
   */
  public static ByteArrayOutputStream writeToStream(String contents, String format, int size) {
    BufferedImage image = encodeImg(contents, size);
    ByteArrayOutputStream stream = new ByteArrayOutputStream();
    try {
      ImageIO.write(image, format, stream);
    } catch (IOException e) {
      e.printStackTrace();
    }
    return stream;
  }


  /**
   * 二维码绘制logo
   * 
   * @param source 二维码原图片输入流
   * @param logoImg logo图片输入流
   */
  public static ByteArrayOutputStream encodeImgLogo(InputStream source, InputStream logoImg) {
    ByteArrayOutputStream result = new ByteArrayOutputStream();
    BufferedImage target = null;
    try {
      // 读取二维码图片
      target = ImageIO.read(source);
      // 获取画笔
      Graphics2D g = target.createGraphics();
      // 读取logo图片
      BufferedImage logo = ImageIO.read(logoImg);
      // 设置二维码大小，太大，会覆盖二维码，此处20%
      int logoWidth =
          logo.getWidth(null) > target.getWidth() * 2 / 10 ? (target.getWidth() * 2 / 10) : logo.getWidth(null);
      int logoHeight =
          logo.getHeight(null) > target.getHeight() * 2 / 10 ? (target.getHeight() * 2 / 10) : logo.getHeight(null);
      // 设置logo图片放置位置
      // 中心
      int x = (target.getWidth() - logoWidth) / 2;
      int y = (target.getHeight() - logoHeight) / 2;
      // 右下角，15为调整值
      // int x = twodimensioncode.getWidth() - logoWidth-15;
      // int y = twodimensioncode.getHeight() - logoHeight-15;
      // 开始合并绘制图片
      g.drawImage(logo, x, y, logoWidth, logoHeight, null);
      g.drawRoundRect(x, y, logoWidth, logoHeight, 15, 15);
      // logo边框大小
      g.setStroke(new BasicStroke(2));
      // logo边框颜色
      g.setColor(Color.WHITE);
      g.drawRect(x, y, logoWidth, logoHeight);
      g.dispose();
      logo.flush();
      target.flush();
    } catch (Exception e) {
      e.printStackTrace();
    }
    try {
      ImageIO.write(target, "jpg", result);
    } catch (IOException e) {
      e.printStackTrace();
    }
    return result;
  }

  /**
   * 生成一个带log 的二维码
   * 
   * @param contents 二维码文字说明
   * @param size 二维码宽或高
   * @param logstream 一个logo原始图片的输入流
   * @return
   */
  public static ByteArrayOutputStream createQrCode(String contents, int size, InputStream logstream) {
    ByteArrayOutputStream source = writeToStream(contents, "jpg", size);
    if (logstream != null) {
      return encodeImgLogo(new ByteArrayInputStream(source.toByteArray()), logstream);
    } else
      return source;
  }


}
