import axios from 'axios';

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

export const checkUrl = (message) => {
  if (isEmpty(message)) return false;

  const regexp = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
    'g'
  );

  if (!regexp.test(message)) return false;

  return true;
};

export const extractUrl = (message) => {
  if (isEmpty(message)) return null;

  return message.match(
    new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
      'g'
    )
  );
};

export const addAnchorTag = (message) => {
  if (!checkUrl(message)) return message;

  const links = extractUrl(message);

  links.forEach((link) => {
    const position = message.search(link);
    message =
      message.slice(0, position) +
      `<a href='${link}' target='_blank' rel='nofollow, noreferrer, noopener'>` +
      message.slice(position, position + link.length) +
      `</a>` +
      message.slice(position + link.length);
  });

  return message;
};

export const refreshToken = () => {
  console.log('refreshing token...');
  axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      localStorage.setItem('token', response.data.authorization);
      localStorage.setItem(
        'tokenExpiration',
        Math.floor(Date.now() / 1000) + response.data.token_expires_in
      );
      console.log('token refresh successfull');
    })
    .catch((err) => console.log('error during refreshing token : ', err));
};

export const tokenIsValid = () => {
  if (
    !isEmpty(localStorage.getItem('token')) &&
    !isEmpty(localStorage.getItem('tokenExpiration')) &&
    localStorage.getItem('tokenExpiration') > Math.floor(Date.now() / 1000)
  )
    return true;
  else return false;
};

export const tokenIsSet = () => {
  if (
    !isEmpty(
      localStorage.getItem('token') &&
        !isEmpty(localStorage.getItem('tokenExpiration'))
    )
  )
    return true;
  else return false;
};
