import axios from 'axios';

export const SIGN_UP_USER = 'SIGN_UP_USER';

export const signUpUser = (
  email,
  login,
  password,
  repeatPassword,
  firstName,
  lastName
) => {
  return (dispatch) => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/api/v1/users`,
      data: {
        email,
        username: login,
        password,
        first_name: firstName,
        last_name: lastName,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
