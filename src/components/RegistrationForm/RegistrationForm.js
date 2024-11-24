import React, { useState } from 'react';
import styles from './registrationStyles.css';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const navigate = useNavigate();

  // Объединяем все состояния в один объект
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    emailError: false,
    passwordError: false,
    confirmPasswordError: false,
    token: null,
  });

  // Универсальный обработчик изменений
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
      [`${name}Error`]: false, // Сбрасываем ошибку для изменяемого поля
    }));
  };

  const SignUpButton = async (event) => {
    event.preventDefault();

    const { email, password, confirmPassword } = formState;

    // Проверяем поля
    const emailError = !email;
    const passwordError = !password;
    const confirmPasswordError = password !== confirmPassword;

    if (emailError || passwordError || confirmPasswordError) {
      setFormState((prevState) => ({
        ...prevState,
        emailError,
        passwordError,
        confirmPasswordError,
      }));
      return;
    }

    const userObj = { email, password };

    try {
      const response = await fetch("http://localhost:8000/register", {
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
        navigate('/login');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function RedirectToLogin() {
    navigate("/login");
  }

  const { email, password, confirmPassword, emailError, passwordError, confirmPasswordError } = formState;

  return (
    <div className="registration">
      <div className="header">
        <div className="enter">Регистрация</div>
        <a href="#" className="password_reset">Забыли пароль?</a>
      </div>
      <form className="registration_form" onSubmit={SignUpButton}>
        <input
          type="text"
          name="email" // Привязка имени для универсального обработчика
          placeholder="Электронная почта или username"
          value={email}
          onChange={handleChange}
          className={emailError ? 'error' : ''}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={password}
          onChange={handleChange}
          className={passwordError ? 'error' : ''}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={handleChange}
          className={confirmPasswordError ? 'error' : ''}
        />
        {confirmPasswordError && <div className="error-text">Пароли не совпадают</div>}
        <button type="submit" id="submit">Зарегистрироваться</button>
      </form>
      <div
        className="registration_form"
        onClick={RedirectToLogin}
        style={{ cursor: 'pointer' }}
      >
        Вход
      </div>
      <div className="agreement">
        Продолжая, я соглашаюсь с <a href="#">Политикой конфиденциальности</a> и соглашаюсь получать информацию о предложениях
      </div>
    </div>
  );
};

export default RegistrationForm;
