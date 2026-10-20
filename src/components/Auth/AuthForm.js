import React from 'react';

function AuthForm({ handleAuth, isRegistering, setIsRegistering, formData, setFormData }) {
  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>{isRegistering ? 'Регистрация на сайте' : 'Вход в интернет-магазин'}</h2>
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isRegistering && (
          <>
            <input type="text" placeholder="Имя" onChange={e => setFormData({...formData, first_name: e.target.value})} required />
            <input type="text" placeholder="Фамилия" onChange={e => setFormData({...formData, last_name: e.target.value})} required />
            <select onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="user">User (Покупатель)</option>
              <option value="admin">Admin (Администратор)</option>
            </select>
          </>
        )}
        <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Пароль" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {isRegistering ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
        {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
      </button>
    </div>
  );
}

export default AuthForm;
