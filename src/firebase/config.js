import { getAuth } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

// Ensure Firebase App is initialized
const auth = getAuth(getApp());
export default auth;
