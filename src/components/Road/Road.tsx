import React, {
  createElement as CE,
  FunctionComponent,
  useContext,
  useMemo
} from "react";
import { scaleLinear } from "d3-scale";
import { AppContext } from "src/ducks";
import useStyles from "./styleRoad";
import * as params from "src/constants";
import { history, xOfT } from "src/ducks";

const Vis: FunctionComponent<{ width: number; height: number }> = ({
  width,
  height
}) => {
  const { state } = useContext(AppContext),
    classes = useStyles({
      width,
      height
    }),
    xScale = useMemo(
      () =>
        scaleLinear()
          .range([0, width])
          .domain([0, params.total]),
      [width]
    ),
    yScale = useMemo(
      () =>
        scaleLinear()
          .range([height, 0])
          .domain([0, 2 * params.roadWidth]),
      [height]
    );
  const [blockX, roadWidth, carLength, carHeight] = useMemo(
    () => [
      xScale(params.blockX),
      height - yScale(params.roadWidth),
      xScale(params.carLength),
      height - yScale(params.carHeight)
    ],
    [xScale, yScale]
  );
  const [roadPath] = useMemo(
    () => [
      `M0,0L${width},0 M${blockX + roadWidth / 2},${-height / 2}L${blockX +
        roadWidth / 2},${height / 2}`
    ],
    [width, height]
  );
  let t = state.time;
  let M = params.total + params.sj1;
  let xs = history
    .map((d, i) => [i, xOfT[i](t)])
    .filter(d => d[1] < M && d[1] > 0);

  return (
    <g transform={`translate(0,${0})`}>
      <path className={classes.road} d={roadPath} strokeWidth={roadWidth} />
      {xs
        // filter(d=>d[0][])
        .map((d, i) => (
          <rect
            key={d[0]}
            className={classes.car}
            transform={`translate(${xScale(d[1]) - carLength},${-carHeight /
              2})`}
            width={carLength}
            height={carHeight}
          />
        ))}
    </g>
  );
};
export default Vis;
