const http=require('http')
const express= require('express')
const socketio=require('socket.io')
const path=require('path')
const Filter=require('bad-words')
const {generateMessages ,generateLocation}=require('./utils/messages')
const{ addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')

//call express library
const app= express()
// create server and pass app to it
const server=http.createServer(app)
// create socket and pass server to it
const io=socketio(server)


const port=3000

const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))
app.use(express.json())

//Rooms are a tool in socket.io servers for keeping track of groups of connected users.
/* 
socket.emit()       -> sends event to a specific client
io.emit()           -> sends event to all connected clients
socket.broadcast.emit() -> sends event to all except requester

But With Rooms:
socket.join(roomname)        -> create a room with a joined client 
io.to().emit()               -> sends event to all clients in a given room
socket.broadcast.to().emit() -> sends event to all clinsts in a given room except requester


*/


io.on('connection',(socket)=>{
    console.log('new clint sends request')
     

     // when user sends a new message
    socket.on('newmessage',(d,callback)=>{
        filter = new Filter();
        if(filter.isProfane(d)){
            return callback('sorry ,cliect! profanity is not allwed here , i cannot send this to chat room')
        }
         io.emit('message',generateMessages(d))
         callback('okay ,client i have recieved your event ')})

    // when user leaves chat room
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
        io.to(user.room).emit('message',generateMessages(`${user.username} has left`))
        io.to(user.room).emit('listUsers',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        }
    })
    // when user wants to share his location
    socket.on('shareLocation',(loc ,call)=>{
        io.emit('Locationmessage',generateLocation(`https://google.com/maps?q=${loc.lat},${loc.long}`))
        call('location is shared')
    })
    // server lisent to a join event

    socket.on('join',({username,room},callback)=>{
        //create a room with a user connected
      const{Error,user} = addUser({
            id:socket.id,
            username,
            room
        })
        if(Error){
          return callback(Error)

        }
        socket.join(user.room)
        socket.emit('message',generateMessages('welcom'))
        socket.broadcast.to(user.room).emit('message',generateMessages(` ${user.username} has joined ${user.room} Room !`))
        io.to(user.room).emit('listUsers',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()

        
    })
})


server.listen(port,()=>{
    console.log('Application is listening on port '+ port)
})












