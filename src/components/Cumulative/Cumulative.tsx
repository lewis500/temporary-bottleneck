import React, { createElement as CE, useContext, useMemo } from "react";
import { AppContext } from "src/ducks";
import * as ducks from "src/ducks";
import * as params from "src/constants";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";
import TexLabel from "src/components/TexLabel";
import Arrow from "src/components/Arrow";
import useScale from "src/useScale";

const M = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 10
  },
  gTranslate = `translate(${M.left},${M.top})`;

const marginer = ({ width, height }: { width: number; height: number }) => ({
  width: Math.max(width - M.left - M.right, 0),
  height: Math.max(height - M.top - M.bottom, 0)
});

const EMPTY = {};

const Axes = (() => {
  const style = {
    strokeWidth: "2px",
    color: colors.grey["800"]
  };
  return ({ width, height }: { width: number; height: number }) => (
    <>
      <g>
        <path
          d={`M0,0L0,${height}`}
          fill="none"
          stroke="black"
          style={style}
          markerStart="url(#arrow)"
        />
        <TexLabel dx={-10} dy={-25} latexstring="veh" />
      </g>
      <g transform={`translate(0,${height})`}>
        <path
          d={`M0,0L${width},0`}
          fill="none"
          stroke="black"
          markerEnd="url(#arrow)"
          style={style}
        />
        <TexLabel dx={width - 5} dy={5} latexstring="t" />
      </g>
    </>
  );
})();

export default ({ width, height }: { width: number; height: number }) => {
  const { state } = useContext(AppContext),
    classes = useStyles({ width, height });
  // let { width, height } = marginer({ width, height });
  width = width - M.left - M.right;
  height = height - M.top - M.bottom;
  const vehScale = useScale(
      [height, 0],
      [0, params.Q * params.duration],
      [height]
    ),
    tScale = useScale([0, width], [0, params.duration], [width]),
    dPath = useMemo(() => {
      return "M" + ducks.cumulative.map(d => [tScale(d.t), vehScale(d.d)]);
    }, [width, height]);

  const aPath = useMemo(() => {
    return "M" + ducks.cumulative.map(d => [tScale(d.t), vehScale(d.a)]);
  }, [width, height]);
  return (
    <svg className={classes.svg}>
      <Arrow />
      <g transform={gTranslate}>
        <mask id="coverMask-cum">
          <rect width={tScale(state.time)} height={height} fill="white" />
        </mask>
        <g mask="url(#coverMask-cum)">
          <path className={classes.aPath} d={aPath} />
          <path className={classes.dPath} d={dPath} />
        </g>
        <Axes width={width} height={height} />
      </g>
    </svg>
  );
};

const useStyles = makeStyles({
  dot: {
    fill: colors.pink["500"],
    stroke: "white",
    strokeWidth: "2px"
  },
  path: {
    strokeWidth: "4px",
    fill: "none",
    stroke: colors.lightBlue["A700"],
    opacity: 0.8
  },
  aPath: {
    stroke: params.aColor,
    fill: "none",
    strokeWidth: 2
  },
  dPath: {
    stroke: params.dColor,
    fill: "none",
    strokeWidth: 2
  },
  container: {
    position: "relative",
    width: "100%",
    height: "100%"
  },
  line: {
    strokeWidth: "1.5px",
    stroke: colors.lightBlue["A400"],
    strokeDasharray: "2,2"
  },
  svg: ({ width, height }: { width: number; height: number }) => ({
    width,
    height,
    "& text": {
      fontFamily: "Puritan, san-serif",
      fontSize: "11px"
    }
  }),
  masked: {
    mask: "url(#myMask2)"
  },
  maskedLines: {
    mask: "url(#myMask3)"
  },
  road: {
    stroke: colors.grey["300"]
    // opacity: .95
  },
  text: {
    textAlign: "center",
    fontSize: "10px"
  }
});
