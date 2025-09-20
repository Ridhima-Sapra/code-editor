# Real-Time Code Editor with Collaborative Whiteboard

A **full-stack web application** that allows multiple users to collaborate in real-time on coding projects while also sharing a **whiteboard for visual collaboration**. Built with **React**, **Node.js**, **Express**, and **Socket.IO**, this project demonstrates real-time synchronization of code and drawing sessions in shared rooms.

---

## Features

- **Real-time Code Editor**
  - Multiple users can edit the same code simultaneously.
  - Changes are broadcasted live to all participants in the room.
  - Code synchronization ensures that new users receive the latest code on joining.

- **Collaborative Whiteboard**
  - Draw, sketch, and annotate in real-time.
  - Each room has its own persistent whiteboard state stored in memory.
  - Updates are broadcasted to all connected users instantly.

- **Rooms**
  - Users join a room by `roomId`.
  - Both code editor and whiteboard sync within the same room.
  - Users see connected participants in real-time.

- **Frontend**
  - Built with **React**.
  - Responsive UI compatible with desktop screens.
  - CSS styling for a clean and user-friendly interface.

- **Backend**
  - Built with **Node.js** and **Express**.
  - Serves React build and handles **Socket.IO** connections.
  - In-memory storage for whiteboard data (`canvasMap`).
  - Tracks connected users per room.

---

## Tech Stack

- **Frontend:** React, CSS  
- **Backend:** Node.js, Express, Socket.IO  
- **Real-time Communication:** Socket.IO  
- **Deployment:** Render  

---

## Installation / Running Locally

1. Clone the repository:

```bash
git clone https://github.com/Ridhima-Sapra/code-editor.git
cd code-editor
2. Install dependencies:

bash
Copy code
npm install
cd realtime-code-editor-main
npm install
3. Build React app:

bash
Copy code
npm run build
4. Start the server:

bash
Copy code
npm start
5. Open your browser at http://localhost:5000.

Usage
Enter a room ID and your username to join a session.

Collaborate on the code editor:

Changes appear in real-time to all participants.

Use the whiteboard for drawing or annotations:

Whiteboard content is synced across all users in the room.

Participants joining later will receive the latest code and whiteboard state.

Project Structure
bash
Copy code
/server.js          - Main backend server
/src                - React frontend source code
/src/components     - Reusable components (Editor, CollaborativeBoard, etc.)
/build              - Production React build
/package.json       - Project dependencies and scripts
Deployment
Hosted on Render.

Simply pushing updates to GitHub triggers an automatic rebuild and deployment.

Server serves React build on the same port as Socket.IO, making deployment simple and conflict-free.

Notes
Currently, whiteboard state is stored in memory (canvasMap). Restarting the server will reset it.

Socket.IO handles both code editor and whiteboard events in the same room.

Some React warnings about useEffect dependencies exist; these do not affect functionality.

Future Improvements
Persist whiteboard data to a database (e.g., MongoDB) to prevent loss on server restart.

Add authentication for secure rooms.

Add multiple language support for the code editor.

Improve UI/UX for mobile devices.
