import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import Popup from './Popup'


ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
)
