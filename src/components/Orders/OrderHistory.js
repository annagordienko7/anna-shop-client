import React from 'react';

function OrderHistory({ myOrders, expandedOrder, setExpandedOrder }) {
  return (
    <section style={{ background: '#f8f9fa', padding: '20px', borderRadius: '5px' }}>
      <h3>📦 История ваших заказов</h3>
      {myOrders.length === 0 ? <p>У вас пока нет заказов</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myOrders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ccc', padding: '15px', background: '#fff', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Заказ №{order.id} на сумму {order.amount}$</strong>
                <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                  {expandedOrder === order.id ? 'Свернуть' : 'Раскрыть подробнее'}
                </button>
              </div>
              {expandedOrder === order.id && (
                <div style={{ marginTop: '10px', borderTop: '1px dashed #ccc', paddingTop: '10px', background: '#fcfcfc', padding: '10px' }}>
                  <h5>Содержимое заказа (Таблица 4):</h5>
                  <ul>
                    {order.order_descriptions?.map(desc => (
                      <li key={desc.id} style={{ fontSize: '14px', marginBottom: '4px' }}>
                        Товар: <strong>{desc.item?.name}</strong> | Количество: {desc.quantity} шт.
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrderHistory;
