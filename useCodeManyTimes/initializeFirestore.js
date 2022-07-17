import React, { useState, useEffect } from 'react';
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';

export const initializeFirestore = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCrThxivVSo-ICZRbrx5b29peEaX74j_5w",
        authDomain: "graduate-project-carrot.firebaseapp.com",
        projectId: "graduate-project-carrot",
        storageBucket: "graduate-project-carrot.appspot.com",
        messagingSenderId: "551700585027",
        appId: "1:551700585027:web:ba6f87bf32b698b65e12f6",
        measurementId: "G-Y32RRXQX0L"
    }
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}