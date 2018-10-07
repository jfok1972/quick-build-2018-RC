package com.jhopesoft.framework.utils;


import java.security.SecureRandom;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.SecretKeyFactory;
import javax.crypto.SecretKey;
import javax.crypto.Cipher;

public class DES {

  /**
   * 加密
   * 
   * @param datasource
   * @param salt
   * @return
   */
  public static String encrypt(String datasource, String salt) {
    try {
      SecureRandom random = new SecureRandom();
      DESKeySpec desKey = new DESKeySpec(salt.getBytes());
      // 创建一个密匙工厂，然后用它把DESKeySpec转换成
      SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
      SecretKey securekey = keyFactory.generateSecret(desKey);
      // Cipher对象实际完成加密操作
      Cipher cipher = Cipher.getInstance("DES");
      // 用密匙初始化Cipher对象
      cipher.init(Cipher.ENCRYPT_MODE, securekey, random);
      // 现在，获取数据并加密
      // 正式执行加密操作
      return MD5.byteArrayToHexString(cipher.doFinal(datasource.getBytes()));
    } catch (Throwable e) {
      e.printStackTrace();
    }
    return null;
  }

  /**
   * 
   * @param src
   * @param salt
   * @return
   * @throws Exception
   */
  public static String decrypt(String src, String salt) throws Exception {
    // DES算法要求有一个可信任的随机数源
    SecureRandom random = new SecureRandom();
    // 创建一个DESKeySpec对象
    DESKeySpec desKey = new DESKeySpec(salt.getBytes());
    // 创建一个密匙工厂
    SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
    // 将DESKeySpec对象转换成SecretKey对象
    SecretKey securekey = keyFactory.generateSecret(desKey);
    // Cipher对象实际完成解密操作
    Cipher cipher = Cipher.getInstance("DES");
    // 用密匙初始化Cipher对象
    cipher.init(Cipher.DECRYPT_MODE, securekey, random);
    // 真正开始解密操作
    return new String(cipher.doFinal(hexStringToByteArr(src)));
  }

  /**
   * 字符串转换成字节数组
   * 
   * @param strIn
   * @return
   * @throws Exception
   */
  public static byte[] hexStringToByteArr(String strIn) throws Exception {
    byte[] arrB = strIn.getBytes();
    int iLen = arrB.length;
    // 两个字符表示一个字节，所以字节数组长度是字符串长度除以2
    byte[] arrOut = new byte[iLen / 2];
    for (int i = 0; i < iLen; i = i + 2) {
      String strTmp = new String(arrB, i, 2);
      arrOut[i / 2] = (byte) Integer.parseInt(strTmp, 16);
    }
    return arrOut;
  }
}
