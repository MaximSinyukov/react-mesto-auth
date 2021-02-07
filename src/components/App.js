import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import api from '../utils/api';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Route, Switch, Redirect, useHistory, withRouter } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App() {
  React.useEffect(() => { tokenCheck() }, []);

  const history = useHistory();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = React.useState(false);
  const [isInfoTooltipText, setIsInfoTooltipText] = React.useState('');
  const [selectedCard, setSelectedCard] = React.useState();
  const [currentUser, setCurrentUser] = React.useState('');
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState('');

  function handleSetEmail(data) {
    setEmail(data.email);
  }

  function handleRegister(data) {
    api.registerUser(data)
      .then((res) => {
        history.push('/signin');
        setIsInfoTooltipText('Вы успешно зарегистрировались!');
        setIsInfoTooltipOpen(true);
        setIsInfoTooltipSuccess(true);
      })
      .catch((err) => {
        setIsInfoTooltipText('Что-то пошло не так! Попробуйте еще раз.');
        setIsInfoTooltipOpen(true);
        setIsInfoTooltipSuccess(false);
      });
  }

  function handleHeaderButton() {
    if (email === 'Регистрация') {
      history.push('/signup');
    } else {
      if (email !== 'Войти') {
        localStorage.removeItem('token');
      }
      history.push('/signin');
    }
  }

  function handleLogin(data) {
    api.loginUser(data)
      .then((res) => {
        localStorage.setItem('token', res.token);
        tokenCheck();
      })
      .catch((err) => {
        console.log(`Ошибка входа: ${err}`);
        setIsInfoTooltipText('Что-то пошло не так! Попробуйте еще раз.');
        setIsInfoTooltipOpen(true);
        setIsInfoTooltipSuccess(false);
      });
  }

  function tokenCheck() {
    if (localStorage.getItem('token')){
      const token = localStorage.getItem('token');
      api.getUser(token)
        .then((res) => {
          loginUser(res);
          history.push('/');
        })
        .catch((err) => console.log('Ошибка проверки токена'));
    }
  }

  function loginUser(data) {
    setLoggedIn(true);
    handleSetEmail(data);
    setCurrentUser(data);
    const token = localStorage.getItem('token');
    api.getInitialCards(token)
      .then((data) => {
        setCards(data.reverse());
      })
      .catch((err)=>{
        console.log(`Ошибка запроса карточек: ${err}`);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    const token = localStorage.getItem('token');
    api.changeLikeCardStatus(card.cardId, !isLiked, token)
      .then((newCard) => {
        const newCards = cards.map((c) => c._id === card.cardId ? newCard : c);
        setCards(newCards);
      })
      .catch((err)=>{
        console.log(`Ошибка лайка: ${err}`);
      });
  }

  function handleCardDelete(id) {
    const token = localStorage.getItem('token');
    api.deleteCard(id.cardId, token)
      .then(() => {
        const newCards = cards.filter((c) => {
          return !(c._id === id.cardId)
        });
        setCards(newCards);
      })
      .catch((err)=>{
        console.log(`Ошибка удаления карточки: ${err}`);
      });
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (data) => {
    setSelectedCard(data);
  };

  const handleUpdateUser = (data) => {
    const token = localStorage.getItem('token');
    api.updateProfileInfo(data, token)
      .then((newProfile) => {
        setCurrentUser(newProfile);
        closeAllPopups();
      })
      .catch((err)=>{
        console.log(`Ошибка обновления профиля: ${err}`);
      });
  };

  const handleUpdateAvatar = (data) => {
    const token = localStorage.getItem('token');
    api.updateProfileAvatar(data, token)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err)=>{
        console.log(`Ошибка обновления аватара: ${err}`);
      });
  };

  const handleAddPlace = (data) => {
    const token = localStorage.getItem('token');
    api.createCard(data, token)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err)=>{
        console.log(`Ошибка создания карточки: ${err}`);
      });
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard();
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} onSignOut={handleHeaderButton} />
        <Switch>
          <Route path="/signin">
            <Login onSetEmail={handleSetEmail} onLogin={handleLogin} />
          </Route>
          <Route path="/signup">
            <Register onSetEmail={handleSetEmail} onRegister={handleRegister} />
          </Route>
          <ProtectedRoute path="/" loggedIn={loggedIn} component={Main} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick} cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete} />
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
        <Footer />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <ImagePopup onClose={closeAllPopups} card={selectedCard} />
        <InfoTooltip isOpen={isInfoTooltipOpen} success={isInfoTooltipSuccess} onClose={closeAllPopups} successText={isInfoTooltipText} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
