import React from 'react';

function Cart({ cart, checkoutOrder }) {
  return (
    <section style={{ border: '1px solid #28a745', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
      <h3>🛒 Текущая корзина</h3>
      {cart.length === 0 ? <p>Корзина пуста</p> : (
        <>
          <ul>
            {cart.map(i => (
              <li key={i.id} style={{ marginBottom: '5px' }}>{i.name} x {i.quantity} шт. ({i.price * i.quantity}$)</li>
            ))}
          </ul>
          <hr/>
          <p>Итого к оплате: <strong>{cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)}$</strong></p>
          <button onClick={checkoutOrder} style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
            💳 Оплатить заказ
          </button>
        </>
      )}
    </section>
  );
}

export default Cart;
