import React, { useState, useEffect } from 'react';
import './style.css';
import SvgPartie1 from './SvgPartie1';
import SvgPartie2 from './SvgPartie2';


function App() {
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState('18');
  const [font, setFont] = useState('Helvetica');
  const [imageUrl, setImageUrl] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => { // pour générer une bannière par défaut
    document.querySelector('.custom-input').value = "This is your banderole";
    updateBanner();
  }, []); 

  function updateBanner(e) {
    const text = document.querySelector('.custom-input').value;
    let selectedTextColor = e && e.target.className === 'text-color-picker' ? e.target.value : textColor;
    let selectedBgColor = e && e.target.className === 'bg-color-picker' ? e.target.value : backgroundColor;
    let selectedFontSize = fontSize;
    let selectedFont = font;

    let strippedTextColor = selectedTextColor.replace("#", "");
    let strippedBgColor = selectedBgColor.replace("#", "");

    
    if (e) { // Ajoutez cette vérification
      switch(e.target.className) {
        case 'text-color-picker':
          selectedTextColor = e.target.value;
          break;
        case 'bg-color-picker':
          selectedBgColor = e.target.value;
          break;
        case 'font-size-picker':
          selectedFontSize = e.target.value;
          break;
        case 'font-picker':
          selectedFont = e.target.value;
          break;
      }
    }

    setHasInteracted(true);
  
     fetch(`https://banderole-old.vercel.app/generate-banner?text=${text}&textColor=${strippedTextColor}&bgColor=${strippedBgColor}&font=${selectedFont}&fontSize=${selectedFontSize}`)
    //fetch(`http://localhost:3001/generate-banner?text=${text}&textColor=${strippedTextColor}&bgColor=${strippedBgColor}&font=${selectedFont}&fontSize=${selectedFontSize}`)
 // for local only


.then(response => response.blob())
.then(blob => {

  const blobUrl = URL.createObjectURL(blob); //test
   const img = document.createElement('img');//test
   img.src = blobUrl;//test
   document.body.appendChild(img); //test

  console.log("Taille du blob: ", blob.size);  // Ajout du log pour vérifier la taille
  const url = URL.createObjectURL(blob);
  
  setImageUrl(url);
  console.log("Image URL:", imageUrl);
  });

  }

  return (
    <div className="container">
        <div className="website-banner">
          <p className="website-banner-text">No credit card or login required</p>
        </div>
      <div className="header">
        <div className="logo">banderole.design</div>
        <h1>Create your animated banderole now</h1>
      </div>


<div className="app-block">
      <div className="customization-panel">
        <h2>Customize it!</h2>
        <input type="text" className="custom-input" placeholder="type your text here"  onChange={updateBanner}/>
        <label>
          Background color
          <input type="color" className="bg-color-picker" value={backgroundColor} onChange={e => { 
            setBackgroundColor(e.target.value); 
            updateBanner(e); 
            }} />
        </label>
        <label>
          Text color
          <input type="color" className="text-color-picker" value={textColor} onChange={e => {setTextColor(e.target.value); updateBanner(e); }} />
        </label>
        <label>
        Size
        <select className="font-size-picker" value={fontSize} onChange={e => { setFontSize(e.target.value); updateBanner(e); }}>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="20">20</option>
          <option value="22">22</option>
        </select>
            </label>
            <label>
                Font
                <select className="font-picker" value={font} onChange={e => { setFont(e.target.value); updateBanner(e); }}>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Courier">Courier</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Times">Times</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                    <option value="Lucida Sans">Lucida Sans</option>
                    <option value="Impact">Impact</option>
                    </select>
                    </label>
                    
                    <a href={imageUrl} download="banner.gif" className={`download-btn ${!hasInteracted ? 'disabled-btn' : ''}`}>Download</a>
      </div>
      <div className="preview">
        <SvgPartie1 />
        <img id="banner-image" src={imageUrl} alt="Generated Banner" />
        <SvgPartie2 />
      </div>
    </div>
    <div className="footer">
      <p>Created by Nina for <a href="https://www.bote.agency/" target="_blank">Bote.agency</a></p>
    </div>
    </div>
  );
}

export default App;