import React, {
  createElement as CE,
  FunctionComponent,
  useContext,
  useLayoutEffect
} from "react";
import * as params from "../../constants";
import { AppContext } from "src/ducks";
import { scaleLinear } from "d3-scale";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import useStyles from "./stylePlot";
import simplify from "simplify-js";
import { history } from "src/ducks";
import Vis from "src/components/Road";

const WIDTH = 700,
  HEIGHT = 400,
  M = {
    top: 20,
    bottom: 5,
    left: 20,
    right: 50
  },
  svgProps = {
    width: WIDTH + M.left + M.right,
    height: HEIGHT + M.top + M.bottom
  },
  xScale = scaleLinear()
    .domain([0, params.total])
    .range([HEIGHT, 0]),
  tScale = scaleLinear()
    .domain([0, 2.5 * params.cycle])
    .range([0, WIDTH]),
  gTranslate = `translate(${M.left},${M.top})`,
  range = Array.apply(null, { length: 50 }).map(
    (d: {}, i: number) => i
  ) as number[],
  Mask = (
    <mask id="myMask">
      <rect width={WIDTH} height={HEIGHT} fill="white" />
    </mask>
  );

const TAxis = React.memo(({ mathClass }: { mathClass: string }) => (
  <g transform={`translate(0,${xScale(params.light)})`}>
    <path
      d={`M0,0L${WIDTH},0`}
      fill="none"
      stroke="black"
      markerEnd="url(#arrow)"
    />
    <foreignObject
      width="90"
      height="75"
      transform={`translate(${WIDTH + 10},-10)`}
    >
      <span className={mathClass}>
        <TeX math="t \; \text{(sec)}" />
      </span>
    </foreignObject>
  </g>
));
const XAxis = React.memo(({ mathClass }: { mathClass: string }) => (
  <g>
    <path
      d={`M0,0L0,${HEIGHT}`}
      fill="none"
      stroke="black"
      markerEnd="url(#arrow)"
      markerStart="url(#arrow)"
    />
    <foreignObject width="90" height="75" transform={`translate(-10,-25)`}>
      <span className={mathClass}>
        <TeX math="x \; \text{(m)}" />
      </span>
    </foreignObject>
  </g>
));

const CoverMask = ({ time }: { time: number }) => (
  <mask id="coverMask">
    <rect width={tScale(time)} height={HEIGHT} fill="white" />
  </mask>
);

const Trajectory: FunctionComponent<{
  trajectory: number[][];
  className: string;
}> = ({ trajectory, className }) => {
  return CE("path", {
    className,
    d: simplify(
      trajectory.map(([t, x]) => ({ x: tScale(t), y: xScale(x) })),
      0.2
    ).reduce((a, { x, y }) => a + x + "," + y + " ", "M")
  });
};

const coverMaskStyle = { mask: "url(#coverMask)" };
const Trajectories = React.memo(({ className }: { className: string }) => (
  <g style={coverMaskStyle}>
    {history.map((trajectory, key) =>
      CE(Trajectory, {
        className,
        trajectory,
        key
      })
    )}
  </g>
));

const Marker = React.memo(() => {
  return (
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 15 15"
        refY="5"
        refX="2"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
        fill="black"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );
});
const EMPTY = {};
const maskStyle = { mask: "url(#myMask)" };
export default () => {
  const classes = useStyles(EMPTY),
    { state } = useContext(AppContext);

  return (
    <svg className={classes.svg} style={svgProps}>
      <Marker />
      <g transform={gTranslate}>
        {Mask}
        <CoverMask time={state.time} />
        <g style={maskStyle}>
          <Trajectories className={classes.trajectory} />
          <g
            transform={`translate(${tScale(state.time)},${HEIGHT}) rotate(-90)`}
          >
            <Vis height={30} width={HEIGHT} />
          </g>
        </g>
        <TAxis mathClass={classes.math} />
        <XAxis mathClass={classes.math} />
      </g>
    </svg>
  );
};
