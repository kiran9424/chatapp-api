module.exports = (io)=>{
    io.on('connection',(socket)=>{
       socket.on('refresh',(data)=>{
           io.emit('refreshPage',{})
       })
        
    })
}