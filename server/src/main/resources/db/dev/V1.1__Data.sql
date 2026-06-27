-- =============================================================
-- V1.1__Data.sql - Dados iniciais do projeto pw45s
-- =============================================================

-- Authorities
INSERT INTO tb_authority (authority) VALUES ('ROLE_ADMIN');     -- ID 1
INSERT INTO tb_authority (authority) VALUES ('ROLE_OPERATOR');  -- ID 2
INSERT INTO tb_authority (authority) VALUES ('ROLE_CLIENTE');   -- ID 3

-- =============================================================
-- USUÁRIOS
-- =============================================================

-- ID 1 - Admin
INSERT INTO tb_user (username, display_name, password, active, email)
VALUES ('admin', 'Super Admin', '$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem', true, 'admin@email.com');
INSERT INTO tb_user_authorities (user_id, authority_id) VALUES (1, 1);
INSERT INTO tb_address (street, number, city, state, zip_code, country, user_id)
VALUES ('Rua das Flores', '123', 'Curitiba', 'PR', '80000-000', 'Brasil', 1);

-- ID 2 - Operador
INSERT INTO tb_user (username, display_name, password, active, email)
VALUES ('operador', 'Operador', '$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem', true, 'richardsonromig201101@gmail.com');
INSERT INTO tb_user_authorities (user_id, authority_id) VALUES (2, 2);
INSERT INTO tb_address (street, number, city, state, zip_code, country, user_id)
VALUES ('Rua das Margaridas', '789', 'Pato Branco', 'PR', '85501-000', 'Brasil', 2);

-- ID 3 - Cliente Ana
INSERT INTO tb_user (username, display_name, password, active, email)
VALUES ('ana.silva', 'Ana Silva', '$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem', true, 'ana.silva@email.com');
INSERT INTO tb_user_authorities (user_id, authority_id) VALUES (3, 3);
INSERT INTO tb_address (street, number, city, state, zip_code, country, user_id)
VALUES ('Avenida Brasil', '456', 'São Paulo', 'SP', '01000-000', 'Brasil', 3);

-- ID 4 - Cliente Carlos
INSERT INTO tb_user (username, display_name, password, active, email)
VALUES ('carlos.souza', 'Carlos Souza', '$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem', true, 'carlos.souza@email.com');
INSERT INTO tb_user_authorities (user_id, authority_id) VALUES (4, 3);
INSERT INTO tb_address (street, number, city, state, zip_code, country, user_id)
VALUES ('Rua 7 de Setembro', '200', 'Florianópolis', 'SC', '88000-000', 'Brasil', 4);

-- ID 5 - Cliente Beatriz
INSERT INTO tb_user (username, display_name, password, active, email)
VALUES ('beatriz.lima', 'Beatriz Lima', '$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem', true, 'beatriz.lima@email.com');
INSERT INTO tb_user_authorities (user_id, authority_id) VALUES (5, 3);
INSERT INTO tb_address (street, number, city, state, zip_code, country, user_id)
VALUES ('Rua das Acácias', '88', 'Porto Alegre', 'RS', '90000-000', 'Brasil', 5);

-- ID 6 - Cliente Diego
INSERT INTO tb_user (username, display_name, password, active, email)
VALUES ('diego.costa', 'Diego Costa', '$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem', true, 'diego.costa@email.com');
INSERT INTO tb_user_authorities (user_id, authority_id) VALUES (6, 3);
INSERT INTO tb_address (street, number, city, state, zip_code, country, user_id)
VALUES ('Alameda Santos', '310', 'Belo Horizonte', 'MG', '30000-000', 'Brasil', 6);

-- ID 7 - Cliente Fernanda
INSERT INTO tb_user (username, display_name, password, active, email)
VALUES ('fernanda.rocha', 'Fernanda Rocha', '$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem', true, 'fernanda.rocha@email.com');
INSERT INTO tb_user_authorities (user_id, authority_id) VALUES (7, 3);
INSERT INTO tb_address (street, number, city, state, zip_code, country, user_id)
VALUES ('Rua XV de Novembro', '55', 'Curitiba', 'PR', '80020-000', 'Brasil', 7);

