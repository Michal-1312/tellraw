import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Snippet } from "../classes/Snippets/SnippetTypes/Snippet";
import { LSKEY_COMMAND_STRING, LSKEY_SNIPPET_ARR, LSKEY_COMMAND_TYPE, VERSION } from "../constants";
import { CommandType, template_lookup } from "../data/templates";
import { compile } from "../helpers/compile";
import { loadV5State, legacyStatePreparation, mapV4Template, loadV4State } from "../helpers/loaders";
import { useLocalStorage, useLSSnippets } from "../helpers/useLocalStorage";
import CommandTemplatesController from "./CommandTemplatesController";
import Importing from "./Importing";
import Preview from "./Preview";
import SnippetCollection from "./SnippetCollection";
import { export_snippets } from "../helpers/export";

const Tellraw: React.FunctionComponent<{}> = () => {  
  let [snippets, setSnippets] = useLSSnippets(LSKEY_SNIPPET_ARR, [])
  let [commandType, setCommandType] = useLocalStorage(LSKEY_COMMAND_TYPE, CommandType.tellraw)
  let [command, setCommand] = useLocalStorage(LSKEY_COMMAND_STRING, template_lookup(commandType)[0])
  // let [compiled, setCompiled] = useLocalStorage("20190916-compiled-string", compile([], command))
  
  let [exporting, setExporting] = React.useState(false)

  let [importing, setImporting] = React.useState(false)
  let [importingString, setImportingString] = React.useState("")

  // function recompile(f_snippets: Array<Snippet> = null,
  //   f_command: string = null,
  //   f_type: CommandType = null) {

  //     if (f_snippets === null) f_snippets = snippets
  //     if (f_command === null) f_command = command
  //     if (f_type === null) f_type = commandType

  //     setCompiled(compile(f_snippets, f_command))
  //     console.log("State Snippets", snippets)
  // }

  function updateCustomCommand(event: any) {
    setCommand(event.target.value)
    // recompile(null, event.target.value)
  }

  function updateCommandType(type: CommandType) {
    setCommandType(type)
    const new_command = template_lookup(type)[0]
    setCommand(new_command)
    // recompile(null, new_command, type)
  }

  function startImporting() {
    setImporting(true)
    setImportingString("")
  }

  function finishImporting(success: boolean) {
    if (success) {
      const import_data = JSON.parse(importingString)

      const command = import_data["command"]
      setCommand(command)

      if (import_data["jformat"] === VERSION) {
        const type = import_data["jtemplate"]
        setCommandType(type)
      
        const snippets = loadV5State(import_data["jobject"] as Array<object>)
        setSnippets(snippets)

        // recompile(snippets, command, type)
      } else {
        const type = mapV4Template(import_data["jtemplate"])
        setCommandType(type)

        const snippets = loadV4State(import_data["jobject"])
        setSnippets(snippets)

        // recompile(snippets, command, type)
      }
    }

    setImporting(false)
  }

  if (importing) {
    return <Importing importingString={importingString} setImportingString={setImportingString} finishImporting={finishImporting} />
  }

  if (exporting) {
    return (
      <div className="container">
        <div className="row">
          <p className="mb-3">
            Click below to copy the exported command string. Store it in a safe place
            to import back onto the site in the future.
          </p>
          <div className="col-md-6 offset-md-3 light-well" style={{ textAlign: "center" }}>
          <textarea readOnly={true}
                    className="form-control"
                    onClick={(event) => {
                      event.currentTarget.select()
                    }}
                    value={ export_snippets(snippets, command, commandType) } />
            <br/><br/>
            <button className="btn btn-success" onClick={() => { setExporting(false) }}>Done</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="row mb-2">
        <div className="col">
          <h4>Tellraw Generator for Minecraft</h4>
        </div>
        <div className="col-6">
          <div className="btn-toolbar d-flex justify-content-end"
                role="toolbar"
                aria-label="Toolbar with button groups">
            <a className="btn btn-danger btn-sm"
              href="https://github.com/ezfe/tellraw/issues/new"
              target="_">
              <FontAwesomeIcon icon="exclamation-triangle" /> Report an Issue
            </a>
            <div className="btn-group ml-2">
              <button className="btn btn-secondary btn-sm dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false">
                <FontAwesomeIcon icon="list" />
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item" href="https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fwww.minecraftjson.com%2F&text=%2Ftellraw%20generator%20for%20minecraft&tw_p=tweetbutton&url=http%3A%2F%2Fwww.minecraftjson.com%2F&via=superezfe">
                  <FontAwesomeIcon icon={["fab", "twitter"]} /> Tweet
                </a>
                <a className="dropdown-item" href="https://status.minecraftjson.com">
                  <FontAwesomeIcon icon="wifi" /> Uptime
                </a>
                <a className="dropdown-item" href="https://github.com/ezfe/tellraw/archive/preview.zip">
                  <FontAwesomeIcon icon="file-download" /> Download Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-3">
          <span style={{ fontWeight: "bold" }}>Player and Command</span>
          <br />
          <span>Used to select and execute different players</span>
        </div>
        <div className="col">
          <input value={command}
                 onChange={updateCustomCommand}
                 type="text"
                 className="form-control" />
        </div>
      </div>

      <CommandTemplatesController commandType={commandType}
                                  updateCommandType={updateCommandType} />
      
      <SnippetCollection commandType={commandType}
                          snippets={snippets} 
                          updateSnippets={(snippets: Array<Snippet>) => {
                            setSnippets(snippets)
                            // recompile(snippets)
                          }}
                          deleteAll={() => {
                            setSnippets([])
                            setCommand(template_lookup(CommandType.tellraw)[0])
                            setCommandType(CommandType.tellraw)
                          }} />
      
      <br />
      <br />
      <div className="row mb-2">
        <div className="col-2">
          <span style={{}}>Command</span>
        </div>
        <div className="col">
          <textarea readOnly={true}
                    className="form-control"
                    onClick={(event) => {
                      event.currentTarget.select()
                    }}
                    value={compile(snippets, command)} />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-sm-2 offset-sm-2">
          <button className="btn btn-light btn-block"
                  onClick={startImporting}>
            <FontAwesomeIcon icon="file-import" /> Import
          </button>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-light btn-block"
                  onClick={() => { setExporting(true) }}>
            <FontAwesomeIcon icon="file-export" /> Export
          </button>
        </div>
      </div>

      <Preview snippets={snippets} commandType={commandType} />
    </div>
  )
}

export default Tellraw