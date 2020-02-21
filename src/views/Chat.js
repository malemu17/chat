import React, { useState, useEffect, useCallback } from "react";
import useSockets from "../utils/useSockets";
import { useAuth0 } from "../react-auth0-spa.js";


//emoji set up

import "emoji-mart/css/emoji-mart.css";
import { Picker } from 'emoji-mart';




  



function Chat() {
  const [name, setName] = useState(null);
  const [welcome, setWelcome] = useState("Welcome!");
  const [message, setMessage] = useState(null);
  
  const [showEmojis, setShowEmojis] = useState(false);
  
  
 
  
  
  

  
  
  
  const [language, setLanguage] = useState("English");
  const [translation, setTranslation] = useState("en");
  const [groupMessage, setGroupMessage] = useState(null);
  const { socket, socketVal, isConnected } = useSockets(
    "https://jamesdunn-lab23.herokuapp.com/",
    "broadcast"
  );
  const { user } = useAuth0();

  const getLanguage = useCallback (
      async () => {
      let res = await fetch('https://translation-server.herokuapp.com/detect?language=' + language);
      let json = await res.text();
      setTranslation(json);
  }, [language]);

  const translateMessage = useCallback(
      async data => {
      let res = await fetch('https://translation-server.herokuapp.com/translate?message=' + data.message + '&translation=' + data.translation);
      let json = await res.text();
      socketVal.message = await json;
      setGroupMessage(`${socketVal.name}:  ${socketVal.message}`);
  }, [socketVal.message, socketVal.name]);

  const handleEnter = e => {
    if (e.key === "Enter") {
      setShowEmojis(false)
      sendMessage(e);
    }
  };
//helper 
  // function showEmoji(){
  //   setShowEmojis({showEmojis:true})
  //     document.addEventListener("click", closeMenu)
  //   }
  


  // setShowEmoji(e=> {
  //   setShowEmojis(
  //     {
  //       showEmojis: true
  //     },
  //      document.addEventListener("click", closeMenu)
  //   );
  // });
     
  let  addEmoji = e => {
     console.log(e.native);
     setMessage(e.native);
     let emoji = e.native;
     setShowEmojis({
       text: showEmojis + emoji
     });
   };
 
 
   let closeMenu = e  => {
     //console.log('come on here', e.emojiPicker);
     if (setShowEmojis.emojiPicker !== null && !setShowEmojis.emojiPicker.contains(e.target)) {
       setShowEmojis(
         {
           showEmojis: false
         },
         () => document.removeEventListener("click", closeMenu)
       );
     }
   };
 
 
  
 
 
   const sendMessage = e => {
     e.preventDefault();
     if (message) {
       socket.emit("message", { name, message });
     }
     setMessage('');
   };
 
   useEffect(() => {
     setName(user.nickname);
     setWelcome(`Hi ${name}! Welcome to the Chat!`)
     
   }, [name, user.nickname]);
 
   useEffect(() => {
     getLanguage();
   }, [getLanguage, language])
 
   useEffect(() => {
       if (socketVal.name && socketVal.message) {
           (async () => {
         await translateMessage({message: socketVal.message, translation});
           })();
         
         }
   }, [socketVal, translateMessage, translation]);
 
   return (
     <div className="Chat">
       <h1 className="chat-heading">{welcome}</h1>
       <h3>
         {isConnected
           ? "You are connected to the chat"
           : "You are not connected to the chat"}
       </h3>
       <div>
         <select onChange={e => {
             setLanguage(e.target.value);
         }}>
           <option>Select Language</option>
           <option>English</option>
           <option>Espanol</option>
           <option>አማርኛ</option>
           <option>русский</option>
           <option>日本語</option>
         </select>
       </div>
       <div className="chat-section">
       <button className="chat-button" onClick={sendMessage}>
           Send Message
         </button>
        
         <input
 
           type="text"
           className="chat-input"
           value={message}
           onKeyUp={handleEnter}
           onChange={e => {
             setMessage(e.target.value);
            
           }}
          
         
         />

      
 
 {showEmojis ? (<span style={styles.emojiPicker}  ref={el => setShowEmojis.emojiPicker = el}>
 
 
       <Picker  
              onSelect={addEmoji}
              emojiTooltip={true}
              title="weChat"
            
              />
 
     </span>) : (
       <p style={styles.getEmojiButton}  onClick={setShowEmojis}>
           {String.fromCodePoint(0x1f60a)}
           </p>
         )}
      
         <p className="chat-output">{groupMessage}</p>
       </div>
       
     </div>
   );
 }
       
 export default Chat;
 

    //style={styles.emojiPicker} span

         //p style={styles.getEmojiButton}
 const styles ={
 
  emojiPicker: {
     position: "absolute",
     bottom: 10,
     right: 0,
     cssFloat: "right",
     marginLeft: "200px"
  },
  getEmojiButton: {
   cssFloat: "right",
   border: "none",
   margin: 0,
   cursor: "pointer"
 },
 }
  




  
  
   



  
 
 

  




      



          
     







     



      


         
      