-- =============================================================
-- CATEGORIAS
-- =============================================================
INSERT INTO tb_category (name) VALUES ('Processadores');   -- ID 1
INSERT INTO tb_category (name) VALUES ('Placas de Vídeo'); -- ID 2
INSERT INTO tb_category (name) VALUES ('Placas Mãe');      -- ID 3
INSERT INTO tb_category (name) VALUES ('Memória RAM');     -- ID 4
INSERT INTO tb_category (name) VALUES ('Armazenamento');   -- ID 5
INSERT INTO tb_category (name) VALUES ('Monitores');       -- ID 6
INSERT INTO tb_category (name) VALUES ('Mouses');          -- ID 7
INSERT INTO tb_category (name) VALUES ('Teclados');        -- ID 8
INSERT INTO tb_category (name) VALUES ('Headsets');        -- ID 9
INSERT INTO tb_category (name) VALUES ('Consoles');        -- ID 10

-- =============================================================
-- PRODUTOS
-- =============================================================

-- Processadores (category_id = 1)
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Processador Ryzen 5 5600', 'AMD Ryzen 5 5600, 3.5GHz (4.4GHz Turbo), 6-Cores, AM4', 849.00, 'https://images.kabum.com.br/produtos/fotos/320798/processador-amd-ryzen-5-5600-cache-35mb-3-7ghz-4-4ghz-max-turbo-am4-100-100000927box_1647636743_gg.jpg', 1);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Processador Ryzen 7 5700X', 'AMD Ryzen 7 5700X, 3.4GHz (4.6GHz Turbo), 8-Cores, Sem Vídeo', 1199.90, 'https://images.kabum.com.br/produtos/fotos/320797/processador-amd-ryzen-7-5700x-cache-36mb-3-8ghz-4-6ghz-max-turbo-am4-100-100000926wof_1647636511_gg.jpg', 1);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Processador Intel Core i9-13900K', 'Intel Core i9-13900K, 13ª Geração, 3.0GHz (5.8GHz Turbo), LGA 1700', 3599.00, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/416602/xlarge/Processador-Intel-Core-I9-13900K-5-80GHz-Max-Turbo-Cache-36MB-Quad-Core-32-Threads-LGA-1700_1752001191.jpg', 1);

-- Placas de Vídeo (category_id = 2)
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Placa de Vídeo RTX 4060', 'MSI Ventus 2X Black GeForce RTX 4060 8GB', 1899.00, 'https://images1.kabum.com.br/produtos/fotos/522531/placa-de-video-rtx-4060-asus-dual-o8g-evo-nvidia-geforce-8gb-gddr6-g-sync-ray-tracing-90yv0jc7-m0na00_1711036187_gg.jpg', 2);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Placa de Vídeo RX 6600', 'PowerColor Fighter AMD Radeon RX 6600 8GB', 1399.00, 'https://images.kabum.com.br/produtos/fotos/235984/placa-de-video-asrock-amd-radeon-rx-6600-cld-8g-8gb-90-ga2rzz-00uanf_1634738812_gg.jpg', 2);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Placa de Vídeo RTX 4070 Ti', 'Gigabyte GeForce RTX 4070 Ti Eagle, 12GB GDDR6X, DLSS 3', 5499.00, 'https://images.kabum.com.br/produtos/fotos/402564/placa-de-video-rtx-4070-ti-gigabyte-nvidia-geforce-12-gb-gddr6x-dlss-3-ray-tracing-gv-n407teagle-oc-12gd_1672920613_gg.jpg', 2);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Placa de Vídeo RX 7800 XT', 'ASRock AMD Radeon RX 7800 XT Challenger, 16GB GDDR6', 3699.00, 'https://images4.kabum.com.br/produtos/fotos/495214/placa-de-video-rx-7800-xt-gaming-oc-gigabyte-amd-16gb-gddr6-rgb-256-bits-gv-r78xtgaming-oc-16gd_1701438225_gg.jpg', 2);

