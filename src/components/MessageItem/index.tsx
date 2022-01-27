import React from 'react';
import './styles.css'


export default function MessageItem(props:any) {

  const [time, setTime] = React.useState<any>()

  React.useEffect(()=>{
    const createLayout = () => {
      if(props.data.date > 0){
        let d = new Date(props.data.date*1000)
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
      <div className="message-line" style={{
        justifyContent: props.user.id === props.data.author ? "flex-end" : "flex-start"
      }}> 
        <div className={props.user.id === props.data.author ? 'message-item-my-message' : 'message-item-message'}>
          <div className="message-text">
            {props.data.body}
          </div>
          <div className="message-date">
            {time}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
