
import React, { useState, useEffect } from 'react';
import 'primeicons/primeicons.css';
import './styles.css';
import logoImage from '@/assets/katchau_logo.png';

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="back-to-top"
          >
            <i className="pi pi-chevron-up back-to-top-icon"></i>
            VER MAIS
          </button>
        )}

        <div className="grid">
          {/* Atendimento */}
          <div className="column">
            <h4 className="title">Atendimento</h4>
            <ul className="list">
              <li>08:00 às 20:00 - Segunda a Sábado</li>
              <li>08:00 às 15:00 - Sábado, horário de Brasília (exceto Domingo e feriados).</li>
            </ul>
            <a
              href="#"
              className="button"
            >
              <i className="pi pi-comments"></i>
              FALE CONOSCO
            </a>
          </div>

          {/* Vendas Pessoa Jurídica */}
          <div className="column">
            <h4 className="title">Vendas Pessoa Jurídica</h4>
            <ul className="list">
              <li>08:00 às 20:00 - Segunda a Sexta</li>
              <li>08:00 às 15:00 - Sábado, horário de Brasília (exceto Domingo e feriados).</li>
              <li className="list-item-padding">
                Fale conosco via{' '}
                <a
                  href="#"
                  className="link-highlight"
                >
                  chat
                </a>{' '}
                ou pelo email:
              </li>
              <li>vendas@Katchau.com.br</li>
            </ul>
          </div>

          {/* Loja Física */}
          <div className="column">
            <h4 className="title">Loja Física</h4>
            <ul className="list">
              <li>08:00 às 20:00 - Segunda a Sábado, horário de Brasília (exceto Domingo e feriados).</li>
              <li className="list-item-padding">
                Loja Itajubá: Amazonas da Silva, 27 - Vila Guilherme - São Paulo/SP, 02067-000
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div className="column">
            <h4 className="title">Institucional</h4>
            <div className="institutional">
              <a
                href="#"
                className="link"
              >
                Sobre o Katchau!
              </a>
              <a
                href="#"
                className="link"
              >
                Políticas de Cookies
              </a>
            </div>
          </div>
        </div>

        <div className="social-apps">
          {/* Mídias Sociais */}
          <div className="social-media">
            <h4 className="title">Mídias sociais:</h4>
            <div className="icons">
              <a
                href="#"
                className="icon"
              >
                <i className="pi pi-facebook"></i>
              </a>
              <a
                href="#"
                className="icon"
              >
                <i className="pi pi-instagram"></i>
              </a>
              <a
                href="#"
                className="icon"
              >
                <i className="pi pi-twitter"></i>
              </a>
              <a
                href="#"
                className="icon"
              >
                <i className="pi pi-linkedin"></i>
              </a>
              <a
                href="#"
                className="icon"
              >
                <i className="pi pi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Apps */}
          <div className="app-downloads">
            <h4 className="title">Baixe os aplicativos:</h4>
            <div className="app-buttons">
              <a
                href="#"
                className="app-button"
              >
                <i className="pi pi-apple app-icon"></i>
                <div>
                  <span className="app-store-text-small">Baixar na</span>
                  <span className="app-store-text-large">App Store</span>
                </div>
              </a>
              <a
                href="#"
                className="app-button"
              >
                <i className="pi pi-google app-icon"></i>
                <div>
                  <span className="app-store-text-small">Disponível no</span>
                  <span className="app-store-text-large">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Faixa Inferior */}
      <div className="bottom-bar">
        <div className="bottom-content">
          <img src={logoImage} alt="Katchau Logo" className="logo" />
          <p>
            Uma empresa do grupo <span className="blue-text">Inside Studio</span>
          </p>
          <p>Rua Doutor Francisco Beltrão, 360 - AP 112 - Santa Terezinha, Pato Branco/PR - CEP 85501-190 | Inside Studio | Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
