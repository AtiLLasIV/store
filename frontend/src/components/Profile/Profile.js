import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useProductActions } from '../Utils/Hooks';
import { apiService } from "../Utils/Api";

export function Profile({ isAuth, setIsAuth }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const accessToken = window.localStorage.getItem('ACCESS');
    const userLogin = window.localStorage.getItem('LOGIN')
    if (accessToken) {
      setIsAuth(accessToken);
    }
    if (userLogin) {
      setLogin(userLogin)
    }
  }, [setIsAuth]);

  const handleAuth = async () => {
    console.log("Auth: login: " + login + ", pass: " + password)
    try {
      const {access, refresh} = await apiService('token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: login, password})
      })
      if (!access) {
        throw new Error('Неверный логин или пароль');
      }
      window.localStorage.setItem("ACCESS", access)
      window.localStorage.setItem("REFRESH", refresh)
      window.localStorage.setItem("LOGIN", login)
      setIsAuth(true)
      console.log("\naccess: " + access + "\nrefresh: " + refresh)
      window.location.reload()
    } catch (e) {
      alert('Неверный логин или пароль')
    }
  }

  const handleRegister = async () => {
  console.log("Reg: login: " + login + ", pass: " + password);
  try {
    const response = await apiService('register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: login, password })
    });
    alert(response.message || 'Регистрация успешна. Теперь войдите в аккаунт.');
    window.location.reload()
  } catch (e) {
    alert(e.message);
  }
};


  const handleExit = () => {
    window.localStorage.removeItem('ACCESS');
    window.localStorage.removeItem('REFRESH');
    window.localStorage.removeItem('LOGIN');
    setIsAuth(0);
    setLogin('')
    window.location.reload()
  };


  const { addEmptyProductToDB } = useProductActions();
  console.log(addEmptyProductToDB);

  if (!isAuth) {
    return (
      <div className="profile">
        <h2>Вход в личный кабинет</h2>
        <input
          name="login"
          placeholder="Логин"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          className="profile-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="profile-input"
        />
        <div className="log-reg-buttons">
          <button className="login-button" onClick={handleAuth}>
            Войти
          </button>
          <button className="register-button" onClick={handleRegister}>
            Нет аккаунта?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <h2>Здравствуйте, {login}</h2>
      <div className="balance-card">
        <span>Баланс пользователя</span>
        <button className="balance-button">Пополнить баланс</button>
      </div>

      <button
        className="add-product-button"
        onClick={addEmptyProductToDB}>
        Добавить товар
      </button>
      <div className="logout">
        <button className="logout-button" onClick={handleExit}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
    );
}