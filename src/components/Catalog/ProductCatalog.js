import React from 'react';

function ProductCatalog({ items, searchQuery, setSearchQuery, quantities, setQuantities, addToCart }) {
  return (
    <section className="catalog-section">
      <h3>🔍 Поиск и подбор товаров</h3>
      <input 
        type="text" 
        placeholder="Введите название товара для поиска..." 
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="catalog-search-input input-field"
      />
      <div className="catalog-list">
        {items.map(item => (
          <div key={item.id} className="catalog-card">
            <div>
              <strong>{item.name}</strong> — {item.price}$
              <div className="catalog-item-desc">{item.description}</div>
            </div>
            <div className="catalog-action-block">
              <input 
                type="number" 
                min="1" 
                placeholder="1"
                value={quantities[item.id] || ''}
                onChange={e => setQuantities({ ...quantities, [item.id]: e.target.value })}
                className="catalog-qty-input input-field"
              />
              <button onClick={() => addToCart(item)} className="btn btn-add-to-cart">В корзину</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductCatalog;
