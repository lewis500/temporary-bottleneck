import React, {
  createElement as CE,
  FunctionComponent,
  useLayoutEffect,
  useRef,
  useContext,
  Dispatch
} from "react";
import * as params from "src/constants";
import { AppContext } from "src/ducks";
import { scaleLinear } from "d3-scale";
import memoizeone from "memoize-one";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import useStyles from "./styleFD";

const WIDTH = 200;
const HEIGHT = (WIDTH * 2) / 3;
const M = {
    top: 10,
    bottom: 40,
    left: 40,
    right: 10
  },
  kScale = scaleLinear()
    .domain([0, params.kj])
    .range([0, WIDTH]),
  qScale = scaleLinear()
    .domain([0, params.q0 * 1.2])
    .range([HEIGHT, 0]),
  getTranslate = memoizeone((vpx, xpx) => `translate(${vpx},${xpx})`),
  range: number[] = Array.apply(null, { length: 50 }).map(
    (d: {}, i: number) => i
  ),
  myMask = (
    <mask id="myMask">
      <rect width={WIDTH} height={HEIGHT} fill="white" />
    </mask>
  );

const KAxis: FunctionComponent<{ mathClass: string }> = React.memo(
  ({ mathClass }) => (
    <g transform={`translate(0,${HEIGHT})`}>
      <path d={`M0,0L${WIDTH},0`} fill="none" stroke="black" />
      <foreignObject
        width="90"
        height="75"
        transform={`translate(${WIDTH + 3},-10)`}
      >
        <span className={mathClass}>
          <TeX math="k \; \text{(veh/km)}" />
        </span>
      </foreignObject>
    </g>
  )
);

const QAxis: FunctionComponent<{ mathClass: string }> = React.memo(
  ({ mathClass }) => (
    <g>
      <path d={`M0,0L0,${HEIGHT}`} fill="none" stroke="black" />
      <foreignObject width="90" height="75" transform={`translate(5,-10)`}>
        <span className={mathClass}>
          <TeX math="q \; \text{(veh/min)}" />
        </span>
      </foreignObject>
    </g>
  )
);

const qk = (k: number) => Math.min(k * params.vf, (params.kj - k) * params.w);

const Path = React.memo(({ className }: { className: string }) =>
  CE("path", {
    className,
    d:
      "M" +
      range
        .map(d => (d / (range.length-1)) * params.kj)
        .map(k => [kScale(k), qScale(qk(k))])
        .join("L")
  })
);

const EMPTY = {};
const svgProps = {
  height: HEIGHT + M.top + M.bottom,
  width: WIDTH + M.left + M.right
};
const gTranslate = `translate(${M.left},${M.top})`;
export default () => {
  const classes = useStyles(EMPTY);
  // const { state } = useContext(AppContext);
  return (
    <svg className={classes.svg} style={svgProps}>
      <g transform={gTranslate}>
        {myMask}
        <rect className={classes.hidden} width={WIDTH} height={HEIGHT} />
        <KAxis mathClass={classes.math} />
        <QAxis mathClass={classes.math} />
        <Path className={classes.path} />
      </g>
    </svg>
  );
};
