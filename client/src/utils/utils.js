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
  if (isEmpty(message)) return undefined;
  
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
      `<a href='${link}' target='_blank'>` +
      message.slice(position, position + link.length) +
      `</a>` +
      message.slice(position + link.length);
  });

  return message;
};