import { createStore, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import pReducer from "./reducers";
import { persistStore, persistReducer } from "redux-persist";

const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});

export const reduxStore = createStore(
  pReducer,
  compose(applyMiddleware(thunkMiddleware, loggerMiddleware))
);

export const persistor = persistStore(reduxStore);
