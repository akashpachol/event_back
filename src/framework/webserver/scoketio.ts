import { Server } from "socket.io";

const userSocketMap: { [key: string]: string } = {};


const socketConfig = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId as string;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    socket.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("user joined room : ", room);
    });

    socket.on("new message", (message, id) => {
      socket.to(id).emit("receiveMsg", message);
    });

    socket.on("seen", (message, id) => {

      socket.to(id).emit("responseSeen", message);
    });

    socket.on("deleteEveryOne", (messageId, id) => {
      console.log(messageId, "message", id);

      socket.to(id).emit("responsedeleteEveryOne", messageId);
    });

    socket.on("deleteMe", (messageId, id) => {
      socket.to(id).emit("responsedeleteMe", messageId);
    });


	socket.on("notification", (data) => {
		console.log('hello',data);
  

		socket.to(userSocketMap[data]).emit("responseNotification",data);
	  });


    socket.on("videoCallRequest", (data: any) => {
      const emitdata = {
        roomId: data.roomId,
        senderName:data.senderName,
        senderProfile:data.senderProfile
      };
      console.log("videoCallResponse",emitdata)
      console.log("receiverid", data);
   
    console.log(userSocketMap[data.receiverId],'kkkkkkkkkkkkks');
    
   
      socket.to(userSocketMap[data.receiverId]).emit("videoCallResponse", emitdata);
      
    });

      socket.on('cancel-call', ({ receiverId }) => {
    io.to(userSocketMap[receiverId]).emit('call-cancelled');
  });






 



    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      delete userSocketMap[userId];
      socket.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

export default socketConfig;
