const routes = (app) => {
    app.route("/").get((req, res) => { res.status(200).send({ title: "Monitor Dominios", version: "1.0.0" }); });
};

export default routes;