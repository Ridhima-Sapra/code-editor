// import { io } from 'socket.io-client';

// // In dev:
// export const initSocket = async () => {
//   const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


// export const initSocket = async () => {
//     const options = {
//         'force new connection': true,
//         reconnectionAttempt: 'Infinity',
//         timeout: 10000,
//         transports: ['websocket'],
//     };
//     return io(process.env.REACT_APP_BACKEND_URL, options);
// };
import { io } from 'socket.io-client';

export const initSocket = async () => {
  const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
  };

  return io(backendURL, options);
};
