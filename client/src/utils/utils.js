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

export const tokenIsEmpty = () =>
  isEmpty(localStorage.getItem('token')) ||
  isEmpty(localStorage.getItem('tokenExpiration')) ||
  localStorage.length === 0;

export const tokenIsValid = () => {
  if (
    !(
      localStorage.getItem('tokenExpiration') - 5 >
      Math.floor(Date.now() / 1000)
    )
  )
    return false;
  else return true;
};

export const fileIsImage = (fileName) => {
  const regExp = /\.jpg$|\.jpeg$|\.png$|\.gif$/g;
  if (fileName.match(regExp)) return true;
  return false;
};

export const passwordIsValid = (password) => {
  //8 character at least, 1 uppercase, 1 lowercase, 1 digit
  const passwordRegExp = new RegExp(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  );
  return passwordRegExp.test(password);
};

export const emailIsValid = (email) => {
  const emailRegExp = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  return emailRegExp.test(email);
};
