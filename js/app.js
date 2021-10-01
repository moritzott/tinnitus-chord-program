const context = new AudioContext();


// function for '+/- 50 Hz' Buttons:
// depending on value: 1 Hz, 5 Hz etc., the Tinnitus test tone frequency will change the slider and the numberfield
async function changeFrequency(event){
    console.log('Enter changeFrequency() ...');
    const buttonInnerText = event.target.innerText; // now we get on example: '+50Hz', '-1Hz'
    //console.log(buttonInnerText, 'inner Text');
    
    // now we must cut off the last two characters ('Hz'):
    const frequencyChange = buttonInnerText.slice(0, -2); // all that is left is like '-1' or so...
    //console.log('slice:', frequencyChange);
    
    // now parse to integer:
    const valueChange = parseInt(frequencyChange);
    //console.log('parseInt:', valueChange)

    // now calc new frequency: new frequency = old frequency + valueChange
    const oldFrequency = document.getElementById('frequencyValue').value;
    const newFreqency = parseInt(oldFrequency) + valueChange;

    // now write newFrequency to range slider and numberfield:
    document.getElementById('frequencyValue').value = newFreqency;
    document.getElementById('frequencyValueNumberfield').value = newFreqency;
    
    // start sound, if sound is playing
    document.getElementById('playStopEvalToneButton').click();
    document.getElementById('playStopEvalToneButton').click();
}

// to clear possibly confusion: compare Tone with Octave below
function minusOctave(){
    const oldFrequency = document.getElementById('frequencyValue').value;
    const newFreqency = parseInt(oldFrequency) / 2;

    // only if set newFrequency if it is in possible range
    if (newFreqency >= 27){
        // now write newFrequency to range slider and numberfield:
        document.getElementById('frequencyValue').value = newFreqency;
        document.getElementById('frequencyValueNumberfield').value = newFreqency;
        // start sound, if sound is playing
        document.getElementById('playStopEvalToneButton').click();
        document.getElementById('playStopEvalToneButton').click();
    }

}

// to clear possibly confusion: compare Tone with Octave above
function plusOctave(){
    const oldFrequency = document.getElementById('frequencyValue').value;
    const newFreqency = parseInt(oldFrequency) * 2;
    
    // only if set newFrequency if it is in possible range
    if (newFreqency <= 4200) {
        // now write newFrequency to range slider and numberfield:
        document.getElementById('frequencyValue').value = newFreqency;
        document.getElementById('frequencyValueNumberfield').value = newFreqency;
        // start sound, if sound is playing
        document.getElementById('playStopEvalToneButton').click();
        document.getElementById('playStopEvalToneButton').click();
    }
}


function newEvalSliderInput(){
    const sliderValue = document.getElementById('frequencyValue').value;
    // write value to input text box above...
    document.getElementById('frequencyValueNumberfield').value = sliderValue;

    // autoplay new frequency:
    document.getElementById('playStopEvalToneButton').click();
    document.getElementById('playStopEvalToneButton').click();

}

function newEvalNumberfieldInput(){
    const numberfieldValue = document.getElementById('frequencyValueNumberfield').value;
    // Sonderfall noch einarbeiten: überprüfen, ob es sich um eine Nummer handelt und ob im erlaubten Bereich: dann umwandeln => Funktion
    document.getElementById('frequencyValue').value = numberfieldValue;
}


function openInfoModal(){
    document.getElementById('infoModal').style.display = 'block';
}

function closeInfoModal(){
    document.getElementById('infoModal').style.display = 'none';
}

function openMenuModal(){
    document.getElementById('menuModal').style.display = 'block';
}

function closeMenuModal(){
    document.getElementById('menuModal').style.display = 'none';
}

function openEvalModal(){
    document.getElementById('evalTinnitusModal').style.display = 'block';
}

function closeEvalModal(){
    document.getElementById('evalTinnitusModal').style.display = 'none';
}


// function to set a new tinnitus tone freq after closeing the evaluate-Menu:
function setNewTinnitusTone(){
    const newFreqency = document.getElementById('frequencyValue').value;

    // write the value to the frequencySetField:
    document.getElementById('frequencySetField').value = newFreqency;
    
    // finally close EvalModal:
    closeEvalModal();
}


