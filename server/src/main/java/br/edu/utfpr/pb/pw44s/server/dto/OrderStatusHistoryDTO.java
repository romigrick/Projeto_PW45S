package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.OrderStatusHistory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusHistoryDTO {
    private Long id;
    private String previousStatus;
    private String newStatus;
    private String changedBy;
    private LocalDateTime changedAt;
    private String observation;

    public OrderStatusHistoryDTO(OrderStatusHistory h) {
        this.id = h.getId();
        this.previousStatus = h.getPreviousStatus() != null ? h.getPreviousStatus().name() : null;
        this.newStatus = h.getNewStatus().name();
        this.changedBy = h.getChangedBy() != null ? h.getChangedBy().getUsername() : "sistema";
        this.changedAt = h.getChangedAt();
        this.observation = h.getObservation();
    }
}