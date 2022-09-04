const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(
  cors({
    origin: "*",
  })
);

const generateData = () => {
  const count = Math.floor(Math.random() * 100 + 11);
  const data = {
    count,
    results: [],
  };
  for (let i = 0; i < count; ++i) {
    data.results.push({
      id: i + 1,
      name: "example " + (i + 1),
    });
  }
  return data;
};

const users = generateData();

const generateFilteredData = (page) => {
  const { count, results } = users;
  const data = { count, results: results.slice(page * 10, page * 10 + 10) };
  return data;
};

app.get("/users", (req, res) => {
  const page = req.query.page;
  if (page) {
    res.send(JSON.stringify(generateFilteredData(page)));
    return;
  }
  res.send(JSON.stringify(users));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
