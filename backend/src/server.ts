import createApp from './app.js';
import { config } from './config/env.js';

const startServer = () => {
  const app = createApp();

  const PORT = config.port;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🔗 API prefix: ${config.apiPrefix}`);
  });
};

startServer();

