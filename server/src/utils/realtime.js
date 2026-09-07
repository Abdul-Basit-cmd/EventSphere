const notificationClients = new Map();

export const subscribeToNotifications = (userId, res) => {
  const key = userId.toString();

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  res.write(`event: connected\ndata: ${JSON.stringify({ status: "connected" })}\n\n`);

  const client = {
    res,
    keepAlive: setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 25000),
  };

  if (!notificationClients.has(key)) {
    notificationClients.set(key, new Set());
  }

  notificationClients.get(key).add(client);

  res.on("close", () => {
    clearInterval(client.keepAlive);
    const clients = notificationClients.get(key);
    clients?.delete(client);

    if (clients?.size === 0) {
      notificationClients.delete(key);
    }
  });
};

export const sendRealtimeNotification = (userId, notification) => {
  const clients = notificationClients.get(userId.toString());
  if (!clients) return;

  const payload = JSON.stringify(notification);
  clients.forEach(({ res }) => {
    res.write(`event: notification\ndata: ${payload}\n\n`);
  });
};
