
import './styles.css';

const Newsletter = () => {
  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-text">
          <h3 className="newsletter-title">Katchau News</h3>
          <p className="newsletter-subtitle">Receba ofertas exclusivas no seu e-mail</p>
        </div>
        <form className="newsletter-form">
          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="newsletter-input"
          />
          <button
            type="submit"
            className="newsletter-button"
          >
            CADASTRAR
          </button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
