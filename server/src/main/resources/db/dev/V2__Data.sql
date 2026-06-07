-- =============================================================
-- V1.2__More_Orders.sql - Pedidos adicionais para o painel
-- IDs de usuário: 3=Ana, 4=Carlos, 5=Beatriz, 6=Diego, 7=Fernanda
-- IDs de endereço: 3=Ana, 4=Carlos, 5=Beatriz, 6=Diego, 7=Fernanda
-- Produtos (4 por categoria):
--   Processadores:  1,2,3,4   | Placas de Vídeo: 5,6,7,8
--   Placas Mãe:     9,10,11,12 | Memória RAM:    13,14,15,16
--   Armazenamento: 17,18,19,20 | Monitores:      21,22,23,24
--   Mouses:        25,26,27,28 | Teclados:       29,30,31,32
--   Headsets:      33,34,35,36 | Consoles:       37,38,39
-- =============================================================

-- =======================
-- AGUARDANDO_PAGAMENTO (4 pedidos)
-- =======================

-- Pedido 11 | Carlos | AGUARDANDO_PAGAMENTO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-01T10:00:00', 'AGUARDANDO_PAGAMENTO', 4, 4, 3599.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 3599.00, 11, 3);

-- Pedido 12 | Beatriz | AGUARDANDO_PAGAMENTO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-05T11:30:00', 'AGUARDANDO_PAGAMENTO', 5, 5, 478.90);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 179.90, 12, 16);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (2, 1, 299.00, 12, 30);

-- Pedido 13 | Diego | AGUARDANDO_PAGAMENTO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-10T09:00:00', 'AGUARDANDO_PAGAMENTO', 6, 6, 2100.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 2100.00, 13, 24);

-- Pedido 14 | Fernanda | AGUARDANDO_PAGAMENTO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-12T14:00:00', 'AGUARDANDO_PAGAMENTO', 7, 7, 1048.90);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 399.99, 14, 17);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (2, 1, 229.90, 14, 29);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (3, 1, 419.01, 14, 33);

-- =======================
-- PAGO (4 pedidos)
-- =======================

-- Pedido 15 | Ana | PAGO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-02T08:00:00', 'PAGO', 3, 3, 1199.90);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 1199.90, 15, 2);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (15, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-03-02T08:30:00', 2, 'Pagamento via PIX confirmado.');

-- Pedido 16 | Carlos | PAGO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-06T13:00:00', 'PAGO', 4, 4, 1898.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 2, 949.00, 16, 27);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (16, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-03-06T13:20:00', 2, 'Pagamento via cartão aprovado.');

-- Pedido 17 | Beatriz | PAGO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-08T10:00:00', 'PAGO', 5, 5, 2498.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 1299.00, 17, 15);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (2, 1, 1199.00, 17, 31);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (17, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-03-08T10:15:00', 2, 'Pagamento via boleto confirmado.');

-- Pedido 18 | Diego | PAGO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-11T15:00:00', 'PAGO', 6, 6, 899.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 899.00, 18, 34);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (18, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-03-11T15:30:00', 2, 'Pagamento via PIX confirmado.');

-- =======================
-- EM_PREPARACAO (4 pedidos)
-- =======================

-- Pedido 19 | Fernanda | EM_PREPARACAO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-03T09:00:00', 'EM_PREPARACAO', 7, 7, 980.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 980.00, 19, 9);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (19, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-03-03T09:30:00', 2, 'Pagamento confirmado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (19, 'PAGO', 'EM_PREPARACAO', '2026-03-03T11:00:00', 2, 'Separando item no estoque.');

-- Pedido 20 | Ana | EM_PREPARACAO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-07T10:00:00', 'EM_PREPARACAO', 3, 3, 3698.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 1899.00, 20, 4);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (2, 1, 1799.00, 20, 5);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (20, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-03-07T10:20:00', 2, 'Pagamento via cartão aprovado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (20, 'PAGO', 'EM_PREPARACAO', '2026-03-07T14:00:00', 2, 'Iniciando separação dos produtos.');

-- Pedido 21 | Carlos | EM_PREPARACAO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-09T08:30:00', 'EM_PREPARACAO', 4, 4, 650.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 650.00, 21, 32);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (21, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-03-09T09:00:00', 2, 'Pagamento via PIX confirmado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (21, 'PAGO', 'EM_PREPARACAO', '2026-03-09T11:30:00', 2, 'Produto reservado no estoque.');

-- Pedido 22 | Beatriz | EM_PREPARACAO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-03-13T16:00:00', 'EM_PREPARACAO', 5, 5, 4200.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 4200.00, 22, 39);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (22, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-03-13T16:30:00', 2, 'Pagamento confirmado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (22, 'PAGO', 'EM_PREPARACAO', '2026-03-14T08:00:00', 2, 'Embalando produto para envio.');

-- =======================
-- EM_TRANSPORTE (4 pedidos)
-- =======================

