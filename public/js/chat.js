const socket=io()

//elements
const $form=document.querySelector('#formm')
const $locationButton=document.querySelector('#location')
const $messages=document.querySelector('#mess')
const $sidebar=document.querySelector('#sidebar')

//Templets
const messageTemp=document.querySelector('#message-temp').innerHTML
const locationTemp=document.querySelector('#location-temp').innerHTML
const sidebarTemp=document.querySelector('#sidebar-template').innerHTML

//options:
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true })
 const autoScroll=()=>{
     //new message
     const $newMessage=$messages.lastElementChild
     
     
     // get hight of this message
     const $newMessageStyle=getComputedStyle($newMessage)
     const $newMessageMargin=parseInt($newMessageStyle.marginBottom)

     const $newMessageHight=$newMessage.offsetHeight + $newMessageMargin
     console.log($newMessageHight)

     //visible height

     const visibleHeight=$messages.offsetHeight 
     console.log(visibleHeight)

     const containerHeight=$messages.scrollHeight

     const scrolloffset= $messages.scrollTop+visibleHeight
     console.log(scrolloffset)

     if(containerHeight -$newMessageHight<=scrolloffset){
         $messages.scrollTop=$messages.scrollHeight
     }


 }


// when connection is open
socket.on('message',(mess)=>{

    const html= Mustache.render(messageTemp,{
        message:mess.text,
        time:moment(mess.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()

})


socket.on('Locationmessage',(location) =>{
    const a=Mustache.render(locationTemp,{
        link:location.url,
        time:moment(location.createdAt).format('h:mm a')
    })
    
    $messages.insertAdjacentHTML('beforeend',a)
    console.log(location)
    autoScroll()
   
})

$form.addEventListener('submit',(e)=>{
    e.preventDefault()
    console.log('submitted')
    let message=document.getElementById("data").value
    // console.log(message)
    socket.emit('newmessage',message,(ack)=>{
        console.log(ack)
    })
    
})

/* 1-The navigator object contains information about the browser like geolocation which is
Returns a Geolocation object that can be used to locate the user's position */

/* 2-Mustache is a logic-less template synta 
        Logic-less -> no if statements, else clauses, or for loops. Instead there are only tags
        used ti define html tamplaes and render them with javascript values
 */

$locationButton.addEventListener('click',()=>{
    $locationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported')
    }
    navigator.geolocation.getCurrentPosition((pos)=>{
        
        let loc={
            lat:pos.coords.latitude,
            long:pos.coords.longitude
           
        }
        socket.emit('shareLocation',loc,(ack)=>{
            console.log(ack)
            $locationButton.removeAttribute('disabled')
           

        })
        


    })
})
// when a client wants to connect to a room
socket.emit('join',{username,room},(error)=>{
    if(error){
         alert(error)
         location.href='/'
    }
})

socket.on('listUsers',({room,users})=>{
  const html=  Mustache.render(sidebarTemp,{
        room,
        users
    })
    $sidebar.innerHTML=html 
})


