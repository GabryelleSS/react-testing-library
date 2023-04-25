import { configureStore } from '@reduxjs/toolkit';

import { moodSlice, moodReducer } from './mood';

// export const store = configureStore({ reducer: moodSlice.reducer });

// export const store = configureStore({ reducer: moodReducer });

console.log('moodReducer', moodReducer)

export const store = configureStore({ reducer: moodReducer });
