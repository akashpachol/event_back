import { Server } from 'socket.io';
import { CreateUserInterface } from '../../entities/userinterfaces';



const userSocketMap: { [key: string]: string } = {};

export const getReceiverSocketId = (userId: string) => {
  console.log('recienver and his socket id are ', userId, userSocketMap[userId])
  return userSocketMap[userId]
}
const socketConfig = (io: Server) => {



  io.on('connection', (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId as string;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

  	// io.emit() is used to send events to all the connected clients
	  socket.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on('join chat', (room) => {
		socket.join(room);
		console.log('user joined room : ', room);
	});


	socket.on("new message", (message,id) => {
		
	console.log('fjgdfduiy',id);
	socket.to(id).emit('receiveMsg',message)
		
	});






	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		socket.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
 
  });
};

export default socketConfig;
