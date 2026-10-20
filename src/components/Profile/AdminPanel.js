import React, { useState } from 'react';

function AdminPanel({ items, allUsers, newItemData, setNewItemData, createItemByAdmin, onEditItemSave, onEditUserSave, onBack }) {
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({ name: '', description: '', price: '' });

  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({ first_name: '', role: 'user' });

  const startEditItem = (item) => {
    setEditingItemId(item.id);
    setEditItemData({ name: item.name, description: item.description, price: item.price });
  };

  const startEditUser = (u) => {
    setEditingUserId(u.id);
    setEditUserData({ first_name: u.first_name, role: u.role || 'user' });
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1 className="admin-main-title">🛡️ Панель Администратора Anna-Shop</h1>
          <p className="admin-main-subtitle">Инлайн-управление таблицами Items и Users без всплывающих окон</p>
        </div>
        <button onClick={onBack} className="btn btn-secondary">← На главную</button>
      </header>

      <div className="grid-layout">
        
        {/* ЛЕВАЯ СТОРОНА: ТОВАРЫ */}
        <div>
          <section className="section-block admin-creation-section">
            <h4>➕ Добавить новый товар в Items:</h4>
            <form onSubmit={createItemByAdmin} className="vertical-form">
              <input type="text" placeholder="Название товара" value={newItemData.name} onChange={e => setNewItemData({...newItemData, name: e.target.value})} required className="input-field" />
              <input type="text" placeholder="Описание" value={newItemData.description} onChange={e => setNewItemData({...newItemData, description: e.target.value})} required className="input-field" />
              <input type="number" placeholder="Цена" value={newItemData.price} onChange={e => setNewItemData({...newItemData, price: e.target.value})} required className="input-field" />
              <button type="submit" className="btn btn-danger">Создать Item</button>
            </form>
          </section>

          <section className="section-block section-white">
            <h4>📦 Редактирование таблицы Items:</h4>
            <div className="scroll-box">
              {items.map(item => {
                const isEditing = editingItemId === item.id;
                return (
                  <div key={item.id} className="card-item">
                    {isEditing ? (
                      <div className="vertical-form">
                        <input type="text" value={editItemData.name} onChange={e => setEditItemData({...editItemData, name: e.target.value})} className="input-field" />
                        <input type="text" value={editItemData.description} onChange={e => setEditItemData({...editItemData, description: e.target.value})} className="input-field" />
                        <input type="number" value={editItemData.price} onChange={e => setEditItemData({...editItemData, price: e.target.value})} className="input-field input-short" />
                        <div className="admin-btn-group">
                          <button onClick={() => { onEditItemSave(item.id, editItemData); setEditingItemId(null); }} className="btn btn-primary">Сохранить</button>
                          <button onClick={() => setEditingItemId(null)} className="btn btn-secondary">Отмена</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-between">
                        <div>
                          <div className="admin-item-title">{item.name}</div>
                          <div className="admin-item-desc">{item.description}</div>
                          <div className="admin-item-price">{item.price}\$</div>
                        </div>
                        <button onClick={() => startEditItem(item)} className="btn btn-warning">Редактировать</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ПРАВАЯ СТОРОНА: ПОЛЬЗОВАТЕЛИ */}
        <div>
          <section className="section-block section-white">
            <h4>👥 Редактирование таблицы Users:</h4>
            <div className="scroll-box">
              {allUsers.map(u => {
                const isEditing = editingUserId === u.id;
                return (
                  <div key={u.id} className="admin-user-row">
                    {isEditing ? (
                      <div className="vertical-form admin-user-edit-block">
                        <input type="text" value={editUserData.first_name} onChange={e => setEditUserData({...editUserData, first_name: e.target.value})} className="input-field" />
                        <select value={editUserData.role} onChange={e => setEditUserData({...editUserData, role: e.target.value})} className="input-field">
                          <option value="user">USER</option>
                          <option value="admin">ADMIN</option>
                        </select>
                        <div className="admin-btn-group">
                          <button onClick={() => { onEditUserSave(u.id, editUserData); setEditingUserId(null); }} className="btn btn-info">Сохранить</button>
                          <button onClick={() => setEditingUserId(null)} className="btn btn-secondary">Отмена</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-between">
                        <div>
                          <div className="admin-user-title">{u.first_name} {u.last_name}</div>
                          <div className="admin-user-email">{u.email}</div>
                          <div className="admin-badge-group">
                            <span className="badge badge-id">id: {u.id}</span>
                            <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                              Роль: {(u.role ? u.role : 'user').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => startEditUser(u)} className="btn btn-info">Изменить</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

export default AdminPanel;
