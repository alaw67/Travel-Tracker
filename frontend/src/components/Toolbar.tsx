import { Box, IconButton } from "@mui/material";
import Search from "./CountrySearchBar";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PeopleIcon from "@mui/icons-material/People";

const Toolbar = ({
  setVisitedCountries,
  setListToShow,
  listToShow,
}: {
  setVisitedCountries: (countries: [string]) => void;
  setListToShow: (value: string) => void;
  listToShow: string;
}) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "row",
        marginTop: "10px",
        alignItems: "center",
      }}>
      <Search setVisitedCountries={setVisitedCountries} />
      <Box
        sx={{
          display: "inline-flex",
          marginRight: "10px",
        }}>
        <IconButton
          onClick={() => {
            setListToShow("countries");
          }}>
          {listToShow === "countries" ? (
            <FlagRoundedIcon />
          ) : (
            <OutlinedFlagIcon />
          )}
        </IconButton>
        <IconButton
          onClick={() => {
            setListToShow("following");
          }}>
          {listToShow === "following" ? <PeopleIcon /> : <PeopleOutlineIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Toolbar;
