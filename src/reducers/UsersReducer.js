const UsersReducer = (usersData = {}, action) => {
  switch (action.type) {
    case 'DEBIT':
      return (usersData = action.payload);

    case 'CREDIT':
      return (usersData = action.payload);

    case 'ALL':
      return (usersData = action.payload);

    default:
      return usersData;
  }
};

export default UsersReducer;
