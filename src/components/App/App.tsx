import React, { useContext, useReducer } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { useTimer } from "src/useTimerHook";
import * as params from "src/constants";
import { AppContext, reducer, initialState } from "src/ducks";
import TimeSpace from "src/components/TimeSpace";
import { makeStyles, colors } from "@material-ui/core";
import Cumulative from "../Cumulative";
import Slider from "@material-ui/core/Slider";
import TeX from "@matejmazur/react-katex";
import { withStyles } from "@material-ui/core/styles";

const StyleSlider = withStyles(() => ({
  root: {
    color: colors.pink["A400"],
    marginBottom: "5px"
  }
}))(Slider);

const EMPTY = {};
const App = () => {
  const { state, dispatch } = useContext(AppContext),
    { play } = state,
    classes = useStyles(EMPTY);

  useTimer((dt: number) => {
    dt *= params.speed;
    dispatch({ type: "TICK", payload: dt });
  }, play);

  if (state.time > params.duration) dispatch({ type: "RESET" });

  return (
    <>
      <div className={classes.title}>
        <div>Temporary Bottleneck</div>
      </div>
      <div className={classes.main}>
        <div>
          <TimeSpace width={700} height={350} />
        </div>
        <div>
          <Cumulative width={400} height={350} />
          <div className={classes.paper}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
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
            </div>
            <div className={classes.sliderLabel} style={{ marginTop: 15 }}>
              time <TeX math="t" />
            </div>
            <StyleSlider
              component="div"
              onChange={(e, payload: number) =>
                dispatch({ type: "SET_TIME", payload })
              }
              value={state.time}
              step={(1 / 200) * params.duration}
              min={0}
              max={params.duration}
            />
          </div>
        </div>
      </div>
    </>
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
  sliderLabel: {
    fontSize: "14px",
    marginTop: "5px"
  },
  main: {
    color: colors.grey["800"],
    margin: "auto",
    display: "flex",
    justifyContent: "center"
    // marginTop: '20px'
  },
  paper: {
    maxWidth: "500px",
    // margin: "auto",
    // justifyConten
    display: "flex",
    padding: "20px",

    flexDirection: "column",
    alignItems: "center"
  },
  title: {
    backgroundColor: colors.lightBlue["A700"],
    color: "white",
    width: "100%",
    height: "50px",
    display: "flex",
    fontFamily: "Helvetica",
    boxShadow: "1px 1px 2px grey",
    marginBottom: "15px",
    alignItems: "center",
    padding: "5px",
    paddingLeft: "30px",
    fontSize: "22px",
    boxSizing: "border-box"
  },
  button: {
    margin: "5px",
    width: '100px'

  },
  visContainer: {
    margin: "0 auto"
  },
  sliderContainer: {
    width: "300px",
    padding: "20px",
    boxSizing: "border-box"
  }
});
