import { library } from '@fortawesome/fontawesome-svg-core';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faClone, faEdit, faExclamationTriangle, faFileAlt, faFileDownload, faFileExport, faFileImport, faKeyboard, faList, faPlusCircle, faTachometerAlt, faTimesCircle, faTrashAlt, faTrophy, faUserTag, faWifi, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap';
import * as React from "react";
import * as ReactDOM from "react-dom";
import Tellraw from "./components/Tellraw";
import { legacyStatePreparation } from "./helpers/loaders";
import './styles/styles.scss';

// Then we add the icons to the library object
library.add(
  faEdit,
  faPlusCircle,
  faCheckCircle,
  faTimesCircle,
  faKeyboard,
  faTrophy,
  faUserTag,
  faTrashAlt,
  faClone,
  faFileAlt,
  faFileImport,
  faFileExport,
  faExclamationTriangle,
  faList,
  faTwitter,
  faWifi,
  faFileDownload,
  faTachometerAlt
)

// load legacy!
// this includes ALL localStorage key transformations
// and should happen first
legacyStatePreparation()

// Increment load count
localStorage.setItem("loadCount", (1 + parseInt(localStorage.getItem("loadCount") || "0")).toString())

// Set initial load
if (localStorage.getItem("initialTimestamp") === null) {
  localStorage.setItem("initialTimestamp", new Date().getTime().toString());
}

if (localStorage.getItem("donateStatus") === null) {
  localStorage.setItem("donateStatus", "unprompted");
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/workers/compiler.worker.js')
    .then(function() {
      console.log("Service Worker Registered")      
    })
}

export function sw_compile(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    navigator.serviceWorker.controller.postMessage({ data, resolve, reject })
  })
    .then((value?: any) => {
      console.log("Compiled to", value)
    }, (error?: any) => {
      console.log("Compilation failed", error)
    })
}

ReactDOM.render(
  <Tellraw />,
  document.getElementById("app")
);