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

