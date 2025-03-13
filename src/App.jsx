//added more hooks
import { useState, useRef, useEffect } from 'react'
import './App.css'
import LanguageSelector from './components/LanguageSelector'
import Progress from './components/Progress'

function App() {
  //for worker object - create reference
  const worker = useRef(null)
  //model loading - progress indicators
  const [ready, setReady] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [progressItems, setProgressItems] = useState([])

  //translation default languages and inputs
  const [input, setInput] = useState('This is a demo')
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn')
  const [targetLanguage, setTargetLanguage] = useState('fra_Latn')
  const [output, setOutput] = useState('')

  //console.log("progress-items",progressItems)

  //as soon as App is mounted, get worker
  useEffect(() => {

    //create worker if doesn't exist
    worker.current ??= new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module'
    })

    //call back for message received
    const onMessageReceived = (e) => {
      console.log("event", e.data)
      //TODO
      switch (e.data.status) {//based on the status update from worker
        case 'initiate':
          //model file starts loading
          setReady(false)
          setProgressItems(prev => [...prev, e.data])//keep appending the files info
          break;

        //update progress percentages
        case 'progress':
          setProgressItems(prev => prev.map(item => {
            if (item.file === e.data.file) {
              return { ...item, progress: e.data.progress }//update progress
            }
            return item
          }))
          break;


        //once all files are loaded, remove the pgoress indicators
        case 'done':
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file))
          break;

        //pipeline is ready
        case 'ready':
          setReady(true)
          break;

        //case update
        case 'update':
          //from the streamer, keep updating output
          setOutput(output + e.data.output)
          break;


        case 'complete':
          //enable button
          setDisabled(false)
          break;
      }
    }

    //link call back to event
    worker.current.addEventListener('message', onMessageReceived)

    //clean up when component is unmounted
    return () => worker.current.removeEventListener('message', onMessageReceived)

  })

  //call worker to translate
  const translate = () => {
    //disable button to avoid multiple clicks
    setDisabled(true)
    //clear output
    setOutput("")
    //call worker
    worker.current.postMessage({
      text: input,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage
    })
  }

  return (
    <div className="card">

      <h1>Translate Text</h1>

      <div className='container'>

        <div className='language-container'>
          <LanguageSelector type={"Source"} defaultLanguage={"eng_Latn"}
            onChange={e => setSourceLanguage(e.target.value)}
          ></LanguageSelector>
          <LanguageSelector type={"Target"} defaultLanguage={"fra_Latn"}
          ></LanguageSelector>
        </div>

        <div className='textbox-container'>
          <textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea>
          <textarea value={output} rows={3} readOnly></textarea>
        </div>

      </div>

      <button disabled={disabled} onClick={translate}>Translate</button>

      {/* Progress Indicators - for model loading  */}
      <div className='progress-bars-container'>
        {ready === false && (
          <label>Loading models... (only run once)</label>
        )}
        {progressItems.map(data => (
          <div key={data.file}>
            <Progress text={data.file} percentage={data.progress} />
          </div>
        ))}
      </div>

      <p>powered by Transformers.js</p>

    </div>
  )
}

export default App
