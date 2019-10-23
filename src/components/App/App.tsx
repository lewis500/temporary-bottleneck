import React, { useContext, useReducer } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { useTimer } from "src/useTimerHook";
import * as params from "src/constants";
import { AppContext, reducer, initialState } from "src/ducks";
import TimeSpace from "src/components/TimeSpace";
import { makeStyles, colors } from "@material-ui/core";

const EMPTY = {};
const App = () => {
  const { state, dispatch } = useContext(AppContext),
    { play } = state,
    classes = useStyles(EMPTY);

  useTimer((dt: number) => {
    dt *= 4;
    dispatch({ type: "TICK", payload: dt });
  }, play);

  if (state.time > params.duration) dispatch({ type: "RESET" });

  return (
    <div className={classes.main}>
      <Paper className={classes.paper} elevation={2}>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={() => dispatch({ type: "SET_PLAY", payload: !play })}
        >
          {play ? "PAUSE" : "PLAY"}
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={() => {
            dispatch({ type: "RESET" });
          }}
        >
          Reset
        </Button>
      </Paper>
      <TimeSpace width={700} height={400}/>
    </div>
  );
};

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <App />
    </AppContext.Provider>
  );
};

const useStyles = makeStyles({
  "@global": {
    body: {
      margin: "0 !important",
      padding: "0 !important",
      fontFamily: " 'Puritan', sans-serif"
    }
  },
  main: {
    maxWidth: "900px",
    color: colors.grey["800"],
    margin: "0 auto",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column"
  },
  paper: {
    maxWidth: "500px",
    // width: 300,
    margin: "auto",
    display: "flex",
    // padding: "24px 36px",
    padding: "20px",
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    margin: "5px"
  },
  // button: {
  //   alignSelf: "center"
  // },
  visContainer: {
    margin: "0 auto"
  },
  sliderContainer: {
    width: "300px",
    padding: "20px",
    boxSizing: "border-box"
  }
});
