// src/ReactotronConfig.js
import Reactotron from 'reactotron-react-native';

Reactotron.configure({name: 'PowerPlay'})
  .useReactNative({
    asyncStorage: true,
    networking: {ignoreUrls: /symbolicate/},
    editor: false,
    overlay: false,
  })
  .connect();

console.tron = Reactotron;
