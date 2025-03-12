//list of languages
const LANGUAGES = {
    "Acehnese (Arabic script)": "ace_Arab",
    "Acehnese (Latin script)": "ace_Latn",
    "Afrikaans": "afr_Latn",
    //others
    "Zulu": "zul_Latn"
}

//returns a select control
const LanguageSelector = ({type,onChange,defaultLanguage})=>{
    return(
        <div className="language-selector">
            <label>{type}: </label>
            <select onChange={onChange} defaultValue={defaultLanguage}>
                {Object.entries(LANGUAGES).map(([key,value])=>{
                    return <option key={key} value={value}></option>
                })}
            </select>
        </div>
    )
}

export default LanguageSelector