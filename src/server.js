import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/dbConnect.js";

const PORT = process.env.PORT || 3000;

try {
    await connectDB();  
    console.log("Conexão com o MongoDB estabelecida com sucesso!");
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
} catch (err) {
    console.error("Erro ao conectar no MongoDB:", err.message);
    process.exit(1);
}


