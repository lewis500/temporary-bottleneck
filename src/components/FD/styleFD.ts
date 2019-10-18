import { makeStyles } from "@material-ui/styles";
import { colors } from "@material-ui/core";

export default makeStyles({
  svg: {
    "& text": {
      fontFamily: "Puritan, san-serif",
      fontSize: "13px"
    }
  },
  math: {
    fontSize: "12px"
  },
  path: {
    fill: "none",
    strokeWidth: 2,
    stroke: colors.blue.A400
  },
  hidden: {
    fill: "white",
    opacity: 0
  }
});
