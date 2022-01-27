import React from 'react';
import { useAuth } from '../../context/useAuth'
import { useHistory} from 'react-router-dom'
import './styles.css';


export default function Login() {
  const auth = useAuth()
  const history = useHistory()
  React.useEffect(()=>{
    const createLayout = () => {
      if(localStorage.getItem("wpp-user")){
        history.push("/app")
      }
    }
  },[])

  const handleLogin = async () =>{
    await auth.singInWithGoogle()
  }

  return (
    <React.Fragment>
      <div className="login">
        <div className="login-card">
          <img className="logo-login" src="https://logodownload.org/wp-content/uploads/2015/04/whatsapp-logo-1-1.png" alt="logo"/>
          <button type="button" onClick={()=>handleLogin()}>login com google</button>
        </div>
      </div>
    </React.Fragment>
  );
}
