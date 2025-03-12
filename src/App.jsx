//added more hooks
import { useState, useRef, useEffect } from 'react' 
import './App.css'

function App() {
  //for worker object - create reference
  const worker = useRef(null)

  //as soon as App is mounted, get worker
  useEffect(()=>{

    //create worker if doesn't exist
    worker.current ??= new Worker( new URL('./worker.js', import.meta.url ), {
      type : 'module'
    } )

    //call back for message received
    const onMessageReceived = (e)=>{
      //TODO
    }

    //link call back to event
    worker.current.addEventListener('message',onMessageReceived)

    //clean up when component is unmounted
    return ()=>worker.current.removeEventListener('message',onMessageReceived)

  }) 

  return (
      <div className="card">
      </div>
  )
}

export default App
