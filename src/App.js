import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import UserInfo from './components/UserInfo/UserInfo';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';

const App = () => (
  <Router>
    <Routes>
      <Route path="/register" element={<RegistrationForm/>} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/user-info" element={<UserInfo />} />
    </Routes>
  </Router>
);

export default App;
