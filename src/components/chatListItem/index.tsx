import * as React from 'react';
import './style.css'
import defaultImaguser from '../../assets/defaultUser.png'

type props ={
  data: {
    image: string,
    avatar: string,
    chatId: string,
    lastMessage: string,
    lastMessageDate: any,
    title: string,
  },

  setActiveChat: (e: any) => void
}

const ChatListItem: any = (props: props) => {

  const [time, setTime] = React.useState<any>()

  React.useEffect(()=>{
    const createLayout = () => {
      if(props.data.lastMessageDate > 0){
        let d = new Date(props.data.lastMessageDate*1000)
        let hours = d.getHours()
        let str_hours = hours.toString()
        let min = d.getMinutes()
        let str_min = min.toString()
        if(hours < 10){
          str_hours = '0'+str_hours;
        }
        if(min < 10){
          str_min = '0'+str_min
        }
        setTime(`${str_hours}:${str_min}`)
      }
    }
    createLayout()
  },[props.data])
  console.log(props.data)

  return (
    <React.Fragment>
      <div onClick={()=>props.setActiveChat(props.data)} className="chat-list-item">
        <img src={props?.data.image ? props?.data.image : defaultImaguser} alt="" className="chat-list-item-avatar" />
        <div className="chat-list-item-lines">
          <div className="chat-list-item-line">
            <div className="chat-list-item-name">
              {props.data.title}
            </div>
            <div className="chat-list-item-date">
              {time}
            </div>
          </div>
          <div className="chat-list-item-line">
              <div className="chat-list-item-last-message">
                <p>{props.data.lastMessage ? props.data.lastMessage : ""}</p>
              </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ChatListItem