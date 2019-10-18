import React, { Dispatch } from "react";
import mo from "memoize-one";
import * as params from "src/constants";
import range from "lodash.range";
import { scaleLinear } from "d3-scale";

const vs1 = (() => {
  const { sj1, w1, vf1 } = params;
  return (s: number) => Math.max(Math.min(vf1, (s / sj1 - 1) * w1), 0);
})();

const vs2 = (() => {
  const { sj2, w2, vf2 } = params;
  return (s: number) => Math.max(Math.min(vf2, (s / sj2 - 1) * w2), 0);
})();

type Entry = [number, number];

export const getBlocked = (() => {
  const {
    blockTimes: [a, b]
  } = params;
  return (time: number) => time > a && time < b;
})();

export const history = (() => {
  const { vf1, qc1, delta, sj1, Q, total, blockX } = params,
    S = vf1 / Q,
    numCars = params.duration / Q ;

  let cars: number[] = range(0, numCars).map(i => total - i * S);
  const history = cars.map(x => [[0, x]]);
  for (let t = 0; t < params.duration; t += delta) {
    const blocked = getBlocked(t);
    cars = cars.map((x, i, arr) => {
      let nextX = i === 0 ? Infinity : arr[i - 1];
      if (!blocked || x < blockX) return x + vs1(nextX - x) * delta;
      // should u put a min operation in here to stop overtaking?
      return x + vs2(nextX - x) * delta;
    });
    for (let i = 0; i < history.length; i++) history[i].push([t, cars[i]]);
  }
  return history;
})();

export const xOfT = history.map((d, i) =>
  scaleLinear()
    .domain(d.map(v => v[0]))
    .range(d.map(v => v[1]))
);

export const initialState = {
  play: false,
  time: 0
};

export type State = typeof initialState;
type ActionTypes =
  | {
      type: "TICK";
      payload: number;
    }
  | {
      type: "RESTART";
    }
  | {
      type: "RESET";
    }
  | {
      type: "SET_PLAY";
      payload: boolean;
    };

export const reducer = (state: State, action: ActionTypes): State => {
  switch (action.type) {
    case "TICK":
      return {
        ...state,
        time: state.time + action.payload
      };
    case "SET_PLAY":
      return {
        ...state,
        play: action.payload
      };
    case "RESET":
      return {
        ...state,
        time: 0
      };
    default:
      return state;
  }
};
export const AppContext = React.createContext<{
  state: State;
  dispatch?: Dispatch<ActionTypes>;
}>({ state: initialState, dispatch: null });