-- Pedido 23 | Diego | EM_TRANSPORTE
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-02-15T09:00:00', 'EM_TRANSPORTE', 6, 6, 149.90);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 149.90, 23, 13);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (23, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-02-15T09:20:00', 2, 'Pagamento via PIX.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (23, 'PAGO', 'EM_PREPARACAO', '2026-02-15T10:00:00', 2, 'Separando produto.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (23, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2026-02-16T08:00:00', 2, 'Enviado via Correios PAC. Rastreio: BR987654321.');

-- Pedido 24 | Fernanda | EM_TRANSPORTE
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-02-18T11:00:00', 'EM_TRANSPORTE', 7, 7, 2300.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 2300.00, 24, 38);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (24, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-02-18T11:30:00', 2, 'Pagamento via cartão.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (24, 'PAGO', 'EM_PREPARACAO', '2026-02-19T08:00:00', 2, 'Embalando console.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (24, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2026-02-20T09:00:00', 2, 'Enviado via Jadlog. Rastreio: JD112233445.');

-- Pedido 25 | Ana | EM_TRANSPORTE
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-02-20T14:00:00', 'EM_TRANSPORTE', 3, 3, 699.90);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 699.90, 25, 27);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (25, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-02-20T14:20:00', 2, 'Pagamento via PIX.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (25, 'PAGO', 'EM_PREPARACAO', '2026-02-21T09:00:00', 2, 'Separando produto.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (25, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2026-02-22T08:30:00', 2, 'Enviado via Total Express.');

-- Pedido 26 | Carlos | EM_TRANSPORTE
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-02-22T10:00:00', 'EM_TRANSPORTE', 4, 4, 1999.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 1999.00, 26, 35);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (26, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-02-22T10:30:00', 2, 'Pagamento via boleto.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (26, 'PAGO', 'EM_PREPARACAO', '2026-02-23T08:00:00', 2, 'Produto separado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (26, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2026-02-24T09:00:00', 2, 'Enviado via Correios SEDEX.');

-- =======================
-- CONCLUIDO (4 pedidos)
-- =======================

-- Pedido 27 | Beatriz | CONCLUIDO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-01-05T10:00:00', 'CONCLUIDO', 5, 5, 349.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 349.00, 27, 20);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (27, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-01-05T10:20:00', 2, 'Pagamento confirmado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (27, 'PAGO', 'EM_PREPARACAO', '2026-01-05T13:00:00', 2, 'Separando produto.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (27, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2026-01-06T09:00:00', 2, 'Enviado via Correios PAC.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (27, 'EM_TRANSPORTE', 'CONCLUIDO', '2026-01-10T15:00:00', 2, 'Entrega confirmada.');

-- Pedido 28 | Diego | CONCLUIDO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-01-08T09:00:00', 'CONCLUIDO', 6, 6, 3500.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 3500.00, 28, 37);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (28, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-01-08T09:30:00', 2, 'Pagamento via cartão.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (28, 'PAGO', 'EM_PREPARACAO', '2026-01-08T14:00:00', 2, 'Preparando console para envio.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (28, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2026-01-09T09:00:00', 2, 'Enviado via Jadlog.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (28, 'EM_TRANSPORTE', 'CONCLUIDO', '2026-01-13T11:00:00', 2, 'Entrega realizada com sucesso.');

-- Pedido 29 | Fernanda | CONCLUIDO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-01-12T10:00:00', 'CONCLUIDO', 7, 7, 799.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 799.00, 29, 19);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (29, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-01-12T10:30:00', 2, 'Pagamento via PIX.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (29, 'PAGO', 'EM_PREPARACAO', '2026-01-12T13:00:00', 2, 'Separando SSD.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (29, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2026-01-13T09:00:00', 2, 'Enviado via Correios SEDEX.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (29, 'EM_TRANSPORTE', 'CONCLUIDO', '2026-01-15T14:00:00', 2, 'Entregue ao destinatário.');

-- Pedido 30 | Ana | CONCLUIDO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-01-18T08:00:00', 'CONCLUIDO', 3, 3, 2499.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 2499.00, 30, 36);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (30, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-01-18T08:30:00', 2, 'Pagamento via cartão aprovado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (30, 'PAGO', 'EM_PREPARACAO', '2026-01-18T11:00:00', 2, 'Separando headset.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (30, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2026-01-19T09:00:00', 2, 'Enviado via Total Express.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (30, 'EM_TRANSPORTE', 'CONCLUIDO', '2026-01-23T16:00:00', 2, 'Entrega confirmada pelo cliente.');

-- =======================
-- CANCELADO (4 pedidos)
-- =======================

-- Pedido 31 | Carlos | CANCELADO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-02-03T10:00:00', 'CANCELADO', 4, 4, 5499.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 5499.00, 31, 6);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (31, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-02-03T10:20:00', 2, 'Pagamento via cartão aprovado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (31, 'PAGO', 'CANCELADO', '2026-02-03T14:00:00', 2, 'Cancelado pelo cliente. Estorno solicitado.');

-- Pedido 32 | Beatriz | CANCELADO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-02-07T09:00:00', 'CANCELADO', 5, 5, 1250.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 1250.00, 32, 21);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (32, 'AGUARDANDO_PAGAMENTO', 'CANCELADO', '2026-02-08T10:00:00', 2, 'Prazo de pagamento expirado.');

-- Pedido 33 | Diego | CANCELADO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-02-12T11:00:00', 'CANCELADO', 6, 6, 2599.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 2599.00, 33, 12);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (33, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-02-12T11:30:00', 2, 'Pagamento via PIX.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (33, 'PAGO', 'CANCELADO', '2026-02-13T09:00:00', 2, 'Produto sem estoque. Estorno realizado.');

-- Pedido 34 | Fernanda | CANCELADO
INSERT INTO tb_order (order_date, status, user_id, address_id, total)
VALUES ('2026-02-14T15:00:00', 'CANCELADO', 7, 7, 849.00);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 849.00, 34, 1);
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (34, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-02-14T15:20:00', 2, 'Pagamento confirmado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (34, 'PAGO', 'EM_PREPARACAO', '2026-02-14T16:00:00', 2, 'Iniciando separação.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (34, 'EM_PREPARACAO', 'CANCELADO', '2026-02-15T10:00:00', 2, 'Cancelado a pedido do cliente. Estorno em processamento.');