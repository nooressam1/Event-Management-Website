//This component hold one color text mapping to tsconfig colors to avoid prop abundace and unify design
// theme returns bg-border-text

const ColorMap = {
  green: {
    bg: "bg-MainGreenBackground",
    border: "border-MainGreenLine",
    text: "text-MainGreen",
  },
  blue: {
    bg: "bg-MainBlueBackground",
    border: "border-MainBlueLine",
    text: "text-MainBlue",
  },
  red: {
    bg: "bg-OffRedbackground",
    border: "border-OffRedLine",
    text: "text-MainRed",
  },
  yellow: {
    bg: "bg-MainYellowBackground",
    border: "border-MainYellowLine",
    text: "text-MainYellow",
  },
  //add more colors here
};

export default ColorMap;