-- Placas Mãe (category_id = 3)
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Placa Mãe B550M', 'Asus TUF Gaming B550M-Plus, AMD AM4, DDR4', 980.00, 'https://images.kabum.com.br/produtos/fotos/114781/placa-mae-gigabyte-b550m-aorus-elite-amd-am4-micro-atx-ddr4_1594908595_gg.jpg', 3);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Placa Mãe H610M', 'Gigabyte H610M S2H, Intel LGA 1700, DDR4', 549.90, 'https://images.kabum.com.br/produtos/fotos/276263/placa-mae-asus-prime-h610m-a-d4-lga-1700-h610-matx-ddr4_1675105753_gg.jpg', 3);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Placa Mãe Z790 Aorus Elite', 'Gigabyte Z790 Aorus Elite AX, Intel LGA 1700, DDR5, Wi-Fi 6E', 2199.90, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/530954/xlarge/Placa-M-e-Gigabyte-Z790-Aorus-Elite-X-WIFI-7-ATX-LGA-1700-DDR5-HDMI-Dp-M-2-USB-3-2_1744237235.jpg', 3);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Placa Mãe X670E Steel Legend', 'ASRock X670E Steel Legend, AMD AM5, DDR5, PCIe 5.0', 2599.00, 'https://images.kabum.com.br/produtos/fotos/386040/placa-mae-asus-x670e-steel-legend-atx-amd-ryzen-ddr5-wifi-bluetooth-90-mxbj40-a0uayz_1664285405_gg.jpg', 3);

-- Memória RAM (category_id = 4)
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Memória Fury Beast 8GB', 'Kingston Fury Beast, 8GB, 3200MHz, DDR4, Preto', 149.90, 'https://images.kabum.com.br/produtos/fotos/172369/memoria-kingston-fury-beast-8gb-3600mhz-ddr4-cl17-preto-kf436c17bb-8_1626209738_gg.jpg', 4);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Memória Vengeance 16GB', 'Corsair Vengeance LPX, 16GB, 3200MHz, DDR4', 289.00, 'https://images.kabum.com.br/produtos/fotos/583182/memoria-ram-corsair-vengeance-lpx-16gb-1x16gb-3200mhz-ddr4-cl16-preto-cmk16gx4m1e3200c16_1722861854_gg.jpg', 4);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Memória Corsair Dominator 32GB', 'Kit 2x16GB Corsair Dominator Platinum RGB, 5600MHz DDR5', 1299.00, 'https://images.kabum.com.br/produtos/fotos/526381/memoria-corsair-dominator-platinum-rgb-32gb-2x16gb-7200mhz-ddr5-cl34-otimizado-intel-xmp-preto-cmt32gx5m2x7200c34_1712148873_gg.jpg', 4);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Memória XPG Spectrix D50 8GB', 'XPG Spectrix D50, 8GB, 3200MHz, DDR4, RGB Tungsten', 179.90, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/206110/xlarge/Mem-ria-XPG-Spectrix-D50-RGB-8GB-3200MHz-DDR4-Para-Desktop-AX4U32008G16A-SW50_1762966420.jpg', 4);

