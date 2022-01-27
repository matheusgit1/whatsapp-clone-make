import { createContext, ReactNode } from 'react';
import { useState, useEffect } from 'react'
import { auth, firebase, firestore } from '../firebase'
import { useHistory } from 'react-router-dom'
import React from 'react';

type user = {
  id: string,
  name: string,
  avatar: string,
}

type AuthContextType = {
  contactList: Array<any> | undefined;
  user: user | undefined;
  chatList: Array<any>;
  chatMessages: Array<any>
  users: Array<any>
  getContacts: () => void;
  singInWithGoogle: () => Promise<void>;
  singUpWithGoogle: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  createNewChat: (other: user) => void;
  onChatList: () => void;
  onChatContent: (id: string) => void
  sendMessage: (message: string, type: any, chatId: string, users: Array<any>) => void
}

type AuthContextProvidersProps = {
  children: ReactNode,
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProvidersProps) {

  const history = useHistory()
  const [user, setUser] = useState<user | undefined>();
  const [contactList, setContactList] = React.useState<Array<any>>([])
  const [chatList, setChatList] = React.useState<Array<any>>([])
  const [chatMessages, setChatMessages] = React.useState<Array<any>>([])
  const [users, setUsers] = React.useState<Array<any>>([])
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user;
        if (!displayName || !photoURL) {
          throw new Error('Missing information in your google acounts');
        }

        setUser({
          id: uid, name: displayName, avatar: photoURL,
        })
      }
    })

    return () => {
      unsubscribe();
    }

  }, []);


  async function sendMessage(message: string, type: any, chatId: string, users: Array<any>){
    let now  = new Date()
    await firestore.collection('chats').doc(chatId).update({
      messages: firebase.firestore.FieldValue.arrayUnion({
          type: type,
          author: user?.id,
          body: message,
          date: now
      })
    })

    for(let i in users){
      let u = await firestore.collection('users').doc(users[i]).get()
      let uData = u.data()
      if(uData?.chats){
        let chats = [...uData.chats];
        for(let e in chats){
          if(chats[e].chatId === chatId){
            chats[e].lastMessage = message;
            chats[e].lastMessageDate = now;
          }
        }
        await firestore.collection('users').doc(users[i]).update({chats: chats})
      }
    }
  }

  async function onChatContent(chatId: string){
    await firestore.collection('chats').doc(chatId).onSnapshot(snapshot => {
      if(snapshot.exists){
        let data = snapshot.data()
        setChatMessages(data?.messages)
        setUsers(data?.users)
      }
    })
  }

  async function onChatList(){
    await firestore.collection('users').doc(user?.id).onSnapshot(snapshot => {
      if(snapshot.exists){
        let data = snapshot.data()
        if(data?.chats){
          let chats = [...data?.chats]
          chats.sort((a: any, b: any) => {
            if(a.lastMessageDate === undefined){
              return -1;
            }
            else if(b.lastMessageDate === undefined){
              return -1;
            }
            else if(a.lastMessageDate.seconds < b.lastMessageDate.seconds){
              return 1;
            }
            else{
              return -1;
            }
          })
          setChatList(chats)
        }
      }
    })
  }

  async function singInWithGoogle() {

    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await auth.signInWithPopup(provider)
    //result.then(result=>{
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;
      if (!displayName || !photoURL) {
        throw new Error('Missing information in your google acounts');
      }

      setUser({
        id: uid, name: displayName, avatar: photoURL,
      })

      history.push("/app")
      localStorage.setItem("wpp-user",JSON.stringify(user))
      await createUser()
      await getContacts()
    }
  }

  async function createUser(){
    await firestore.collection("users").doc(`${user?.id}`).set({
      name: user?.name,
      avatar: user?.avatar,
      id: user?.id,
    },{merge: true})
  }

  async function getContacts(){
    const list = await firestore.collection('users').get()
    setContactList([])
    list.forEach(snapshot => {
      setContactList(contactList => [...contactList, snapshot.data()]);
    })
  }

  async function createNewChat(other: user){
    const newChat = await firestore.collection('chats').add({
      messages: [],
      users: [user?.id, other.id]
    })

    await firestore.collection('users').doc(user?.id).update({chats: firebase.firestore.FieldValue.arrayUnion({
      chatId: newChat.id,
      title: other.name,
      image: other.avatar,
      with: other.id
    })})

    await firestore.collection('users').doc(other?.id).update({chats: firebase.firestore.FieldValue.arrayUnion({
      chatId: newChat.id,
      title: user?.name,
      image: user?.avatar,
      with: user?.id
    })})
  }

  async function singUpWithGoogle(email: string, password: string){
    await auth.createUserWithEmailAndPassword(email, password)
    .then((values)=>{
      console.log(values)
      alert("conta criada")
      history.push("/")
     
    })
    .catch((error)=>{
      alert("error ao criar uma contap")
      console.log(error)
      
    })
  }

  async function logOut(){
    
    await auth.signOut()
    localStorage.removeItem("wpp-user")
  }

  return (
    <AuthContext.Provider
      value={{
        users,
        contactList,
        user,
        chatList,
        chatMessages,
        getContacts,
        createNewChat,
        singInWithGoogle,
        singUpWithGoogle,
        logOut,
        onChatList,
        onChatContent,
        sendMessage,
     }}
    >
      {props.children}
    </AuthContext.Provider>

  );
}