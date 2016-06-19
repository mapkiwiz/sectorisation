import _ from 'lodash';

let initialState = {
  items: {},
  selection: undefined
};

export function isochrones(state = initialState, action) {

  switch (action.type) {
    case 'ISOCHRONE_SELECT':
      if (_.has(state.items, action.key))
        return { ...state, selection: action.key };
    case 'ISOCHRONE_UNSELECT':
      return { ...state, selection: undefined };
    case 'ISOCHRONE_STORE':
      return { ...state, items: { ...state.items, [action.key]: action.payload }};
    case 'ISOCHRONE_DELETE':
      return { ...state, items: _.omitBy(state.items, (value, key) => (key !== action.key) ) };
    default:
      return state;
  }

}
