import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

const API_URL = "https://secrets-api.appbrewery.com";

const username = "paula";
const password = "1234";
const apiKey = "32712731-c610-4ee5-9c76-eb1911428957";
const bearerToken = "61301e07-ae6b-4a56-9ac0-b52709ecfb43";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

// Sin autenticacion se muestra un secreto random
app.get("/noAuth", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/random");
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(`Error: ${error.message}`);
  }
});

// Con autenticacion basica se muestran los secretos de la pagina 2
app.get("/basicAuth", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/all?page=2", {
      auth: {
        username: username,
        password: password,
      },
      params: { username },
    });
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(`Error: ${error.message}`);
  }
});

// Con una apiKey devuelve los secretos con un score de verguenza mayor o igual a 5
app.get("/apiKey", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/filter", {
      params: {
        apiKey: apiKey,
        score: 5,
      },
    });
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(`Error: ${error.message}`);
  }
});

// Con el token devuelve el secreto con id=42
app.get("/bearerToken", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/secrets/42", {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(`Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
