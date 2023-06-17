export default function (state = {}, action) {
  if (action.type == "login") {
    return { ...state, data: action.payload, authenticated: true };
  }

  return state;
}
