import { makeStyles, createStyles } from "@material-ui/styles";
// createStyles
import { colors } from "@material-ui/core";
export default makeStyles(
  createStyles({
    svg: {
      "& text": {
        fontFamily: "Puritan, san-serif",
        fontSize: "13px"
      }
    },
    math: {
      fontSize: "12px"
    },
    trajectory: {
      fill: "none",
      stroke: colors.lightBlue["A400"],
      strokeWidth: "2px"
    },
    interface: {
      strokeWidth: "3px",
      stroke: colors.pink["500"]
    },
    hidden: {
      fill: "white",
      opacity: 0
    },
    marker: {
      fill: colors.lightBlue["A700"]
    }
  })
);
