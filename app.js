const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const axios = require("axios");
const methodOverride = require("method-override");

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

// STYLESHEET
app.use(express.static("public"));

app.use(express.static("pwa"));

app.get("/", function(req, res) {
	axios
		.get(`${process.env.API_URL}/party`)
		.then(({ data }) => {
			res.render("index", {
				baseUrl: process.env.FRONT_URL,
				parties: data,
				title: "Accueil",
			});
		})
		.catch(err => console.log(err));
});

app.patch("/party/:id", function(req, res) {
	const id = req.params.id;
	axios
		.patch(`${process.env.API_URL}/party/${id}`, req.body)
		.then(({ data }) => res.redirect(`/party/${id}`))
		.catch(err => res.send(err));
});

app.get("/party/:id", function(req, res) {
	const id = req.params.id;

	axios
		.get(`${process.env.API_URL}/party/${id}`)
		.then(({ data }) =>
			res.render("party", {
				id: id,
				party: data,
				title: data.name,
				items: data.items,
				urlModif: `/party/${data._id}?_method=PATCH`,
				urlModifItem: `/party/${data._id}/items`,
				url: `${process.env.FRONT_URL}/party/${data._id}`,
				urlApi: `https://quiprendquoi-api.benjaminadida.fr/party/${data._id}`,
				baseUrl: process.env.FRONT_URL,
			}),
		)
		.catch(err => console.log(err));
});

app.post("/party", function(req, res) {
	axios
		.post(`${process.env.API_URL}/party`, req.body)
		.then(({ data }) => res.redirect(`/party/${data._id}`))
		.catch(err => res.send(err));
});

app.patch("/party/:id/items/:itemId", function(req, res) {
	const id = req.params.id;
	const itemId = req.params.itemId;
	axios
		.patch(`${process.env.API_URL}/party/${id}/items/${itemId}`, req.body)
		.then(({ data }) => res.redirect(`/party/${id}`))
		.catch(err => res.send(err));
});

app.post("/party/:id/items", (req, res) => {
	const id = req.params.id;
	axios
		.post(`${process.env.API_URL}/party/${id}/items`, req.body)
		.then(() => res.redirect(`/party/${id}`))
		.catch(err => console.log(err));
});

app.delete("/party/:id/items/:itemId", (req, res) => {
	axios
		.delete(
			`${process.env.API_URL}/party/${req.params.id}/items/${req.params.itemId}`,
		)
		.then(data => res.redirect(`/party/${req.params.id}`))
		.catch(err => console.log(err));
});

app.delete("/party/:id", (req, res) => {
	axios
		.delete(`${process.env.API_URL}/party/${req.params.id}`)
		.then(data => res.redirect(`/`))
		.catch(err => console.log(err));
});

app.listen(port, () => console.log(`Front app listening on port ${port}!`));
