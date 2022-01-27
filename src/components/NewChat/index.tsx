import React from 'react';
import { IoMdArrowBack } from 'react-icons/io'
import { useAuth } from '../../context/useAuth'
import './styles.css';


type user = {
  id: string,
  name: string,
  avatar: string,
}

export default function NewChat(props: any) { 
  const auth = useAuth();

  React.useEffect(()=>{
    const createLayout = async () => {
      await auth.getContacts()
    }
    createLayout()
  },[])

  const addNewChat = async (user: user) => {
    await auth.createNewChat(user)
    console.log(user)
  }
  
  return (
    <React.Fragment>
      <div className={props.showNewChat ? "new-chat-on-select" : "new-chat"}>
        <div className="new-chat-head">
          <div className="new-chtat-back-button">
            <IoMdArrowBack size={24} color="#fff" onClick={()=>props.hideNewChat(!props.showNewChat)} />
          </div>
          <div className="new-chat-head-title">
            nova conversa
          </div>
        </div>
        <div className="new-chat-list">
          {
            auth.contactList?.map((element, index) =>
              element.id !== auth.user?.id && (
                <div className="new-chat-on" key={index} onClick={()=> addNewChat(element)}>
                  <img src={element.avatar} alt="avatar" className="new-chat-avatar"/>
                  <div className="new-chat-item-name">
                    {element.name}
                  </div>
                </div>
              )
              
            )
          }
        </div>

      </div>
    </React.Fragment>
  );
}
