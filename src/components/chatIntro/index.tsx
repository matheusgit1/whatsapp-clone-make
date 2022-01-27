import React from 'react';
import './styles.css'
import icon from '../../assets/wpp-initial-icon.png'
export default function ChatIntro() {
  return (
    <React.Fragment>
      <div className="chat-intro">
        <div className="box-icon">
          <img src={icon} alt="your messages"/>
        </div>
        
        <h1>Mantenha seu celular conectado</h1>
        <h2>
          O Whatsapp conect seu telefone para sincronizar suas mensasgens
          <br/>
          Para reduzir o uso de dados, conect seu aparelho ao wi-fi
        </h2>
      </div>
    </React.Fragment>
  );
}
