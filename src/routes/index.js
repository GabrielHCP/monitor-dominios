import dominios from "./dominiosRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) => { res.status(200).send({ title: "Monitor Dominios", version: "1.0.0" }); });
    app.use(dominios);
};

export default routes;