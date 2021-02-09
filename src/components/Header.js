import React from 'react';
import logo from '../images/header__logo.svg';

function Header({ email, loggedIn, onSignOut }) {
  const [isMobileButtonOpen, setIsMobileButtonOpen] = React.useState(false);

  React.useEffect(() => {
    aa();
  }, [loggedIn]);

  function aa() {
    setIsMobileButtonOpen(false);
  }

  function changeMobileButton() {
    const value = !isMobileButtonOpen;
    setIsMobileButtonOpen(value);
  }

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Место" />
      <div className={`header__container ${(!loggedIn)||(isMobileButtonOpen) ? 'header__container_visible' : ''} ${isMobileButtonOpen ? 'header__container_open' : ''}`}>
        <p className={`header__mail ${(loggedIn)&&(isMobileButtonOpen) ? 'header__mail_visible' : ''}`}>{(email !== 'Войти') ? ((email !== 'Регистрация') ? email : '') : ''}</p>
        <button className={`header__button ${isMobileButtonOpen ? 'header__button_open' : ''}`} onClick={onSignOut}>{(email === 'Войти') || (email === 'Регистрация') ? email : 'Выйти'}</button>
      </div>
      <button className={`header__mobile-button ${loggedIn ? 'header__mobile-button_visible' : ''} ${isMobileButtonOpen ? 'header__mobile-button_open' : ''}`} onClick={changeMobileButton}></button>
    </header>
  );
}

export default Header;