-- Armazenamento (category_id = 5)
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('SSD Kingston NV2 1TB', 'SSD M.2 NVMe 1TB, Leitura 3500MB/s', 399.99, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/400812/xlarge/SSD-1TB-Kingston-Nv2-M-2-2280-PCIe-NVMe-Leitura-3500MB-s-Grava-o-2100MB-s-Snv2s-1000g_1763138630.jpg', 5);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('SSD SATA 480GB', 'SSD Kingston A400, 480GB, SATA, Leitura 500MB/s', 229.00, 'https://images.kabum.com.br/produtos/fotos/338408/ssd-wd-green-480gb-sata-leitura-545mb-s-gravacao-430mb-s-wds480g3g0a_1652465601_gg.jpg', 5);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('SSD Samsung 980 Pro 1TB', 'SSD Samsung 980 Pro M.2 NVMe, 1TB, Leitura 7000MB/s, PCIe 4.0', 799.00, 'https://images.kabum.com.br/produtos/fotos/163616/ssd-1-tb-samsung-980-pro-series-nvme-m-2-2280-pcie-4-0x4-leitura-7000mb-s-e-5000mb-s-mz-v8p1t0b-am_1673449032_gg.jpg', 5);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('HD Seagate Barracuda 2TB', 'HD Interno Seagate Barracuda 2TB, SATA III, 7200RPM', 349.00, 'https://images.kabum.com.br/produtos/fotos/100916/hd-seagate-barracuda-2tb-3-5-sata-st2000dm008_hd-seagate-barracuda-2tb-3-5-sata-st2000dm008_1552932729_gg.jpg', 5);

-- Monitores (category_id = 6)
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Monitor LG Ultrawide 29"', 'Monitor IPS Full HD 29UM69G, 75Hz, 1ms', 1250.00, 'https://images.kabum.com.br/produtos/fotos/magalu/277219/xlarge/Monitor-Gamer-Ultrawide-75Hz-Full-HD-29-LG_1763579764.jpg', 6);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Monitor Gamer AOC Hero', 'Monitor 24" 144Hz IPS, 1ms, G-Sync Compatible', 999.00, 'https://images1.kabum.com.br/produtos/fotos/111161/monitor-gamer-aoc-hero-w-led-27-widescreen-fhd-ips-hdmi-displayport-g-sync-compatible-144hz-1ms-altura-ajustavel-27g2-bk_1584370236_gg.jpg', 6);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Monitor Alienware 25" 360Hz', 'Monitor Gamer Alienware AW2521H, 360Hz, 1ms, IPS, G-Sync', 3499.00, 'https://m.media-amazon.com/images/I/81gaBRlYVeL.jpg', 6);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Monitor Dell 27" 4K', 'Monitor Dell S2721QS, 27 Polegadas, 4K UHD, IPS, HDR', 2100.00, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/574173/Monitor-Dell-De-27-Fhd-Usb-c-Hub-P2725he_1713890974_gg.jpg', 6);

-- Mouses (category_id = 7)
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Mouse Logitech G502', 'Logitech G502 Hero, 25K DPI, RGB, Peso Ajustável', 299.90, 'https://images4.kabum.com.br/produtos/fotos/98244/mouse-gamer-logitech-g502-hero-com-rgb-lightsync-ajustes-de-peso-11-botoes-programaveis-sensor-hero-25k-910-005550_1630676376_gg.jpg', 7);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Mouse Razer DeathAdder', 'Razer DeathAdder Essential, 6400 DPI, 5 Botões', 180.00, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/154304/xlarge/Mouse-Gamer-Razer-Deathadder-Essential-Com-Fio-6400-DPI-5-Bot-es-Preto_1761768217.jpg', 7);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Mouse Logitech G Pro X Superlight', 'Mouse Sem Fio Logitech G Pro X Superlight, Sensor Hero 25K, 63g', 699.90, 'https://images9.kabum.com.br/produtos/fotos/399019/mouse-gamer-sem-fio-logitech-g-pro-x-superlight-25600-dpi-5-botoes-usb-vermelho-910-006783_1668626464_gg.jpg', 7);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Mouse Razer Viper Ultimate', 'Mouse Gamer Sem Fio Razer Viper Ultimate, Dock de Carregamento', 599.00, 'https://images.kabum.com.br/produtos/fotos/110163/mouse-sem-fio-gamer-razer-viper-ultimate-chroma-8-botoes-20-000dpi-rz01-03050100-r3u1_1583261073_gg.jpg', 7);

-- Teclados (category_id = 8)
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Teclado Redragon Kumara', 'Teclado Mecânico Gamer Redragon Kumara, Switch Blue', 229.90, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/154145/xlarge/Teclado-Mec-nico-Gamer-Redragon-Kumara-K552-2-Vermelho-Switch-Brown-ABNT2_1764268428.jpg', 8);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Teclado HyperX Alloy', 'HyperX Alloy Core RGB, Membrana, Resistente a Líquidos', 299.00, 'https://images6.kabum.com.br/produtos/fotos/371586/teclado-mecanico-gamer-hyperx-alloy-mkw100-rgb-switch-red-full-size-us-preto-4p5e1aa-aba_1722882381_gg.jpg', 8);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Teclado Logitech G915 TKL', 'Teclado Mecânico Sem Fio Logitech G915 TKL, RGB Lightspeed, Low Profile', 1199.00, 'https://images1.kabum.com.br/produtos/fotos/652581/teclado-mecanico-gamer-sem-fio-logitech-g915-x-lightspeed-design-tkl-rgb-lightsync-usb-ou-bluetooth-e-switch-gl-tactile-preto-920-012715_1731263951_gg.jpg', 8);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Teclado Keychron K2', 'Teclado Mecânico Keychron K2 Wireless, RGB, Gateron Brown', 650.00, 'https://cf.shopee.com.br/file/f14f5ef288c1f67052574a6067008e2c', 8);

