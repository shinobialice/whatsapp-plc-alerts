import net from "net";
import { parseTcpAlarmMessage } from "./tcp-parser.js";
import { processAlert } from "./alerts.js";
import { logger } from "../utils/logger.js";

export function startTcpServer(port = 4000) {
  const server = net.createServer((socket) => {
    logger.info(
      {
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort
      },
      "TCP client connected"
    );

    let buffer = "";

    socket.on("data", async (chunk) => {
      buffer += chunk.toString();

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
          continue;
        }

        try {
          const alert = parseTcpAlarmMessage(trimmedLine);
          const result = await processAlert(alert);

          logger.info(
            {
              alert,
              result
            },
            "TCP alarm processed"
          );

          socket.write(`OK|${JSON.stringify(result)}\n`);
        } catch (error) {
          logger.error(
            {
              error: error.message,
              rawMessage: trimmedLine
            },
            "TCP alarm failed"
          );

          socket.write(`ERROR|${error.message}\n`);
        }
      }
    });

    socket.on("end", () => {
      logger.info("TCP client disconnected");
    });

    socket.on("error", (error) => {
      logger.error({ error: error.message }, "TCP socket error");
    });
  });

  server.listen(port, () => {
    logger.info(`TCP server listening on port ${port}`);
  });

  return server;
}