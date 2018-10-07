package com.jhopesoft.platform.service;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.net.ConnectException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.Deflater;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;
import com.jhopesoft.framework.bean.FileUploadBean;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.attachment.FAttachmentfiletype;
import com.jhopesoft.framework.dao.entity.attachment.FDataobjectattachment;
import com.jhopesoft.framework.dao.entity.attachment.FDataobjectattachmentfile;
import com.jhopesoft.framework.dao.entity.attachment.FDataobjectattachmentpdffile;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.dao.entity.system.FSysteminfo;
import com.jhopesoft.framework.utils.BeanUtils;
import com.jhopesoft.framework.utils.CommonFunction;
import com.jhopesoft.framework.utils.CommonUtils;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.FileUtils;
import com.jhopesoft.framework.utils.ObjectFunctionUtils;
import com.jhopesoft.framework.utils.PdfUtils;

import net.coobird.thumbnailator.Thumbnails;

/**
 * 
 * @author jiangfeng
 *
 */
@Service
public class AttachmentService {

	@Autowired
	private DaoImpl dao;

	@Autowired
	private DataObjectService dataObjectService;

	/**
	 * 根据objectid和id取得附件记录
	 * 
	 * @param objectid
	 * @param id
	 * @return
	 */
	public List<FDataobjectattachment> getAttachments(String objectid, String id) {
		List<FDataobjectattachment> attachments = dao.findByProperty(FDataobjectattachment.class, "objectid", objectid,
				"idvalue", id);
		return attachments;
	}

	public void upload(FileUploadBean uploaditem, BindingResult bindingResult)
			throws IllegalAccessException, InvocationTargetException, IOException {

		List<FDataobjectattachment> items = getAttachments(uploaditem.getObjectid(), uploaditem.getIdvalue());
		int recno = 0;
		for (FDataobjectattachment item : items) {
			if (((int) item.getOrderno()) > recno)
				recno = item.getOrderno();
		}
		MultipartFile file = uploaditem.getFile();
		FDataobjectattachment attachment = new FDataobjectattachment();
		BeanUtils.copyProperties(attachment, uploaditem);
		attachment.setOrderno(recno + 10);
		FDataobject dataobject = DataObjectUtils.getDataObject(uploaditem.getObjectid());
		attachment.setFDataobject(dataobject);

		if (!ObjectFunctionUtils.allowAddAttachment(attachment.getFDataobject())) {
			throw new RuntimeException("已无权进行附件上传操作");
		}

		if (attachment.getTitle() == null || attachment.getTitle().length() == 0) {
			attachment.setTitle(file.getOriginalFilename());
		}
		attachment.setCreater(Local.getUserid());
		attachment.setCreatedate(new Date());
		attachment.setUploaddate(new Date());

		attachment.setFilename(file.getOriginalFilename());
		attachment.setSuffixname(getFileSuffix(attachment.getFilename()));
		attachment.setFilesize(file.getSize());

		dao.save(attachment);

		FSysteminfo setting = getFSysteminfo();
		// 如果附件设置是保存在文件系统，并且当前模块不是系统模块，那么文件可以保存在文件系统。如果当前模块是系统文件则附件保存在数据库中
		boolean saveInFileSystem = setting.getSaveinfilesystem()
				&& (dataobject.getIssystem() == null || !dataobject.getIssystem());
		if (saveInFileSystem) {
			// 将保存文件的参数写好

			// 按照2017-12，这样的格式来生成目录存放文件。
			String yyyymm = new SimpleDateFormat("yyyy-MM").format(new Date());
			fileDirExists(setting.getRootpath() + File.separator + yyyymm);
			attachment.setLocalpathname(yyyymm);
			attachment.setLocalfilename(attachment.getAttachmentid());
		}

		String suffix = attachment.getSuffixname();
		// 根据后续名处理相应的pdf预览，或者缩略图
		if (suffix != null) {
			FAttachmentfiletype filetype = dao.findById(FAttachmentfiletype.class, suffix);
			if (filetype != null) {
				// 该文件可以直接在网页中预览，包括图片，pdf,mp3,mp4等
				if (filetype.getCanpreview()) {
					attachment.setOriginalpreviewmode("direct");
				}
				// 全局设置生成pdf文件 和 该后缀名可转换成pdf
				if (setting.getCreatepreviewpdf() && filetype.getCanpdfpreview()) {
					// pdf预览文件保存在文件系统中
					if (saveInFileSystem) {
						createPdfPreviewFile(attachment, file, setting);
					} else {
						// pdf预览文件保存在数据库中
						createPdfPreviewDb(attachment, file);
					}
				}
				// 全局设置生成图片预览文件 和 该后缀名可生成图片预览
				if (filetype.getIsimage()) {
					attachment.setOriginalpreviewmode("image");
					if (setting.getCreatepreviewimage()) {
						createImagePreview(attachment, file);
					}
				}
			}
		}

		// 如果保存pdf或缩略图没问题，那么再保存原件
		if (saveInFileSystem) {
			// 附件文件保存在文件系统中
			saveAttachmentToFileSystem(attachment, file, setting);
		} else {
			// 附件文件保存在数据库中
			FDataobjectattachmentfile attachmentfile = new FDataobjectattachmentfile(attachment);
			attachmentfile.setFiledata(file.getBytes());
			dao.save(attachmentfile);
		}
		dao.saveOrUpdate(attachment);
	}

