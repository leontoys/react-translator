//Note - this is web worker which will run separately from the main thread

//we are loading from npm transformer library
//in the previous object detection app we loaded from cdn
import { pipeline, TextStreamer  } from "@huggingface/transformers";

//to make sure that we are loading the model only once
//we use singleton pattern
class MyTranslationPipeline{
    static task = 'translation'
    static model = 'Xenova/nllb-200-distilled-600M'
    static instance = null

    //get instance
    static getInstance(progress_callback=null){
        this.instance ??= pipeline(this.task,this.model,{progress_callback})
        return this.instance
    }
}

//add event listener for click on translate and then App sends post message
self.addEventListener('message',async(event)=>{
    console.log(event.data)//this is the info that comes from App

    //load pipeline
    const translator = await MyTranslationPipeline.getInstance( (x)=>{
        self.postMessage(x)//this is a call back function to track model loading ??
    } )

    //stream output - stream will be used while translating - see below
    // it takes text translated and streams to App
    //via the call back function
    const streamer = new TextStreamer(translator.tokenizer,{
        skip_prompt : true,
        skip_special_tokens : true,
        callback_function : (text)=>{
            self.postMessage({
                status : 'update',
                output : text
            })
        }
    })

    //translate text
    const output = await translator(event.data.text,{
        tgt_lang : event.data.targetLanguage,
        src_lang : event.data.sourceLanguage,

        //stream partial output
        streamer
    })

    //once it completes, update App
    self.postMessage({
        status : 'complete',
        output
    })

})

