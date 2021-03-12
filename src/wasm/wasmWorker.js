/* eslint-disable */

import wasm from './voymod.js';
import USSJJEngine from './mvamod.js'

class IAmPicardEngine {
    constructor(options) {
        this.options = JSON.stringify(message.data);
    }
    
    
    calculate(progressCallback, resultCallback) {
        resultCallback(calculate(this.options, progressCallback));
    }
}

export const voyageEngines = [
    {
        name: 'I Am Picard', 
        engine: IAmPicardEngine,
        packOptions: true
    },
    {
        name: 'USSJohnJay',
        engine: USSJJEngineCreator,
        packOptions: false
    }
];

self.addEventListener('message', message => {
    let engineDetails = voyageEngines[message.data.engine];
    let engine = new voyageEngines.engine();
    //console.log(engineDetails.obj);
    
    engine.calculate(progressResult => self.postMessage({ progressResult }), 
                     result => { 
                         self.postMessage({ result }); 
                         self.close(); 
                    });
});
