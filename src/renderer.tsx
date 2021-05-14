import 'react-hot-loader'
import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import './debug.css';
import 'bulma/css/bulma.min.css';
// import '@fortawesome/fontawesome-free/js/brands'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/fontawesome'
import Editor from './editor/editor';

ReactDOM.render(<Editor />, document.getElementById('root'));