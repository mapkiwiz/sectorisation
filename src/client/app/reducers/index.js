let initialState = {
  title: '',
  items: [],
  visible_items: [],
  selected: [],
  scrollIndex: undefined }

let reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'SELECT':
      return { ...state, selected: [ ...state.selected, action.id ], scrollIndex: undefined };
    case 'SELECT_ONE':
      return { ...state, selected: [ action.id ] };
    case 'UNSELECT':
      return { ...state, selected: state.selected.filter(i => (i !== action.id)), scrollIndex: undefined };
    case 'SET_LIST_TITLE':
      return { ...state, title: action.title, scrollIndex: undefined };
    case 'SET_ITEMS':
      return { ...state, items: action.items, visible_items: action.items, scrollIndex: undefined };
    case 'SCROLL_TO':
      return { ...state, scrollIndex: action.index };
    case 'FILTER':
      let filtered_items = state.items.filter((item: any) => {
        return action.filter(item);
      });
      return { ...state, visible_items: filtered_items, scrollIndex: undefined };
    case 'RESET_FILTER':
      return { ...state, visible_items: state.items, scrollIndex: undefined };
    default:
      return state;
  }

};

export {reducer};
