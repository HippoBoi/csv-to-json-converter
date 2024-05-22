import express from "express";
import cors from "cors";
import multer from "multer";
import csvToJson from "convert-csv-to-json";

const app = express();
const port = process.env.port ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let userData: Array<Record<string, string>> = [];
let convertedFile: string | null = null;

function detectDelimiter(csv: string): string {
    const delimiters = [',', ';'];
    const lines = csv.split('\n').slice(0, 5);
    const delimiterCount = delimiters.map(delimiter =>
        lines.reduce((count, line) => count + (line.split(delimiter).length - 1), 0)
    );

    const maxCountIndex = delimiterCount.indexOf(Math.max(...delimiterCount));
    return delimiters[maxCountIndex];
}

app.use(cors());

app.post("/api/files", upload.single("file"), async (req, res) => {
    const { file } = req;

    if (!file)
        return(res.status(500).json({ message: "Se requiere un archivo" }));
    if (file.size > 1000000) { // 1 MB
        return res.status(500).json({ message: "El archivo debe ser menor a 1 MB" });
    }
    if (file.mimetype !== "text/csv")
        return(res.status(500).json({ message: "El archivo tiene que ser de tipo CSV" }));

    let json: Array<Record<string, string>> = [];

    try {
        const csv = Buffer.from(file.buffer).toString("utf-8");
        const delimiter = detectDelimiter(csv);
        json = csvToJson.fieldDelimiter(delimiter).csvStringToJson(csv);
    } catch (error) {
        return(res.status(500).json({ message: "Error convirtiendo el archivo" }));
    }

    userData = json;
    convertedFile = JSON.stringify(json, null, 2);

    return(res.status(200).json({ data: json, message: "Archivo cargado correctamente." }));
});

app.get("/api/download", async (req, res) => {
    if (!convertedFile) {
        return(res.status(500).json({ message: "No hay archivo subido o guardado." }));
    }

    res.setHeader("Content-disposition", "attachment; filename=converted.json");
    res.setHeader("Content-type", "application/json");
    res.send(convertedFile);
});

app.get("/api/users", async (req, res) => {
    const { q } = req.query

    if (!q) {
        return(res.status(400).json({ message: "Se requere un query param Q" }));
    }
    if (Array.isArray(q)) {
        return(res.status(400).json({ message: "Query param Q debe ser de tipo String" }));
    }

    const search = q.toString().toLowerCase();
    
    const filteredData = userData.filter(data => {
        return(Object.values(data).some(value => value.toLowerCase().includes(search)));
    });

    return res.status(200).json({ data: filteredData });
});

app.listen(port, () => {
    console.log(`El servidor está ejecutandose: http://localhost:${port}`);
});