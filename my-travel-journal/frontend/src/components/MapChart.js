import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import geoData from "../data/geoData.json";

const MapChart = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountryClick = (geo) => {
    setSelectedCountry(geo);
  };

  const handleCountryHover = (geo) => {
    setSelectedCountry(geo);
  };

  const handleCountryLeave = () => {
    setSelectedCountry(null);
  };

  return (
    <div>
      {selectedCountry ? (
        <div>{selectedCountry.properties.name}</div>
      ) : (
        <div>nothing</div>
      )}
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
        style={{
          width: "100%",
          height: "auto",
        }}>
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo)}
                onMouseEnter={() => handleCountryHover(geo)}
                onMouseLeave={() => handleCountryLeave()}
                style={{
                  default: {
                    fill: "#D6D6DA",
                    outline: "none",
                  },
                  hover: {
                    fill: "#F53",
                    outline: "none",
                  },
                  selected: {
                    fill: "#6B8E23",
                    outline: "none",
                  },
                  pressed: {
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapChart;
