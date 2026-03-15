import { registerRootComponent } from 'expo';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import * as cdk from 'aws-cdk-lib';

import App from './App';
registerRootComponent(App);