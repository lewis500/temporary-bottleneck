import { colors } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
type Props = { width: number; height: number };

export default makeStyles({
  road: {
    // fill: colors.grey["700"],
    stroke: colors.grey["300"]
  },
  car: {
    fill: colors.purple["A400"],
    rx: 1,
    ry: 1
  },
  svg: ({ width, height }: Props) => ({
    width,
    height,
    display: "block",
    // margin: "30px 0",
    "& text": {
      fontFamily: "Puritan, san-serif",
      fontSize: "13px"
    }
  }),
  text: {
    textAlign: "center",
    fontSize: "12px",
    fontFamily: "Puritan, sans-serif"
  }
});
