import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import React, { FC } from "react";
const style = { fontSize: "12px" };
export default React.memo<{
  dx: number;
  dy: number;
  latexstring: string;
}>(({ dx = 0, dy = 0, latexstring = "" }) => (
  <foreignObject width="90" height="75" transform={`translate(${dx}, ${dy})`}>
    <span style={style}>
      <TeX math={latexstring} />
    </span>
  </foreignObject>
));
