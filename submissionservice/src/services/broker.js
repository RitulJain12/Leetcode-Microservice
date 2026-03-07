const amqplib=require('amqplib');

let channel,connection;

async function connect() {
    if(connection){
        return;
    }
 try{
  connection= await amqplib.connect(process.env.AMQPLIB);
  channel= await connection.createChannel();
  console.log("Connected to RabbitMQ");
 }
 catch(err){
    console.log(err);
 }

}

async function publishToQueue(queueName,message) {
    try{
        if(!channel) await connect();
        await channel.assertQueue(queueName,{durable:true});
        channel.sendToQueue(queueName,Buffer.from(message));
        console.log("Message sent to queue:",message);
    }
    catch(err){
        console.log(err);
    }
}


module.exports={
    connect,
    publishToQueue
}

