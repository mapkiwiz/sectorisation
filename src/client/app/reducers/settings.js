let initialState = {
  title: 'Project Title',
  defaults: {
    'worker.capacity': 20,
    'worker.reach': 20,
    'worker.reach.type': 'distance_km'
  }
};

export function settingReducer(state = initialState, action) {
  switch (action.type) {
    default:
          return state;
  }
}
