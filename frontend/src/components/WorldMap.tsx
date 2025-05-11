import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import geoData from "../data/geoData.json";

const WorldMap = ({ visitingUser }: { visitingUser: any }) => {
  console.log("rendering map");

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
  };

  const handleCountryHover = (country: string) => {
    setSelectedCountry(country);
  };

  const handleCountryLeave = () => {
    setSelectedCountry(null);
  };

  if (!("visitedCountries" in visitingUser)) {
    return <div></div>;
  }

  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{
        rotate: [-9, 0, 0],
        scale: 200,
        center: [12, 0],
      }}
      style={{
        backgroundColor: "#f2f5f7",
        borderRadius: "10px",
        height: "100%",
        width: "100%",
        // paddingTop: "15px",
        // border: "1px solid #d8dfe3",
      }}>
      <Geographies geography={geoData}>
        {({ geographies }) =>
          geographies.map((geo) => {
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                stroke="#c2d0db"
                onClick={() => handleCountryClick(geo)}
                // onMouseEnter={() => handleCountryHover(geo)}
                // onMouseLeave={() => handleCountryLeave()}
                style={{
                  default: {
                    fill: visitingUser.visitedCountries.includes(
                      geo.properties.name
                    )
                      ? "#3388b0"
                      : "#e1e8ed",
                    outline: "none",
                  },
                  hover: {
                    fill: "white",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#3388b0",
                    outline: "none",
                  },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default React.memo(WorldMap);
