//authentication state
export const isLoggedIn = (payload) => {
  return {
    type: 'ISLOGGEDIN',
    payload: payload,
  };
};

export const logIn = (payload) => {
  return {
    type: 'LOGIN',
    payload: payload,
  };
};

export const isLoggedOut = () => {
  return {
    type: 'LOGOUT',
  };
};

//All accounts
export const getAccounts = (payload) => {
  return {
    type: 'LOAD_ACCOUNTS',
    payload: payload,
  };
};

//user data
export const getDebits = (payload) => {
  return {
    type: 'DEBIT',
    payload: payload,
  };
};

export const getCredits = (payload) => {
  return {
    type: 'CREDIT',
    payload: payload,
  };
};

export const getAll = (payload) => {
  return {
    type: 'ALL',
    payload: payload,
  };
};

export const sortByDesc = (payload) => {
  return {
    type: 'SORT_DESC',
    payload: payload,
  };
};

export const sortByAsc = (payload) => {
  return {
    type: 'SORT_ASC',
    payload: payload,
  };
};

export const getTotalCredit = (payload) => {
  return {
    type: 'TOTAL_CREDIT',
    payload: payload,
  };
};
export const getTotalDebit = (payload) => {
  return {
    type: 'TOTAL_DEBIT',
    payload: payload,
  };
};
export const getBalance = (payload) => {
  return {
    type: 'TOTAL',
    payload: payload,
  };
};
