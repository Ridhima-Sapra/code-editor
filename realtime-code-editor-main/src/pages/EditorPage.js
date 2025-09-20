import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import CollaborativeBoard from "../components/CollaborativeBoard";

import { initSocket } from '../socket';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [activeTab, setActiveTab] = useState("editor"); // new state for tabs

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
  <div className="mainWrap">
    {/* Sidebar */}
    <div className="aside">
      <div className="asideInner">
        <div className="logo">
          <img className="logoImage" src="/code-sync.png" alt="logo" />
        </div>

        <h3>Connected</h3>
        <div className="clientsList">
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username} />
          ))}
        </div>

        {/* Tabs moved INSIDE sidebar */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab("editor")}
            className={activeTab === "editor" ? "activeTab" : ""}
          >
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab("whiteboard")}
            className={activeTab === "whiteboard" ? "activeTab" : ""}
          >
            Whiteboard
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
    </div>

    {/* Right Panel */}
    <div className="editorWrap">
      {activeTab === "editor" && (
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      )}
      {activeTab === "whiteboard" && (
        <CollaborativeBoard socket={socketRef.current} roomId={roomId} />
      )}
    </div>
  </div>
);

};

export default EditorPage;
// import React, { useState, useEffect, useRef } from "react";
// import Client from "../components/Client";
// import Editor from "../components/Editor";
// import CollaborativeBoard from "../components/CollaborativeBoard";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";

// import "../App.css"; // make sure CSS below is imported

// const EditorPage = ({ socketRef, clients, roomId, onCodeChange }) => {
//   const navigate = useNavigate();
//   const { roomId: urlRoomId } = useParams();
//   const [activeTab, setActiveTab] = useState("editor"); // default Code Editor

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(urlRoomId);
//       toast.success("Room ID copied!");
//     } catch (err) {
//       toast.error("Failed to copy Room ID");
//     }
//   };

//   const leaveRoom = () => {
//     navigate("/");
//   };

//   return (
//     <div className="mainWrap">
//       {/* Sidebar */}
//       <aside className="aside">
//         <div className="asideInner">
//           <h3 className="connectedTitle">Connected</h3>
//           <div className="clientsList">
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>

//           {/* Tabs for Editor / Whiteboard */}
//           <div className="tabButtons">
//             <button
//               className={`tabBtn ${activeTab === "editor" ? "activeTab" : ""}`}
//               onClick={() => setActiveTab("editor")}
//             >
//               Code Editor
//             </button>
//             <button
//               className={`tabBtn ${activeTab === "whiteboard" ? "activeTab" : ""}`}
//               onClick={() => setActiveTab("whiteboard")}
//             >
//               Whiteboard
//             </button>
//           </div>
//         </div>

//         {/* Bottom buttons */}
//         <div className="asideBottom">
//           <button className="btn copyBtn" onClick={copyRoomId}>
//             Copy ROOM ID
//           </button>
//           <button className="btn leaveBtn" onClick={leaveRoom}>
//             Leave
//           </button>
//         </div>
//       </aside>

//       {/* Main content area */}
//       <div className="editorWrap">
//         {activeTab === "editor" ? (
//           <Editor
//             socketRef={socketRef}
//             roomId={urlRoomId}
//             onCodeChange={onCodeChange}
//           />
//         ) : (
//           <CollaborativeBoard socket={socketRef.current} roomId={urlRoomId} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditorPage;
