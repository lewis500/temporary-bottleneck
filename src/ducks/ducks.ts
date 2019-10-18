import React, { Dispatch } from "react";
import mo from "memoize-one";
import * as params from "src/constants";
import range from "lodash.range";
import { scaleLinear } from "d3-scale";

const vs = (() => {
  let { sj, w, vf } = params;
  return (s: number) => Math.max(Math.min(vf, (s / sj - 1) * w), 0);
})();

type Entry = [number, number];

export const getGreen = (time: number, cycle: number) =>
  time % cycle < cycle / 2;

export const history = (() => {
  const maxTime = params.cycle * 2.5,
    { delta, light, sj, Q } = params,
    numCars = maxTime / Q,
    S = params.vf / params.Q;

  let cars: number[] = range(0, numCars).map(i => -i * S);
  const history = cars.map(x => [[0, x]]);
  for (let t = 0; t < maxTime; t += delta) {
    let green = getGreen(t, params.cycle);
    cars = cars.map((x, i, arr) => {
      let nextX = i === 0 ? Infinity : arr[i - 1];
      if (!green && x <= light) nextX = Math.min(nextX, light + sj);
      return Math.min(nextX, x + vs(nextX - x) * delta);
    });
    for (let index = 0; index < history.length; index++) {
      history[index].push([t, cars[index]]);
    }
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
      // console.log(action.payload);
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

// export const getStates = (time: number) => {
//   let { vf, cycle, q0, total, light, sj, carLength } = params;
//   if (time < cycle / 2)
//     return [["U", Math.min(time * vf, total)], ["E", total]];
//   if (time % cycle <= cycle / 2)
//     return [
//       ["U", light - (time % cycle) * q0 * sj - carLength],
//       ["J", light],
//       ["E", Math.min(light + (time % cycle) * vf, total)],
//       ["U", total]
//     ];
//   if (time % cycle > cycle / 2)
//     return [
//       ["U", light - ((time % cycle) - cycle / 2) * q0 * sj - carLength],
//       ["J", light],
//       ["E", Math.min(((time % cycle) - cycle / 2) * vf + light, total)],
//       ["U", total]
//     ];
//   // if()
//   // if()
// };
