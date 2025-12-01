import { createMlApp } from "./app";

const PORT = Number(process.env.PORT || 5001);

const app = createMlApp();

app.listen(PORT, () => {
  console.log(`🧪 ML service listening on http://localhost:${PORT}`);
});
