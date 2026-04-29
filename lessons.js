import fs from "fs";
import path from "path";
const DATA_FILE = path.join(process.cwd(), "data", "lessons.json");
function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ lessons: [], schoolData: {} }));
}
export default function handler(req, res) {
  ensureFile();
  if (req.method === "GET") {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.status(200).json(data);
  } else if (req.method === "POST") {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body));
    res.status(200).json({ ok: true });
  } else {
    res.status(405).end();
  }
}