function stopTinnitusTestTone(tone){
    console.log('Enter stopTinnitusTestTone()...');
    tone.frequency.value += 50;
    console.log(tone);
    // reduce gain to 0 at a first step (to prevent click sound when stopping the sound)

    tone.stop(context.currentTime);

    
    document.getElementById('playStopEvalToneButton').innerText = 'PLAY TONE';
    document.getElementById('playStopEvalToneButton').removeEventListener('click', stop);
    document.getElementById('playStopEvalToneButton').addEventListener('click', playTinnitusTestTone);

}




// play Tinnitus Test Tone to compare and find the right frequency of the tinnitus tone:
function playTinnitusTestTone(){
    console.log('Enter function playTinnitusTestTone()...');
    const chosenFrequency = document.getElementById('frequencyValue').value;
    
    // play Tone using the Web Audio API:
    
    const tinnitus = context.createOscillator();
    tinnitus.frequency.value = parseInt(chosenFrequency);
    tinnitus.type = 'sine';

    // create gain control:
    // das kam neu dazu
    const gainControl = context.createGain();
    gainControl.gain.setValueAtTime(1, context.currentTime);
    tinnitus.connect(gainControl);
    gainControl.connect(context.destination);

    // tinnitus.connect(context.destination);

    tinnitus.start();
   
    // change inner Text of Button to 'STOP' and add new functionality: 
    document.getElementById('playStopEvalToneButton').innerText = 'STOP';
    
    document.getElementById('playStopEvalToneButton').removeEventListener('click', playTinnitusTestTone);
    //document.getElementById('playStopEvalToneButton').addEventListener('keydown', stopTinnitusTestTone(tinnitus));
    document.getElementById('playStopEvalToneButton').addEventListener('click', function stopTinnitusTestTone(){
        // first reduce volume to 0:
        console.log('Enter function stopTinnitusTestTone');
        //gainControl.gain.setValueAtTime(1, context.currentTime+3);
        // gainControl.gain.setTargetAtTime(0, context.currentTime, 0.015);
        tinnitus.stop(context.currentTime);
        // gainControl.gain = 1;
        document.getElementById('playStopEvalToneButton').innerText = 'PLAY TONE';
        document.getElementById('playStopEvalToneButton').removeEventListener('click', stopTinnitusTestTone);
        document.getElementById('playStopEvalToneButton').addEventListener('click', playTinnitusTestTone);
    });      
}

function addHandlers(){
    console.log('Window loaded successfully...');
    console.info('Enter function addHandlers() ...');

    document.getElementById('infoProjectButton').addEventListener('click', openInfoModal);
    document.getElementById('confirmInfoButton').addEventListener('click', closeInfoModal);
    document.getElementById('confirmInfoButtonBottom').addEventListener('click', closeInfoModal);
    document.getElementById('openMenuButton').addEventListener('click', openMenuModal);
    document.getElementById('confirmMenuButton').addEventListener('click', closeMenuModal);
    document.getElementById('confirmMenuButtonBottom').addEventListener('click', closeMenuModal);
    document.getElementById('evaluateFrequencyMenuButton').addEventListener('click', openEvalModal);
    document.getElementById('closeEvalButton').addEventListener('click', closeEvalModal);
    document.getElementById('confirmEvalButtonBottom').addEventListener('click', setNewTinnitusTone);
    document.getElementById('frequencyValue').addEventListener('input', newEvalSliderInput);
    document.getElementById('frequencyValueNumberfield').addEventListener('input', newEvalNumberfieldInput);
    document.getElementById('playStopEvalToneButton').addEventListener('click', playTinnitusTestTone);;

    document.getElementById('minusOneOctave').addEventListener('click', minusOctave);
    document.getElementById('plusOneOctave').addEventListener('click', plusOctave);

    const changeFrequencyButtons = document.getElementsByClassName('changeTestTinnitusButtons');
    for (let i = 0; i < changeFrequencyButtons.length; i++){
        changeFrequencyButtons[i].addEventListener('click', changeFrequency);
        
    }
}


window.addEventListener('load', addHandlers);