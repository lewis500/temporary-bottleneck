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

  return (
    <g transform={`translate(0,${height / 2 - roadWidth / 2})`}>
      <path className={classes.road} d={roadPath} strokeWidth={roadWidth} />
      {history.map((d, i) => (
        <rect
          key={i}
          className={classes.car}
          transform={`translate(${xScale(xOfT[i](state.time)) -
            carLength},${-carHeight / 2})`}
          width={carLength}
          height={carHeight}
        />
      ))}
    </g>
  );
};
export default Vis;
