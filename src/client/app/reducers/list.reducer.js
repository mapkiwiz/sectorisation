let initialState = {
  title: '',
  items: [],
  visible_items: [],
  selected: [],
  scrollIndex: undefined };

export {initialState};

export function listReducer(prefix) {
  return (state = initialState, action) => {

    if (!action.type.startsWith(prefix)) {
      return state;
    }

    let actionType = action.type.slice(prefix.length);

    switch (actionType) {
      case 'SELECT':
        return { ...state, selected: [ ...state.selected, action.id ], scrollIndex: undefined };
      case 'SELECT_ONE':
        return { ...state, selected: [ action.id ], scrollIndex: undefined };
      case 'TOGGLE':
        if (state.selected.includes(action.id)) {
          return { ...state, selected: state.selected.filter(i => (i !== action.id)), scrollIndex: undefined };
        } else {
          return { ...state, selected: [ ...state.selected, action.id ], scrollIndex: undefined };
        }
      case 'TOGGLE_ONE':
        if (state.selected.includes(action.id)) {
          return { ...state, selected: [], scrollIndex: undefined };
        } else {
          return { ...state, selected: [ action.id ], scrollIndex: undefined };
        }
      case 'UNSELECT':
        return { ...state, selected: state.selected.filter(i => (i !== action.id)), scrollIndex: undefined };
      case 'SET_SELECTION':
        return { ...state, selected: action.selection, scrollIndex: undefined };
      case 'SET_LIST_TITLE':
        return { ...state, title: action.title, scrollIndex: undefined };
      case 'SET_ITEMS':
        return { ...state, items: action.items, visible_items: action.items, scrollIndex: undefined };
      case 'FLUSH_ITEMS':
        return initialState;
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
}