-- Headsets (category_id = 9)
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Headset Havit H2002D', 'Headset Gamer Havit, Drivers 53mm, Microfone Plugável', 199.00, 'https://images.kabum.com.br/produtos/fotos/102770/headset-gamer-havit-drivers-53mm-hv-h2002d_headset-gamer-havit-drivers-53mm-hv-h2002d_1564056874_g.jpg', 9);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Headset Logitech G733', 'Headset Sem Fio Logitech G733, RGB Lightsync, Lilás', 899.00, 'https://images1.kabum.com.br/produtos/fotos/120491/headset-gamer-sem-fio-logitech-g733-rgb-lightsync-7-1-dolby-surround-com-blue-voice-azul-981-000942_1612876505_gg.jpg', 9);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Headset Astro A50', 'Headset Sem Fio Astro A50 + Base Station Gen 4, PS5/PC', 1999.00, 'https://images4.kabum.com.br/produtos/fotos/102654/headset-sem-fio-astro-gaming-a50-base-station-gen-4-com-audio-dolby-para-ps4-pc-mac-preto-prata-939-001674_1614001918_gg.jpg', 9);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Headset SteelSeries Arctis Nova', 'SteelSeries Arctis Nova Pro Wireless, Cancelamento de Ruído Ativo', 2499.00, 'https://images.kabum.com.br/produtos/fotos/358125/headset-steelseries-arctis-nova-pro-drivers-40mm-hi-res-audio-preto-61527_1670246448_gg.jpg', 9);

