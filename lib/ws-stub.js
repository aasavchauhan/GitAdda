// Empty stub for ws module in Edge runtime
// Edge runtime has native WebSocket support
const WebSocketImpl = globalThis.WebSocket || class WebSocket {};
export default WebSocketImpl;
export { WebSocketImpl as WebSocket };
