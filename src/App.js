import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import './App.css';


export default function App() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={client}>
      <div className="App">
        <ChatBot />
      </div>
    </QueryClientProvider>
  );
}

const ChatBot = () => {

  const [started, setStarted] = useState(false);
  const [info, setInfo] = useState("");
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");

  const encodedParams = new URLSearchParams();
  encodedParams.append("in", msg);
  encodedParams.append("op", "in");
  encodedParams.append("cbot", "1");
  encodedParams.append("SessionID", "RapidAPI1");
  encodedParams.append("cbid", "1");
  encodedParams.append("key", "RHMN5hn___________________");
  encodedParams.append("ChatSource", "RapidAPI");
  encodedParams.append("duration", "1");

  const options = {
    method: 'POST',
    url: 'https://robomatic-ai.p.rapidapi.com/api',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '7990c025__________________________',
      'X-RapidAPI-Host': 'robomatic-ai.p.rapidapi.com'
    },
    data: encodedParams,
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setStarted(true);
    setMsg(info);
    setInfo("");
  };

  const fetchData = () => {
    return axios.request(options).then((res)=> res.data)
  }

  const { data,  isInitialLoading, isError, error} = useQuery({
      queryKey: [msg],
      queryFn: fetchData,
      enabled: true
    })

  useEffect(()=>{
    if(!started){
      setReply("Hi! Want to chat with me?")
    }else if(data){
      setReply(data.out)
    }else if(isError){
      setReply(`Sorry there was an Error: ${error.message}`)
    }else if(isInitialLoading){
      setReply("Typing....")
      const interval = setInterval(()=>{
        if(!data){
          setReply("Sorry, I'm trying to understand what you just said...")
        }
      }, 8000)
      return () => clearInterval(interval);
    }
  },[data, isError, error, isInitialLoading, started]);

  return (
    <div className="flex flex-col text-center mt-32">
      <h1 className="font-sans font-semibold text-7xl text-white">ChatBOT</h1>
      <form onSubmit={submitHandler} className="mt-12 flex flex-col items-center">
        <input className="text-center w-[80%] rounded-full py-3 text-2xl border border-[#bdc1c6] outline-0 bg-[#202124] hover:bg-[#303134] text-[#bdc1c6] font-semibold" onChange={(e)=>setInfo(e.target.value)} type="text" value={info} placeholder="Say Something..." />
        <button className="my-12 py-4 px-16 border-0 rounded-lg text-[#e8eaed] font-bold bg-[#303134] hover:bg-blue-600 active:bg-blue-800">Chat</button>
        <h2 className="text-[#bdc1c6] text-2xl">Bot:</h2>
        <div className="py-8 w-[60%] font-bold text-2xl rounded-2xl text-[#bdc1c6]">{reply}</div>
      </form>
    </div>

  )
}