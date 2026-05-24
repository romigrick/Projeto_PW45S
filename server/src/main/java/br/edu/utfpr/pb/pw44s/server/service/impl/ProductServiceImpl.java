package br.edu.utfpr.pb.pw44s.server.service.impl;
import br.edu.utfpr.pb.pw44s.server.minio.payload.FileResponse;
import br.edu.utfpr.pb.pw44s.server.minio.service.MinioService;
import br.edu.utfpr.pb.pw44s.server.minio.util.FileTypeUtils;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@Slf4j
public class ProductServiceImpl extends CrudServiceImpl<Product, Long> implements IProductService {

    private final ProductRepository productRepository;
    private final MinioService minioService;

    public ProductServiceImpl(ProductRepository productRepository,
                              MinioService minioService) {
        this.productRepository = productRepository;
        this.minioService = minioService;
    }

    @Override
    protected JpaRepository<Product, Long> getRepository() {
        return productRepository;
    }

    @Override
    public List<Product> findAllByCategoryId(Long categoryId) {
        return this.productRepository.findAllByCategoryId(categoryId);
    }

    @Override
    public List<Product> findAllByCategoryName(String categoryName) {
        return this.productRepository.findAllByCategoryName(categoryName);
    }

    @Override
    public Product save(Product entity, MultipartFile file) {
        String fileType = FileTypeUtils.getFileType(file);
        if (fileType != null) {
            FileResponse fileResponse = minioService.putObject(file, "commons", fileType);
            if (fileResponse != null) {
                entity.setImageName(fileResponse.getFilename());
                entity.setContentType(fileResponse.getContentType());
                entity.setUrlImagem("http://127.0.0.1:9000/commons/" + fileResponse.getFilename());
            } else {
                log.error("Falha ao fazer upload da imagem para o MinIO");
            }
        }
        return super.save(entity);
    }

    @Override
    public void downloadFile(Long id, HttpServletResponse response) {
        InputStream in = null;
        try {
            Product product = this.findById(id);
            in = minioService.downloadObject("commons", product.getImageName());
            response.setHeader("Content-Disposition", "attachment;filename="
                    + URLEncoder.encode(product.getImageName(), StandardCharsets.UTF_8));
            response.setCharacterEncoding("UTF-8");

            IOUtils.copy(in, response.getOutputStream());
        } catch (IOException e) {
            log.error(e.getMessage());
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    log.error(e.getMessage());
                }
            }
        }
    }
}