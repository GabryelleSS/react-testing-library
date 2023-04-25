import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";

export const MOODS = {
  SAD: 'sad',
  HAPPY: 'happy',
  KO: 'ko',
  SHOCKED: 'shocked', 
  BLISSFUL: 'blissful', 
  LOVESTRUCK: 'lovestruck', 
  EXCITED: 'excited'
}

const INITIAL_STATE = { mood: MOODS.SAD, reposName: [] };

export const updateCatMood = createAction('UPDATE_MOOD');

export const updateReposName = createAction('UPDATE_REPOS_NAME');

export const moodReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case updateCatMood.type: 
      return { ...state, mood: action.payload };
    case updateReposName.type: 
      return { ...state, reposName: action.payload };
    default: 
      return state;
  }
};

// export const moodReducer = createReducer(INITIAL_STATE, {
//   [updateCatMood.type]: (state, action) => {
//     state.mood = action.payload;
//   }
// }, [], (state => state));

// export const moodSlice = createSlice({
//   name: 'mood',
//   initialState: INITIAL_STATE,
//   reducers: {
//     updateCatMood: (state, action) => {
//       state.mood = action.payload;
//     }
//   }
// });
