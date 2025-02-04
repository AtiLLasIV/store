import { useState, useEffect } from 'react';
import { Button } from '../Button/Button'

export function Header() {
  const [login, setLogin] = useState('');

  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    const savedLogin = window.localStorage.getItem('LOGIN');
    if (savedLogin) {
      setLogin(savedLogin);
    }
  }, []);

  const handleButtonClick = (id) => {
    setActiveButton(id);
  }

  return (
    <header className="header">
      <Button title="Главная" href="/main" isActive={activeButton === 'MainButton'}
        onClick={() => handleButtonClick('MainButton')}/>
      <Button title="Личный кабинет" href="/profile" isActive={activeButton === 'ProfileButton'}
        onClick={() => handleButtonClick('ProfileButton')}/>

      {login ? login : 'Гость'}


      <Button title="Корзина" href="/cart" isActive={activeButton === 'CartButton'}
        onClick={() => handleButtonClick('CartButton')}/>
    </header>
  )
}
