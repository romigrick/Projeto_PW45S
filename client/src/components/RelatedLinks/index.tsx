
import './styles.css';
import { Link } from 'react-router-dom';
import { relatedLinks } from '../../data/mockData';

const RelatedLinks = () => {
  return (
    <section className="related-links-section">
      <div className="related-links-container">
        <div className="related-links-header">
          <span className="related-links-decorator"></span>
          <h2 className="related-links-title">LINKS RELACIONADOS</h2>
        </div>
        <div className="links-wrapper">
          {relatedLinks.map(link => (
            <Link
              key={link}
              to={`/products?search=${encodeURIComponent(link)}`}
              className="link-tag"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedLinks;
