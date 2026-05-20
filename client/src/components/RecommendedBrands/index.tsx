

import './styles.css';
import { recommendedBrands } from '../../data/mockData';

const RecommendedBrands = () => {
  return (
    <section className="brands-section">
      <div className="brands-header">
        <div className="brands-title-container">
          <span className="brands-title-decorator"></span>
          <h2 className="brands-title">MARCAS RECOMENDADAS</h2>
        </div>
        <a href="#" className="brands-view-all">
          VER TODAS {'>'}
        </a>
      </div>
      <div className="brands-grid">
        {recommendedBrands.map(brand => (
          <div key={brand.id} className="brand-card">
            <img
              src={brand.imgSrc}
              alt={brand.name}
              className="brand-image"
            />
            <h3 className="brand-name">{brand.name}</h3>
            <a href="#" className="brand-link">
              VER PRODUTOS {'>'}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecommendedBrands;
