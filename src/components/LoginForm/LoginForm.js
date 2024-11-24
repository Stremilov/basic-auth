import React, { useState } from 'react';
import styles from './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  // Объединяем состояния в один объект
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    emailError: false,
    passwordError: false,
    token: null,
  });

  // Универсальный обработчик изменений
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
      [`${name}Error`]: false, // Сбрасываем ошибку при изменении поля
    }));
  };

  const SignInButton = async (event) => {
    event.preventDefault();

    const { email, password } = formState;

    // Проверяем наличие данных
    const emailError = !email;
    const passwordError = !password;
    if (emailError || passwordError) {
      setFormState((prevState) => ({
        ...prevState,
        emailError,
        passwordError,
      }));
      return;
    }

    const userObj = { email, password };

    try {
      const response = await fetch("http://localhost:8000/token", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userObj),
      });

      const data = await response.json();
      if (response.ok && data.access_token) {
        // Сохраняем токен и перенаправляем пользователя
        setFormState((prevState) => ({
          ...prevState,
          token: data.access_token,
        }));
        localStorage.setItem('token', data.access_token);
        navigate('/user-info');
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function RedirectToRegistration() {
    navigate("/register");
  }

  const { email, password, emailError, passwordError } = formState;

  return (
    <div className="registration">
      <div className="header">
        <div className="enter">Вход</div>
        <a href="#" className="password_reset">Забыли пароль?</a>
      </div>
      <form className="registration_form" onSubmit={SignInButton}>
        <input
          type="text"
          name="email" // Привязка к имени поля в объекте состояния
          placeholder="Электронная почта или username"
          value={email}
          onChange={handleChange}
          className={emailError ? 'error' : ''}
        />
        <input
          type="password"
          name="password" // Привязка к имени поля в объекте состояния
          placeholder="Пароль"
          value={password}
          onChange={handleChange}
          className={passwordError ? 'error' : ''}
        />
        <button type="submit" id="submit">Войти</button>
      </form>
      <div
        className="registration_form"
        onClick={RedirectToRegistration}
        style={{ cursor: 'pointer' }}
      >
        Регистрация
      </div>
      <div className="agreement">
        Продолжая, я соглашаюсь с <a href="#">Политикой конфиденциальности</a> и соглашаюсь получать информацию о предложениях
      </div>
    </div>
  );
};

export default LoginForm;
