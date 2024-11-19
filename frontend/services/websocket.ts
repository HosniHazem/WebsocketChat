let socket: WebSocket | null = null;

export function connectSocket(token: string) {
  const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    console.log("Message received:", event.data);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
}

export function getSocket() {
  return socket;
}
