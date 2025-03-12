const LANGUAGES = {
    "Acehnese (Arabic script)": "ace_Arab",
    "Acehnese (Latin script)": "ace_Latn",
    "Afrikaans": "afr_Latn",
    //...
    "English" : "eng_Latn",
    "French" : "fra_Latn",
    "Zulu": "zul_Latn",
  }
  
  const LanguageSelector = ({ type, onChange, defaultLanguage }) => {
    return (
      <div className='language-selector'>
        <label>{type}: </label>
        <select onChange={onChange} defaultValue={defaultLanguage}>
          {Object.entries(LANGUAGES).map(([key, value]) => {
            return <option key={key} value={value}>{key}</option>
          })}
        </select>
      </div>
    )
  }

  export default LanguageSelector