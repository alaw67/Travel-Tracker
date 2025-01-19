import asyncHandler from "express-async-handler";

const getVisitedCountries = asyncHandler(async (req, res) => {
  const { visitedCountries } = req.user;
  res.status(200).json({
    visitedCountries,
  });
});

const addVisitedCountry = asyncHandler(async (req, res) => {
  const { country } = req.body;

  console.log("visitedCountries: ", req.user.visitedCountries);
  if (req.user.visitedCountries.includes(country)) {
    res.status(400);
    throw new Error("Country already added!");
  }
  req.user.visitedCountries.push(country);

  await req.user.save();
  console.log("visitedCountries: ", req.user.visitedCountries);
  const { visitedCountries } = req.user;
  res.status(200).json({
    visitedCountries,
  });
});

const removeVisitedCountry = asyncHandler(async (req, res) => {
  const { country } = req.body;
  const index = req.user.visitedCountries.indexOf(country);
  if (index === -1) {
    res.status(400);
    throw new Error("Country does not exist in visited countries");
  }
  req.user.visitedCountries.splice(index, 1);
  await req.user.save();
  const { visitedCountries } = req.user;
  res.status(200).json({
    visitedCountries,
  });
});

export { getVisitedCountries, addVisitedCountry, removeVisitedCountry };
