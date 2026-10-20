import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import AuthForm from './components/Auth/AuthForm';
import ProductCatalog from './components/Catalog/ProductCatalog';
import OrderHistory from './components/Orders/OrderHistory';
import Cart from './components/Cart/Cart';
import AdminPanel from './components/Profile/AdminPanel';

//const API_URL = 'http://localhost:3001';
const API_URL = 'https://anna-shop-api.onrender.com';


const getHeaders = (userId) => ({
  headers: { 'User-Id': userId, 'Content-Type': 'application/json' }
});

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', first_name: '', last_name: '', role: 'user' });

  // Новое состояние для переключения между главной страницей ("main") и админкой ("admin")
  const [view, setView] = useState('main'); 
  const [notification, setNotification] = useState({ text: '', type: 'success' });


  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState({});

  const [cart, setCart] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [newItemData, setNewItemData] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    axios.get(`${API_URL}/items?search=${searchQuery}`)
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, [searchQuery]);

  useEffect(() => {
    if (!user) return;
    
    axios.get(`${API_URL}/orders`, getHeaders(user.id))
      .then(res => setMyOrders(res.data))
      .catch(err => console.error(err));

    if (user.role === 'admin') {
      axios.get(`${API_URL}/users`, getHeaders(user.id))
        .then(res => setAllUsers(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const showToast = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification({ text: '', type: 'success' });
    }, 3000);
  };


  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const res = await axios.post(`${API_URL}/users`, { user: formData });
        alert(res.data.message);
        setIsRegistering(false);
      } else {
        const res = await axios.post(`${API_URL}/users/sign_in`, { user: { email: formData.email, password: formData.password } });
        setUser(res.data.user);
        setView('main'); // При логине всегда открываем главную
        //alert(`Добро пожаловать, ${res.data.user.first_name}!`);
      }
    } catch (err) {
      alert('Ошибка авторизации или заполнения полей');
    }
  };

  const addToCart = (item) => {
    const qty = parseInt(quantities[item.id]) || 1;
    if (qty <= 0) return showToast('Укажите корректное количество товара!', 'error');
    
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i));
    } else {
      setCart([...cart, { ...item, quantity: qty }]);
    }
    showToast(`Товар "${item.name}" добавлен в корзину: ${qty} шт.`, 'success');
  };


  const checkoutOrder = async () => {
    if (cart.length === 0) return alert('Корзина пуста!');
    try {
      const orderPayload = { items: cart.map(i => ({ id: i.id, quantity: i.quantity })) };
      const res = await axios.post(`${API_URL}/orders`, orderPayload, getHeaders(user.id));
      alert(`Заказ успешно оплачен! Сумма: ${res.data.amount}$`);
      setCart([]);
      
      const ordersRes = await axios.get(`${API_URL}/orders`, getHeaders(user.id));
      setMyOrders(ordersRes.data);
    } catch (err) {
      alert('Ошибка при оформлении заказа');
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/users/${user.id}`, { user: { first_name: user.first_name, last_name: user.last_name } }, getHeaders(user.id));
      alert(res.data.message);
      setUser(res.data.user);
    } catch (err) {
      alert('Ошибка обновления профиля');
    }
  };

  const createItemByAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/items`, { item: newItemData }, getHeaders(user.id));
      setItems([...items, res.data]);
      setNewItemData({ name: '', description: '', price: '' });
      showToast(`Товар "${res.data.name}" успешно добавлен в базу!`, 'success');
    } catch (err) {
      showToast('Ошибка добавления товара на бэкенде', 'error');
    }
  };

  const onEditItemSave = async (itemId, updatedData) => {
    try {
      await axios.put(`${API_URL}/items/${itemId}`, { 
        item: { 
          name: updatedData.name, 
          description: updatedData.description, 
          price: parseFloat(updatedData.price) 
        } 
      }, getHeaders(user.id));
      
      // Показываем наше красивое исчезающее сообщение
      showToast('Товар успешно обновлен в таблице Items!', 'success');
      
      // Сразу обновляем список товаров на экране без перезагрузки всей страницы
      const res = await axios.get(`${API_URL}/items?search=${searchQuery}`);
      setItems(res.data);
    } catch (err) { 
      showToast('Ошибка при сохранении изменений товара', 'error'); 
    }
  };

  const onEditUserSave = async (userId, updatedData) => {
    try {
      await axios.put(`${API_URL}/users/${userId}`, { 
        user: { 
          first_name: updatedData.first_name, 
          role: updatedData.role 
        } 
      }, getHeaders(user.id));
      
      // Показываем исчезающее сообщение для пользователя
      showToast('Пользователь и роль успешно изменены в базе данных!', 'success');
      
      // Обновляем список пользователей на экране без перезагрузки
      const res = await axios.get(`${API_URL}/users`, getHeaders(user.id));
      setAllUsers(res.data);
    } catch (err) { 
      showToast('Ошибка при изменении роли пользователя', 'error'); 
    }
  };


  if (!user) {
    return (
      <AuthForm 
        handleAuth={handleAuth} 
        isRegistering={isRegistering} 
        setIsRegistering={setIsRegistering} 
        formData={formData} 
        setFormData={setFormData} 
      />
    );
  }

  // ЕСЛИ ОТКРЫТА СТРАНИЦА АДМИНКИ
  if (view === 'admin' && user.role === 'admin') {
    return (
           <AdminPanel 
              items={items} 
              allUsers={allUsers} 
              newItemData={newItemData} 
              setNewItemData={setNewItemData} 
              createItemByAdmin={createItemByAdmin} 
              onEditItemSave={onEditItemSave} 
              onEditUserSave={onEditUserSave}
              onBack={() => setView('main')} 
            />
    );
  }

  // ЕСЛИ ОТКРЫТА ГЛАВНАЯ СТРАНИЦА МАГАЗИНА
  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '15px' }}>
        <div>
          <h1>Anna-Shop 📚</h1>
          <p style={{ margin: 0 }}>Вы вошли как: <strong>{user.first_name} {user.last_name}</strong> ({user.role.toUpperCase()})</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Пункт 5 ТЗ: Кнопка "Админка" видна ТОЛЬКО пользователям с ролью admin */}
          {user.role === 'admin' && (
            <button 
              onClick={() => setView('admin')} 
              style={{ height: '40px', background: '#dc3545', color: '#fff', border: 'none', padding: '0 15px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}
            >
              🛡️ Админка
            </button>
          )}
          <button onClick={() => setUser(null)} style={{ height: '40px', background: '#6c757d', color: '#fff', border: 'none', padding: '0 15px', cursor: 'pointer', borderRadius: '4px' }}>Выйти</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '20px' }}>
        {/* ЛЕВАЯ КОЛОНКА (Каталог и Заказы) */}
        <div>
          <ProductCatalog 
            items={items} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            quantities={quantities} 
            setQuantities={setQuantities} 
            addToCart={addToCart} 
          />
          <OrderHistory 
            myOrders={myOrders} 
            expandedOrder={expandedOrder} 
            setExpandedOrder={setExpandedOrder} 
          />
        </div>

        {/* ПРАВАЯ КОЛОНКА (Корзина, Личные данные) */}
        <div>
          <Cart cart={cart} checkoutOrder={checkoutOrder} />

          <section style={{ background: '#e9ecef', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
            <h3>👤 Личные данные</h3>
            <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="text" value={user.first_name} onChange={e => setUser({...user, first_name: e.target.value})} placeholder="Имя" required style={{ padding: '5px' }} />
              <input type="text" value={user.last_name} onChange={e => setUser({...user, last_name: e.target.value})} placeholder="Фамилия" required style={{ padding: '5px' }} />
              <button type="submit" style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '4px' }}>Сохранить изменения</button>
            </form>
          </section>
        </div>
      </div>
      {notification.text && (
        <div className={`toast-notification toast-${notification.type}`}>
          {notification.text}
        </div>
      )}
    </div>
  );
}

export default App;
