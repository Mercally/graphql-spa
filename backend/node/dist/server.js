"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const mongo_1 = require("./db/mongo");
const app_1 = require("./app");
async function main() {
    const config = (0, env_1.loadConfig)();
    const { db } = await (0, mongo_1.connectMongo)(config);
    const app = await (0, app_1.buildApp)(db);
    await app.listen({ port: config.port, host: '0.0.0.0' });
    app.log.info(`REST API at http://localhost:${config.port}/api`);
    app.log.info(`GraphQL API at http://localhost:${config.port}/graphql`);
    app.log.info(`GraphiQL IDE at http://localhost:${config.port}/graphiql`);
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Fatal error starting server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map