-- Consoles (category_id = 10)
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('PlayStation 5', 'Console Sony PlayStation 5 Slim, SSD 1TB, Edição Digital', 3500.00, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/939944/xlarge/Console-Playstation-5-Slim-Digital-Edition-825GB-USB-HDMI-Branco_1762471114.png', 10);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Xbox Series S', 'Console Xbox Series S, SSD 512GB, Digital', 2300.00, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/200089/xlarge/Console-Microsoft-Xbox-Series-S-512GB-Branco-RRS-00006_1762794840.jpg', 10);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Nintendo Switch OLED', 'Console Nintendo Switch OLED Model, Branco, 64GB', 2199.00, 'https://images9.kabum.com.br/produtos/fotos/651149/console-nintendo-switch-modelo-oled-super-mario-kart-8-3-meses-do-nintendo-switch-online_1733945454_gg.jpg', 10);
INSERT INTO tb_product (name, description, price, url_imagem, category_id) VALUES ('Xbox Series X', 'Console Xbox Series X, SSD 1TB, 4K 120FPS', 4200.00, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/209239/xlarge/Console-Xbox-Series-X-Microsoft-1Tb-Controle-Sem-Fio-Preto_1761156212.jpg', 10);

-- =============================================================
-- PEDIDOS
-- =============================================================

-- Pedido 1 | Ana | AGUARDANDO_PAGAMENTO
INSERT INTO tb_order (order_date, status, user_id, address_id, total, payment_method, shipping_cost, shipping_type)
VALUES ('2026-01-05T09:15:00', 'AGUARDANDO_PAGAMENTO', 3, 3, 2748.90, 'CARTAO_CREDITO', 59.90, 'EXPRESSO');

-- Pedido 2 | Carlos | PAGO
INSERT INTO tb_order (order_date, status, user_id, address_id, total, payment_method, shipping_cost, shipping_type)
VALUES ('2026-01-10T14:00:00', 'PAGO', 4, 4, 1399.00, 'CARTAO_CREDITO', 0.00, 'NORMAL');

-- Pedido 3 | Beatriz | EM_PREPARACAO
INSERT INTO tb_order (order_date, status, user_id, address_id, total, payment_method, shipping_cost, shipping_type)
VALUES ('2026-01-15T10:30:00', 'EM_PREPARACAO', 5, 5, 6198.00, 'PIX', 0.00, 'NORMAL');

-- Pedido 4 | Diego | EM_TRANSPORTE
INSERT INTO tb_order (order_date, status, user_id, address_id, total, payment_method, shipping_cost, shipping_type)
VALUES ('2026-01-20T08:00:00', 'EM_TRANSPORTE', 6, 6, 849.00, 'BOLETO', 59.90, 'EXPRESSO');

-- Pedido 5 | Fernanda | CONCLUIDO
INSERT INTO tb_order (order_date, status, user_id, address_id, total, payment_method, shipping_cost, shipping_type)
VALUES ('2026-01-22T16:45:00', 'CONCLUIDO', 7, 7, 3499.00, 'CARTAO_CREDITO', 59.90, 'EXPRESSO');

-- Pedido 6 | Ana | CANCELADO
INSERT INTO tb_order (order_date, status, user_id, address_id, total, payment_method, shipping_cost, shipping_type)
VALUES ('2026-01-25T11:00:00', 'CANCELADO', 3, 3, 5499.00, 'PIX', 0.00, 'NORMAL');

-- Pedido 7 | Carlos | CONCLUIDO (pedido mais antigo)
INSERT INTO tb_order (order_date, status, user_id, address_id, total, payment_method, shipping_cost, shipping_type)
VALUES ('2025-12-01T09:00:00', 'CONCLUIDO', 4, 4, 1129.99, 'CARTAO_CREDITO', 0.00, 'NORMAL');

-- Pedido 8 | Beatriz | AGUARDANDO_PAGAMENTO
INSERT INTO tb_order (order_date, status, user_id, address_id, total, payment_method, shipping_cost, shipping_type)
VALUES ('2026-02-01T13:20:00', 'AGUARDANDO_PAGAMENTO', 5, 5, 299.90, 'BOLETO', 29.90, 'NORMAL');

-- Pedido 9 | Diego | EM_PREPARACAO
INSERT INTO tb_order (order_date, status, user_id, address_id, total, payment_method, shipping_cost, shipping_type)
VALUES ('2026-02-05T10:10:00', 'EM_PREPARACAO', 6, 6, 4698.00, 'PIX', 59.90, 'EXPRESSO');

-- Pedido 10 | Fernanda | PAGO
INSERT INTO tb_order (order_date, status, user_id, address_id, total, payment_method, shipping_cost, shipping_type)
VALUES ('2026-02-10T15:30:00', 'PAGO', 7, 7, 2199.00, 'CARTAO_CREDITO', 59.90, 'EXPRESSO');

-- =============================================================
-- ITENS DOS PEDIDOS
-- =============================================================

-- Pedido 1: Ryzen 5 5600 + Memória Vengeance 16GB + SSD Kingston 1TB
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 849.00,  1, 1);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (2, 2, 289.00,  1, 12);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (3, 1, 1321.90, 1, 17);

-- Pedido 2: RX 6600
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 1399.00, 2, 5);

-- Pedido 3: RTX 4070 Ti + Placa Mãe Z790
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 5499.00, 3, 6);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (2, 1, 699.00,  3, 9);

-- Pedido 4: Ryzen 5 5600
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 849.00, 4, 1);

