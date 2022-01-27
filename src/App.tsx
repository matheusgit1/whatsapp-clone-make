import * as React from 'react';
import "./App.css"
import {BsFillChatLeftTextFill} from 'react-icons/bs'
import {FiMoreVertical} from 'react-icons/fi'
import {MdDonutLarge} from 'react-icons/md'
import {AiOutlineSearch} from 'react-icons/ai'
import {useAuth} from './context/useAuth'
import {useHistory} from 'react-router-dom'
import ChatListItem from './components/chatListItem';
import ChatIntro from './components/chatIntro';
import ChatWindow from './components/chatWindow';
import NewChat from './components/NewChat';



type user = {
  id: string,
  name: string,
  avatar: string,
}

type chatListItem = {
  image: string,
  avatar: string,
  chatId: string,
  lastMessage: string,
  lastMessageDate: any,
  title: string,
}

type activyChat = {
  chatId: string,
  image: string,
  avatar: string,
  lastMessage: string,
  lastMessageDate: any,
  title: string,
  with: string,
}

function App() {

  const auth = useAuth();
  const history = useHistory();
  
  const [activeChat, setActiveChat] = React.useState<activyChat | undefined>()
  const [user, setUser] = React.useState<user | undefined>(auth.user)
  const [showNewChat, setShowNewChat] = React.useState<boolean>(false)

  React.useEffect(()=>{
    if(!auth.user){
      history.push("/")
    }

    const constraintLayout = async () => {
      await auth.onChatList()
    }

    constraintLayout()
  },[])

  console.log("activeChat    ",activeChat)

  return (
    <React.Fragment>
      <div className="app-window">
        <div className="sidebar">
          <NewChat showNewChat={showNewChat} hideNewChat={()=>setShowNewChat(!showNewChat)} />
          <header>
            <img className="header-avatar" src={auth.user?.avatar} alt="user" />
            <div className="header-buttons">
              <div className="header-btn">
                <MdDonutLarge style={{ color: "#919191" }} />
              </div>
              <div className="header-btn">
                <BsFillChatLeftTextFill onClick={()=>setShowNewChat(!showNewChat)} style={{ color: "#919191" }} />
              </div>
              <div className="header-btn">
                <FiMoreVertical style={{ color: "#919191" }} />
              </div>
            </div>
          </header>
          <div className="search">
            <div className="search-input">
              <AiOutlineSearch size={24}/>
              <input type="search" placeholder='procurar ou começar nova conversa'/>
            </div>
          </div>
          <div className="chat-list">
            {
              auth.chatList.map((element: chatListItem, index) =>
                <ChatListItem key={index} data={element} setActiveChat={(e: any)=>setActiveChat(e)}/>
              )
            }
          </div>
        </div>
        <div className="content-area">
          {
            activeChat?.chatId !== undefined && (
              <ChatWindow user={user} data={activeChat}/>
            )
          }
          {
            activeChat?.chatId === undefined && (
              <ChatIntro/>
            )
          }
            
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
