import {config} from './constants';

class Api {
  constructor(options) {
    this.url = options.baseUrl;
  }

  _handleResponse(response){
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response.statusText);
    }
  }

  getUser(token) {
    return fetch(`${this.url}/users/me`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    })
      .then(this._handleResponse);
  }

  getInitialCards(token) {
    return fetch(`${this.url}/cards`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    })
      .then(this._handleResponse);
  }

  updateProfileInfo(data, token) {
    return fetch(`${this.url}/users/me`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          about: data.object
        })
      }
    )
      .then(this._handleResponse);
  }

  updateProfileAvatar(data, token) {
    return fetch(`${this.url}/users/me/avatar`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          avatar: data.avatar
        })
      }
    )
      .then(this._handleResponse);
  }

  createCard(data, token) {
    return fetch(`${this.url}/cards`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          link: data.object
        })
      }
    )
      .then(this._handleResponse);
  }

  deleteCard(id, token) {
    return fetch(`${this.url}/cards/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      }
    )
      .then(this._handleResponse);
  }

  changeLikeCardStatus(id, isLiked, token) {
    if (isLiked) {
      return fetch(`${this.url}/cards/likes/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      }
    )
      .then(this._handleResponse);
    } else {
      return fetch(`${this.url}/cards/likes/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      }
    )
      .then(this._handleResponse);
    }
  }

  registerUser(data) {
    return fetch(`${this.url}/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      }
    )
    .then(this._handleResponse);
  }

  loginUser(data) {
    return fetch(`${this.url}/signin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: data.password,
          email: data.email
        })
      }
    )
    .then(this._handleResponse);
  }
}

const api = new Api(config);

export default api;
