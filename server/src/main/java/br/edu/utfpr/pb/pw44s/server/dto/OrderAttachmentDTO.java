package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.OrderAttachment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderAttachmentDTO {
    private Long id;
    private String originalFileName;
    private String contentType;
    private Long fileSize;
    private LocalDateTime uploadedAt;
    private String description;
    private String uploadedBy;

    public OrderAttachmentDTO(OrderAttachment a) {
        this.id = a.getId();
        this.originalFileName = a.getOriginalFileName();
        this.contentType = a.getContentType();
        this.fileSize = a.getFileSize();
        this.uploadedAt = a.getUploadedAt();
        this.description = a.getDescription();
        this.uploadedBy = a.getUploadedBy() != null ? a.getUploadedBy().getUsername() : null;
    }
}