-- Pedido 5: Monitor Alienware 360Hz
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 3499.00, 5, 23);

-- Pedido 6: RTX 4070 Ti (cancelado)
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 5499.00, 6, 6);

-- Pedido 7: Monitor 27pol
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 1129.99, 7, 22);

-- Pedido 8: Mouse Logitech G502
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 299.90, 8, 27);

-- Pedido 9: RX 7800 XT + Placa Mãe X670E
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 3699.00, 9, 7);
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (2, 1, 2599.00, 9, 10);

-- Pedido 10: Nintendo Switch OLED
INSERT INTO tb_order_item (order_index, quantity, price, order_id, product_id) VALUES (1, 1, 2199.00, 10, 39);

-- =============================================================
-- HISTÓRICO DE STATUS
-- =============================================================

-- Pedido 2 | Carlos | AGUARDANDO_PAGAMENTO → PAGO
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (2, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-01-10T14:05:00', 2, 'Pagamento confirmado via PIX.');

-- Pedido 3 | Beatriz | AGUARDANDO_PAGAMENTO → PAGO → EM_PREPARACAO
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (3, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-01-15T11:00:00', 2, 'Pagamento confirmado via cartão.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (3, 'PAGO', 'EM_PREPARACAO', '2026-01-15T14:30:00', 2, 'Pedido em separação no estoque.');

-- Pedido 4 | Diego | AGUARDANDO_PAGAMENTO → PAGO → EM_PREPARACAO → EM_TRANSPORTE
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (4, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-01-20T08:30:00', 2, 'Pagamento confirmado via boleto.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (4, 'PAGO', 'EM_PREPARACAO', '2026-01-20T10:00:00', 2, 'Pedido em separação no estoque.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (4, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2026-01-21T09:00:00', 2, 'Pedido enviado via Correios. Rastreio: BR123456789.');

-- Pedido 5 | Fernanda | caminho completo até CONCLUIDO
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (5, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-01-22T17:00:00', 2, 'Pagamento confirmado via PIX.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (5, 'PAGO', 'EM_PREPARACAO', '2026-01-23T08:00:00', 2, 'Pedido em separação.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (5, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2026-01-24T09:30:00', 2, 'Enviado via transportadora.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (5, 'EM_TRANSPORTE', 'CONCLUIDO', '2026-01-28T14:00:00', 2, 'Entrega confirmada pelo cliente.');

-- Pedido 6 | Ana | AGUARDANDO_PAGAMENTO → CANCELADO
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (6, 'AGUARDANDO_PAGAMENTO', 'CANCELADO', '2026-01-26T09:00:00', 2, 'Cancelado a pedido do cliente por desistência.');

-- Pedido 7 | Carlos | caminho completo (pedido antigo)
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (7, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2025-12-01T10:00:00', 2, 'Pagamento confirmado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (7, 'PAGO', 'EM_PREPARACAO', '2025-12-01T13:00:00', 2, 'Separando produto.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (7, 'EM_PREPARACAO', 'EM_TRANSPORTE', '2025-12-02T08:00:00', 2, 'Enviado via Jadlog.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (7, 'EM_TRANSPORTE', 'CONCLUIDO', '2025-12-05T16:00:00', 2, 'Entrega realizada com sucesso.');

-- Pedido 9 | Diego | AGUARDANDO_PAGAMENTO → PAGO → EM_PREPARACAO
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (9, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-02-05T11:00:00', 2, 'Pagamento via cartão aprovado.');
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (9, 'PAGO', 'EM_PREPARACAO', '2026-02-06T09:00:00', 2, 'Iniciando separação dos itens.');

-- Pedido 10 | Fernanda | AGUARDANDO_PAGAMENTO → PAGO
INSERT INTO tb_order_status_history (order_id, previous_status, new_status, changed_at, changed_by, observation)
VALUES (10, 'AGUARDANDO_PAGAMENTO', 'PAGO', '2026-02-10T16:00:00', 2, 'Pagamento via PIX confirmado.');