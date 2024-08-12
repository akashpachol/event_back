import { Server } from "socket.io";

const userSocketMap: { [key: string]: string } = {};


const socketConfig = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId as string;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
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


	socket.on("notification", (id) => {
		console.log(id,'hkglhlg');
		
		socket.to(userSocketMap[id]).emit("responseNotification",id);
	  });



    const offers:any = [

];




    socket.on("newOffer", (newOffer,id,reciver) => {
  
      offers.push({
        offerUserId: id,
        offer: newOffer,
        offerIceCandidates: [],
        answererUserName: null,
        answer: null,
        answererIceCandidates: [],
      });

        socket.to(userSocketMap[reciver._id]).emit("availableOffers", offers);

    });

    console.log(offers,'kkkkkkkkkkkkkkkk');
 
socket.on("sendIceCandidateToSignalingServer", (iceCandidateObj,id) => {
    const { didIOffer, iceUserId, iceCandidate } = iceCandidateObj;
    console.log('gjhgjfkgfkgj',offers);
    
  
   
    
    if (didIOffer) {
      
      const offerInOffers = offers.find(
        (o:any) => o.offerUserId === iceUserId
      );

      if (offerInOffers) {
        offerInOffers.offerIceCandidates.push(iceCandidate);

        if (offerInOffers.answererUserName && offerInOffers.answererUserName==iceUserId) {
            socket
              .to(id)
              .emit("receivedIceCandidateFromServer", iceCandidate);
        }
      }
    } else {

      const offerInOffers = offers.find(
        (o:any) => o.answererUserName === iceUserId
      );
   
      if (offerInOffers.offerUserId==iceUserId) {
        socket
          .to(id)
          .emit("receivedIceCandidateFromServer", iceCandidate);
      }
    }
  });


   socket.on("newAnswer", (offerObj,id, ackFunction) => {



    const socketToAnswer:string|undefined = Object.keys(userSocketMap).find(
      (s) => s === offerObj.offerUserId
    );


    if (!socketToAnswer) {
      console.log("No matching socket");
      return;
    }

    const socketIdToAnswer =userSocketMap[socketToAnswer];

    const offerToUpdate = offers.find(
      (o:any) => o.offerUserId === offerObj.offerUserId
    );
    console.log(offers,'damonnneee','jjjjj',offerToUpdate);

    if (!offerToUpdate) {
      return;
    }
console.log(offerToUpdate.offerIceCandidates,'hgdfdjgh');

    ackFunction(offerToUpdate.offerIceCandidates);
    offerToUpdate.answer = offerObj.answer;
    offerToUpdate.answererUserId=id;
    console.log(offerToUpdate,'offerToUpdatxzzzzzzzzzzzzzzzzzze');

    socket.to(socketIdToAnswer).emit("answerResponse", offerToUpdate);
  });


    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      delete userSocketMap[userId];
      socket.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

export default socketConfig;
