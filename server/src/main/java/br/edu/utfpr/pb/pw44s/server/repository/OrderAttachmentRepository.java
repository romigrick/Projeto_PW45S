package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.OrderAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderAttachmentRepository extends JpaRepository<OrderAttachment, Long> {
    List<OrderAttachment> findByOrderIdOrderByUploadedAtDesc(Long orderId);
}