	private void saveAttachmentToFileSystem(FDataobjectattachment attachment, MultipartFile file, FSysteminfo setting)
			throws IOException {

		String fullpath = setting.getRootpath() + attachment._getLocalFilename();
		FileOutputStream outputStream = new FileOutputStream(fullpath);
		FileUtils.copy(file.getInputStream(), outputStream);
	}

	private void fileDirExists(String dir) {
		File file = new File(dir);
		if (!file.exists()) {
			file.mkdir();
		}
	}

	private void createImagePreview(FDataobjectattachment attachment, MultipartFile file) {
		try {
			Image image = ImageIO.read(file.getInputStream());
			compressImage(attachment, image, file.getInputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 用openoffice 将可以转化成pdf的文件生成pdf的预览文件,保存在数据库中
	 * 
	 * @param attachment
	 * @param file
	 * @throws IOException
	 */
	private void createPdfPreviewDb(FDataobjectattachment attachment, MultipartFile file) throws IOException {
		ByteArrayOutputStream pdfos = createPdfPreviewStream(file, attachment.getSuffixname());
		FDataobjectattachmentpdffile pdffile = new FDataobjectattachmentpdffile(attachment);
		pdffile.setFilepdfdata(pdfos.toByteArray());
		dao.save(pdffile);
		attachment.setHaspdfpreviewviewdata(true);
		dao.saveOrUpdate(attachment);
	}

	/**
	 * 生成可以用pdf预览的文件的预览文件
	 * 
	 * @param attachment
	 * @param file
	 * @param setting
	 * @throws IOException
	 */
	private void createPdfPreviewFile(FDataobjectattachment attachment, MultipartFile file, FSysteminfo setting)
			throws IOException {
		ByteArrayOutputStream pdfos = createPdfPreviewStream(file, attachment.getSuffixname());
		String fullpath = setting.getRootpath() + File.separator + attachment._getLocalPDFFilename();
		File outputFile = new File(fullpath);
		FileUtils.copy(new ByteArrayInputStream(pdfos.toByteArray()), outputFile);
		attachment.setHaspdfpreviewviewdata(true);
		dao.saveOrUpdate(attachment);
	}

	/**
	 * 用openoffice 将可以转化成pdf的文件生成pdf的预览文件
	 * 
	 * @param file
	 * @throws ConnectException
	 * @throws IOException
	 */
	private ByteArrayOutputStream createPdfPreviewStream(MultipartFile file, String suffix) {
		ByteArrayOutputStream pdfos = new ByteArrayOutputStream();
		try {
			PdfUtils.convert(file.getInputStream(), pdfos, suffix, "pdf");
		} catch (IOException e) {
			e.printStackTrace();
		}
		return pdfos;
	}

	private static final int MAXXY = 128;

	/**
	 * 采用Thumbnails制作缩略图
	 * 
	 * @param attachment
	 * @param image
	 * @param is
	 * @return
	 */
	public boolean compressImage(FDataobjectattachment attachment, Image image, InputStream is) {
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		try {
			int width = image.getWidth(null);
			int height = image.getHeight(null);
			attachment.setPwidth(width);
			attachment.setPheight(height);
			attachment.setHasimagepreviewdata(true);
			ImageIO.write(Thumbnails.of(is).size(MAXXY, MAXXY).asBufferedImage(), "png", os);
			attachment.setPreviewdata(os.toByteArray());
		} catch (Exception e) {
			e.printStackTrace();
			attachment.setPwidth(0);
			attachment.setPheight(0);
			attachment.setHasimagepreviewdata(false);
			return false;
		}
		return true;
	}

	/**
	 * 原来的图像压缩，制作缩略图
	 * 
	 * @param attachment
	 * @param image
	 * @return
	 */
	public boolean compressImage(FDataobjectattachment attachment, Image image) {
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		try {
			int width = image.getWidth(null);
			int height = image.getHeight(null);
			attachment.setPwidth(width);
			attachment.setPheight(height);
			attachment.setHasimagepreviewdata(true);
			int cw = MAXXY;
			int ch = MAXXY * height / width;
			if (height > width) {
				ch = MAXXY;
				cw = MAXXY * width / height;
			}
			BufferedImage bufferedImage = new BufferedImage(cw, ch, BufferedImage.TYPE_INT_RGB);
			bufferedImage.getGraphics().drawImage(image.getScaledInstance(cw, ch, java.awt.Image.SCALE_SMOOTH), 0, 0, null);
			ImageIO.write(bufferedImage, "png", os);
			attachment.setPreviewdata(os.toByteArray());
		} catch (Exception e) {
			e.printStackTrace();
			attachment.setPwidth(0);
			attachment.setPheight(0);
			attachment.setHasimagepreviewdata(false);
			return false;
		}
		return true;
	}

	public String getFileSuffix(String filename) {
		int pos = filename.lastIndexOf('.');
		if (pos == -1) {
			return null;
		} else {
			return filename.substring(pos + 1);
		}
	}

	public void preview(String attachmentid) throws IOException {
		FDataobjectattachment attachment = dao.findById(FDataobjectattachment.class, attachmentid);

		if (!ObjectFunctionUtils.allowQueryAttachment(attachment.getFDataobject())) {
			throw new RuntimeException("已无权对附件进行查看");
		}

		HttpServletResponse response = Local.getResponse();
		response.setHeader("Cache-Control", "max-age=" + 600);
		response.addHeader("Content-Disposition", "inline");
		if (attachment.getHaspdfpreviewviewdata() != null && attachment.getHaspdfpreviewviewdata()) {
			downloadPdfPreviewData(attachment);
		} else {
			// 下载原件以供预览，可以是图片，声音，视频，或者pdf
			downloadOriginalToPreview(attachment);
		}

	}

	private void downloadOriginalToPreview(FDataobjectattachment attachment) throws IOException {
		InputStream pdfstream = getOriginalFileStream(attachment);
		HttpServletResponse response = Local.getResponse();
		response.addHeader("Content-Length", "" + pdfstream.available());
		String mimetype = getMimeType(attachment.getSuffixname());
		if (mimetype == null) {
			mimetype = "application/octet-stream";
		}
		response.setContentType(mimetype + ";charset=utf-8");
		CommonUtils.writeStreamToResponse(pdfstream, response);
	}

	private String getMimeType(String suffix) {
		if (suffix == null) {
			return null;
		}
		FAttachmentfiletype filetype = dao.findById(FAttachmentfiletype.class, suffix);
		if (filetype == null) {
			return null;
		} else {
			return filetype.getMimetype();
		}
	}

	/**
	 * 取得原始上传文件的inputstream
	 * 
	 * @param attachment
	 * @return
	 * @throws FileNotFoundException
	 */
	public InputStream getOriginalFileStream(FDataobjectattachment attachment) {
		FSysteminfo setting = getFSysteminfo();
		InputStream result;
		// 如果原来是存在文件系统中的,就去文件系统中找
		if (attachment.getLocalfilename() != null) {
			try {
				result = new FileInputStream(new File(setting.getRootpath() + File.separator + attachment._getLocalFilename()));
			} catch (FileNotFoundException e) {
				e.printStackTrace();
				return new ByteArrayInputStream(new byte[0]);
			}
		} else {
			FDataobjectattachmentfile ofile = attachment.getFDataobjectattachmentfile();
			if (ofile == null) {
				throw new RuntimeException("附件原始文件记录未找到！");
			}
			result = new ByteArrayInputStream(ofile.getFiledata());
		}
		return result;
	}

	/**
	 * 下载可预览的pdf文件,放在网页里预览
	 * 
	 * @param attachment
	 * @throws IOException
	 */
	private void downloadPdfPreviewData(FDataobjectattachment attachment) throws IOException {
		InputStream pdfstream = getPdfPreviewStream(attachment);
		HttpServletResponse response = Local.getResponse();
		response.addHeader("Content-Length", "" + pdfstream.available());
		response.setContentType("application/pdf;charset=gb2312");
		CommonUtils.writeStreamToResponse(pdfstream, response);
	}

	public InputStream getPdfPreviewStream(FDataobjectattachment attachment) throws FileNotFoundException {
		FSysteminfo setting = getFSysteminfo();
		InputStream result;
		if (attachment.getLocalfilename() != null) {
			result = new FileInputStream(
					new File(setting.getRootpath() + File.separator + attachment._getLocalPDFFilename()));
		} else {
			FDataobjectattachmentpdffile pdffile = attachment.getFDataobjectattachmentpdffile();
			if (pdffile == null) {
				throw new RuntimeException("转换后的pdf文件记录未找到！");
			}
			result = new ByteArrayInputStream(pdffile.getFilepdfdata());
		}
		return result;
	}

	public void download(String attachmentid) throws UnsupportedEncodingException, IOException {
		FDataobjectattachment attachment = dao.findById(FDataobjectattachment.class, attachmentid);

		if (!ObjectFunctionUtils.allowQueryAttachment(attachment.getFDataobject())) {
			throw new RuntimeException("已无权对附件进行下载");
		}

		HttpServletResponse response = Local.getResponse();
		response.addHeader("Content-Disposition",
				"attachment" + ";filename=" + CommonFunction.getDownLoadFileName(attachment.getFilename()));
		response.setContentType("application/octet-stream");
		InputStream pdfstream = getOriginalFileStream(attachment);
		response.addHeader("Content-Length", "" + pdfstream.available());
		CommonUtils.writeStreamToResponse(pdfstream, response);
	}

	public void downloadAll(String moduleName, String idkey) throws IOException {
		FDataobject dataobject = DataObjectUtils.getDataObject(moduleName);

		if (!ObjectFunctionUtils.allowQueryAttachment(dataobject)) {
			throw new RuntimeException("已无权对附件进行下载");
		}

		List<FDataobjectattachment> attachments = dao.findByProperty(FDataobjectattachment.class, "objectid",
				dataobject.getObjectid(), "idvalue", idkey);
		Map<String, Object> record = dataObjectService.getObjectRecordMap(moduleName, idkey);
		String recordtitle = record.get(dataobject.getNamefield()).toString();
		OutputStream os = new ByteArrayOutputStream();
		InputStream input = null;
		ZipOutputStream zipOut = new ZipOutputStream(os);
		zipOut.setLevel(Deflater.BEST_COMPRESSION);
		zipOut.setMethod(ZipOutputStream.DEFLATED);
		zipOut.setComment("这是" + dataobject.getTitle() + "\"" + recordtitle + "\"的所有附件的压缩文件");
		Map<String, Integer> filenames = new HashMap<String, Integer>(0);
		for (FDataobjectattachment attachment : attachments) {
			if (attachment.getFilename() != null) {
				String filename = attachment.getFilename();
				if (filenames.containsKey(filename)) {
					// 上传的文件名有重复的
					Integer c = filenames.get(filename) + 1;
					filenames.put(filename, c);
					filename = filename + "_" + c;
				} else {
					filenames.put(filename, 0);
				}

				input = getOriginalFileStream(attachment);
				if (input != null) {
					ZipEntry zipEntry = new ZipEntry(filename);
					zipEntry.setComment(attachment.getTitle());
					zipOut.putNextEntry(zipEntry);
					int readed = 0;
					byte[] cash = new byte[2048];
					while ((readed = input.read(cash)) > 0) {
						zipOut.write(cash, 0, readed);
					}
					input.close();
				}
			}
		}
		zipOut.close();
		HttpServletResponse response = Local.getResponse();
		String filename = dataobject.getTitle() + "--" + recordtitle + "的附件" + ".zip";
		InputStream br = new ByteArrayInputStream(((ByteArrayOutputStream) os).toByteArray());
		response.addHeader("Content-Disposition",
				"attachment" + ";filename=" + CommonFunction.getDownLoadFileName(filename));
		response.setContentType("application/octet-stream");
		response.addHeader("Content-Length", "" + br.available());
		CommonUtils.writeStreamToResponse(br, response);
	}

	/**
	 * 如果附件是保存在文件系统中，那么删除附件的时候要删除文件原件的预览文件
	 * 
	 * @param attachment
	 */
	public void deleteFile(FDataobjectattachment attachment) {
		FSysteminfo setting = getFSysteminfo();
		File file = new File(setting.getRootpath() + File.separator + attachment._getLocalFilename());
		if (file.exists()) {
			file.delete();
		}
		file = new File(setting.getRootpath() + File.separator + attachment._getLocalPDFFilename());
		if (file.exists()) {
			file.delete();
		}
	}

	public FSysteminfo getFSysteminfo() {
		FSysteminfo result = null;
		FCompany company = dao.findById(FCompany.class, Local.getCompanyid());

		if (company != null) {
			result = new ArrayList<FSysteminfo>(company.getFSysteminfos()).get(0);
		}

		if (result == null) {
			result = dao.findAll(FSysteminfo.class).get(0);
		}
		return result;
	}

}
