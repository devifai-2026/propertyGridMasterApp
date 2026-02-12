import {AppRegistry, Platform} from 'react-native';
import App from './App';
import app from './app.json';
const appName = app.name;

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('root'),
  });
}
