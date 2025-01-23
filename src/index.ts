import app from "./app";
import { startStandaloneServer } from "@apollo/server/standalone";
import { server } from "./graphql-server/src";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT: " + PORT);
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`APOLLO SERVER RUNNING IN URL: ${url}`);
})();
