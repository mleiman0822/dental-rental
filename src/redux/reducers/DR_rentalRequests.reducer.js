const rentalRequestsReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_REQUESTS':
        return action.payload;
      default:
        return state;
    }
  };

  export default rentalRequestsReducer;