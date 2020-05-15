let users=[]
const addUser=({id,username,room})=>{
    //clean data
            username=username.trim().toLowerCase()
            room=room.trim().toLowerCase()
    //validate data
           if(!username|| !room){
               return{
                   Error:'Username and Room are required'
               }
           }
    //check uniqueness of username in a room
    const isExisted =users.find((user)=>{
        return user.username===username &&user.room===room
    })   
    if(isExisted)  {
        return{
            Error:' this user is already in use !'
        }
    } 
    //Store user
     const user={id,username,room}
     users.push(user)
     return({user})

}

const removeUser=(id)=>{
    const index= users.findIndex((user)=>{
        return user.id===id
        
    })
   
    if(index!== -1){
       return users.splice(index,1)[0]
    }

}

const getUser=(id)=>{
    return users.find((user)=>{user.id===id})
}

const getUsersInRoom=(room)=>{
    return users.filter((user)=> user.room===room)


}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}



