import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { LSKEY_COMMAND_STRING, LSKEY_COMMAND_TYPE, LSKEY_SNIPPET_ARR, VERSION } from "../constants";
import { CommandType, template_lookup } from "../data/templates";
import { compile } from "../helpers/compile";
import { export_snippets } from "../helpers/export";
import { loadV4State, loadV5State, mapV4Template } from "../helpers/loaders";
import { useLocalStorage, useLSSnippets } from "../helpers/useLocalStorage";
import CommandTemplatesController from "./CommandTemplatesController";
import Importing from "./Importing";
import Preview from "./Preview";
import SnippetCollection from "./SnippetCollection";
import Button from "./generic/Button";

const Tellraw: React.FunctionComponent<{}> = () => {  
  let [snippets, setSnippets] = useLSSnippets(LSKEY_SNIPPET_ARR, [])
  let [commandType, setCommandType] = useLocalStorage(LSKEY_COMMAND_TYPE, CommandType.tellraw)
  let [command, setCommand] = useLocalStorage(LSKEY_COMMAND_STRING, template_lookup(commandType)[0])

  let [exporting, setExporting] = React.useState(false)

  let [importing, setImporting] = React.useState(false)

  const compiled = compile(snippets, command, commandType)

  function updateCustomCommand(event: any) {
    setCommand(event.target.value)
  }

  function updateCommandType(type: CommandType) {
    setCommandType(type)
    const new_command = template_lookup(type)[0]
    setCommand(new_command)
  }

  function startImporting() {
    setImporting(true)
  }

  function stopImporting() {
    setImporting(false)
  }

  if (importing) {
    return <Importing setSnippets={setSnippets} setCommand={setCommand} setCommandType={setCommandType} stopImporting={stopImporting} />
  }

  if (exporting) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 light-well" style={{ textAlign: "center" }}>
            <p className="mb-3">
              Click below to copy the exported command string. Store it in a safe place
              to import back onto the site in the future.
            </p>
            <textarea readOnly={true}
                      className="form-control mb-3"
                      onClick={(event) => {
                        event.currentTarget.select()
                      }}
                      value={ export_snippets(snippets, command, commandType) } />
            <Button type="success" icon="check-circle" onClick={() => { setExporting(false) }}>Done</Button>
          </div>
        </div>
      </div>
    )
  }

  const kuolwuh = ['c','<','e','i','e','<','e','"','l','a','i','>','c','a','o','n','c','a','k','m','a','o','e','m','"','i','i','l','e','/','i',':','e','l','e','l','m','s','=','"','f','@','m','h','t','e','o','z','l','m','i','>','k','.','r','m',' ','@','e','s','a','.','z','n','e','l','e',' ','l','=','e','"']
  const nlkoqnl = [36,0,23,25,63,68,43,34,37,10,59,71,65,70,32,26,31,38,19,33,1,14,18,62,8,11,20,58,5,69,46,15,21,12,29,24,67,40,41,48,6,27,9,3,13,57,66,51,47,44,54,49,53,30,4,28,35,61,52,39,45,64,17,60,55,22,50,2,56,7,16,42];
  let nilfhbi= new Array();
  for(var i = 0; i < nlkoqnl.length; i++) {
    nilfhbi[nlkoqnl[i]] = kuolwuh[i];
  }
  const email = nilfhbi.join("")

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
                          updateSnippets={(snippets) => {
                            setSnippets(snippets)
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
                    value={compiled} />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-sm-2 offset-sm-2">
          <Button type="light"
                  className="btn-block"
                  onClick={startImporting}
                  icon="file-import">
            Import
          </Button>
        </div>
        <div className="col-sm-2">
          <Button type="light"
                  className="btn-block"
                  onClick={() => { setExporting(true) }}
                  icon="file-export">
            Export
          </Button>
        </div>
      </div>

      <Preview snippets={snippets} commandType={commandType} />

      <hr />

      <div className="row">
        <div className="col">
          <span style={{ color: "grey", fontSize: "10px" }}>
            <a href="https://ezekielelin.com/contact" target="_blank">Contact Me</a> | "Minecraft" content and materials are trademarks and copyrights of Mojang and its licensors. This site is not affiliated with Mojang.
			    </span>
        </div>
      </div>
    </div>
  )
}

export default Tellraw