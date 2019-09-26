import { library } from '@fortawesome/fontawesome-svg-core';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faClone, faEdit, faExclamationTriangle, faFileAlt, faFileDownload, faFileExport, faFileImport, faKeyboard, faList, faPlusCircle, faTachometerAlt, faTimesCircle, faTrashAlt, faTrophy, faUserTag, faWifi, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap';
import * as React from "react";
import uuid = require("uuid");
import * as ReactDOM from "react-dom";
import Tellraw from "./components/Tellraw";
import { legacyStatePreparation } from "./helpers/loaders";
import './styles/styles.scss';
import Worker from "worker-loader!./workers/compiler.worker.js";

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

var worker = new Worker();

function w_compile(snippets: object): Promise<string> {
  const id = uuid()
  worker.postMessage({id, snippets})

  let promise = new Promise<string>((resolve, reject) => {
    worker.addEventListener('message', (event) => {
      if (event.data.id === id) {
        resolve(event.data.compiled)
      }
    })
  })

  return promise
}

w_compile([1,2,3]).then((compiled) => {
  console.log("Got compiled", compiled)
})

ReactDOM.render(
  <Tellraw />,
  document.getElementById("app")
);