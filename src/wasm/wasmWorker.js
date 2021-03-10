/* eslint-disable */

import wasm from './voymod.js';
//import USSJJEngine from './mvamod.js'

export const voyageEngines = [
    {
        name: 'I Am Picard', 
        obj: wasm,
        packOptions: true
    },
    {
        name: 'USSJohnJay',
        obj: USSJJEngine,
        packOptions: false
    }
];

self.addEventListener('message', message => {
    let engineDetails = voyageEngines[message.data.engine];
    engineDetails.obj().then(mod => {
        let result = mod.calculate(engineDetails.packOptions ? JSON.stringify(message.data) : message.data, progressResult => {
            self.postMessage({ progressResult });
        });

        self.postMessage({ result });

        // close this worker
        self.close();
    });
});
