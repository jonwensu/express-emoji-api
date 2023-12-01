import express, { Response } from "express";
import fs from "fs";
import path from "path";

const app = express();

type EmojiQuestion = {
  emoji: string;
  answer: string;
};

const SECRET = "secret lang";

function unauthorized(res: Response) {
  return res.status(401).send("Unauthorized");
}

app.use(express.json());
app.use((req, res, next) => {
  const secret = req.header("X-SECRET");
  if (!secret) return unauthorized(res);
  if (secret !== SECRET) return unauthorized(res);

  console.log("hello");
  next();
});

function pickRandom<T>(pool: T[]) {
  const min = 0;
  const max = pool.length;
  const index = Math.floor(Math.random() * (max - min + 1)) + min;

  return pool[index];
}

app.get("/emoji", async (_req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf8");
  const pool = JSON.parse(data) as EmojiQuestion[];
  const question = pickRandom(pool);

  res.json(question);
});

app.get("/hello/:name", (req, res) => {
  res.json({
    greeting: `hello ${req.params.name}`,
  });
});

app.post("/iseven/:number", (req, res) => {
  const { number } = req.params;

  const isEven = +number % 2 === 0;
  res.json({
    number,
    isEven,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express App started at port ${PORT}`);
});
