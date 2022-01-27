import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import MessageItem from '../MessageItem'
import './styles.css'
import {FiMoreVertical} from 'react-icons/fi'
import {AiOutlineSearch} from 'react-icons/ai'
import {IoMdAttach, IoMdSend} from 'react-icons/io'
import {BsEmojiSmile} from 'react-icons/bs'
import {useAuth} from '../../context/useAuth';
import defaultImaguser from '../../assets/defaultUser.png'

type emojiObject = {
  emoji: any;
}



type props = {
  data:{
    image: string,
    avatar: string,
    chatId: string,
    lastMessage:  string,
    lastMessageDate: any,
    title:  string,
  },

  user?:{
    id: string,
    name: string,
    avatar: string,
  }
}


export default function ChatWindow(props: props) {
  const body = React.useRef<any>() //HTMLDivElement
  const auth = useAuth()
  const [emojiOpen, setEmojiOpen] = React.useState<boolean> (false)
  const [text, setText] = React.useState<string>('')

  React.useEffect(()=>{
    if(body.current.scrollHeight < body.current.offsetHeight){
      body.current.scrollTop  = (body.current.scrollHeight - body.current.offsetHeight)
    }
    console.log("chat windown : ",props.data)
  },[])

  React.useEffect(()=>{
    const constraintLayout = async () => {
      await auth.onChatContent(props.data.chatId)
    }

    constraintLayout()
  },[props.data.chatId])

  const handleEmojiPicker = (e: any, emojiObject: emojiObject) => {
    //console.log(emojiObject.emoji)
    setText(text+emojiObject.emoji)
  }

  const handleInputKeyUp = (e: any) => {
    if(e.keyCode === 13){
      hendleSendMessage()
    }
  }

  const hendleSendMessage = () => {
    if(text !== ''){
      auth.sendMessage(text, "text", props.data.chatId, auth.users)
    }
    setText('')
    setEmojiOpen(false)
  }

  return (
    <React.Fragment>
      <div className="chat-window">
        <div className="chat-window-header">
          <div className="chat-window-header-info">
            <img className="chat-window-header-avatar" src={props.data.image ? props.data.image : defaultImaguser} alt=""/>
            <div className="chat-window-header-name">
              {props.data.title}
            </div>
          </div>

          <div className="chat-window-header-buttons">
            <div className="chat-window-btn">
              <AiOutlineSearch size={24} color="#919191"/>
            </div>
            <div className="chat-window-btn">
              <IoMdAttach size={24} color="#919191"/>
            </div>
            <div className="chat-window-btn">
              <FiMoreVertical size={24} color="#919191"/>
            </div>
            
          </div>
        </div>
        <div ref={body} className="chat-window-body" >
          {
            auth.chatMessages.map((element, index) => 
              <MessageItem user={props.user} key={index} data={element}/>
            )
          }
          
        </div>

        {
          emojiOpen && (
            <div className="emoji-picker-react">
              <EmojiPicker onEmojiClick={handleEmojiPicker}/>
            </div>
          )
        }

        <div className="chat-window-footer">
          <div className="chat-window-pre">
            <div className="chat-window-btn">
              <BsEmojiSmile onClick={()=>setEmojiOpen(!emojiOpen)} size={24} color={emojiOpen ? "#009688" : "#919191" } /> 
            </div>
          </div>

          <div className="chat-window-footer-input">
            <input onKeyUp={handleInputKeyUp} value={text} onChange={(e: any)=>setText(e.target.value)} type="text" placeholder="digite uma mensagem" className="chat-window-input" />
          </div>

          {
            text !== '' ? (
              <div className="chat-window-pos">
                <div className="chat-window-btn">
                  <IoMdSend onClick={()=>hendleSendMessage()} size={24} color="#009688" />
                </div>
              </div>
            ) : (
              <div className="chat-window-pos">
                <div className="chat-window-btn">
                  <IoMdSend size={24} color="#919191"/>
                </div>
              </div>
            )
          }

          
        </div>
      </div>
    </React.Fragment>
  );
}
