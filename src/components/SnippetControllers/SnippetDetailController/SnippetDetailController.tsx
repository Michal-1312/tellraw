import * as React from "react";
import { ClickEventType } from "../../../classes/Snippets/ClickEvent";
import { HoverEventType } from "../../../classes/Snippets/HoverEvent";
import { KeybindSnippet } from "../../../classes/Snippets/SnippetTypes/KeybindSnippet";
import { NBTSnippet } from "../../../classes/Snippets/SnippetTypes/NBTSnippet";
import { ScoreboardObjectiveSnippet } from "../../../classes/Snippets/SnippetTypes/ScoreboardObjectiveSnippet";
import { SelectorSnippet } from "../../../classes/Snippets/SnippetTypes/SelectorSnippet";
import { Snippet } from "../../../classes/Snippets/SnippetTypes/Snippet";
import { TextSnippet } from "../../../classes/Snippets/SnippetTypes/TextSnippet";
import { CommandType, FeatureType, isFeatureAvailable } from "../../../data/templates";
import { duplicate_snippet } from "../../../helpers/copy_snippet";
import { formatSnippet } from "../../../helpers/formatter";
import { Checkbox } from "../../Forms/Checkbox";
import { MinecraftColorWell, MinecraftColorButton } from "../../MinecraftColorWell";
import SnippetCollection from "../../SnippetCollection";
import { GenericSnippetController } from "../GenericSnippetController";
import { NBTSnippetController } from "../NBTSnippetController";
import { minecraftColorSet, getCSSHEX } from "../../../classes/Color";

export interface SnippetDetailControllerProps {
  commandType: CommandType
  snippet: Snippet
  updateSnippet: (snippet: Snippet) => void
  stopEditing: (save: boolean) => void
  v116Flag: boolean
}

export interface SnippetDetailControllerState {

}

export class SnippetDetailController extends React.Component<SnippetDetailControllerProps, SnippetDetailControllerState> {
  
  constructor(props: SnippetDetailControllerProps) {
    super(props)
    
    console.log(this.props)

    this.state = {}

    this.changeColor = this.changeColor.bind(this)
    
    this.changeClickEventType = this.changeClickEventType.bind(this)
    this.changeClickEventValue = this.changeClickEventValue.bind(this)
    
    this.changeHoverEventType = this.changeHoverEventType.bind(this)
    this.changeHoverEventValue = this.changeHoverEventValue.bind(this)
    this.changeHoverEventChildren = this.changeHoverEventChildren.bind(this)
    this.changeInsertion = this.changeInsertion.bind(this)
    this.changeFont = this.changeFont.bind(this)

    this.updateToggle = this.updateToggle.bind(this)
    this.updateField = this.updateField.bind(this)
    this.updateFontCheckbox = this.updateFontCheckbox.bind(this)

    this.customAreaRender = this.customAreaRender.bind(this)
    this.clickEventRenderer = this.clickEventRenderer.bind(this)
    this.hoverEventRenderer = this.hoverEventRenderer.bind(this)
    this.hoverEventValueRender = this.hoverEventValueRender.bind(this)
    this.insertionRenderer = this.insertionRenderer.bind(this)
  }

  changeColor(event: any) {
    this.updateField("color", event.target.value)
  }

  changeClickEventType(event: any) {
    this.updateField("click_event_type", event.target.value)
  }

  changeClickEventValue(event: any) {
    this.updateField("click_event_value", event.target.value)
  }

  changeHoverEventType(event: any) {
    this.updateField("hover_event_type", event.target.value)
  }

  changeHoverEventValue(event: any) {
    this.updateField("hover_event_value", event.target.value)
  }

  changeHoverEventChildren(snippets: Array<Snippet>) {
    let newSnippet = duplicate_snippet(this.props.snippet)
    newSnippet.hover_event_children = snippets
    this.props.updateSnippet(newSnippet)
  }

  changeInsertion(event: any) {
    this.updateField("insertion", event.target.value)
  }

  changeFont(event: any) {
    this.updateField("font", event.target.value)
  }

  updateToggle(field: string, event: any) {
    this.updateField(field, event.target.checked)
  }

  updateField(field: string, value: any) {
    let newSnippet = duplicate_snippet(this.props.snippet)
    newSnippet[field] = value
    this.props.updateSnippet(newSnippet)
  }

  updateFontCheckbox(newValue: boolean) {
    let newSnippet = duplicate_snippet(this.props.snippet)
    if (newValue) {
      newSnippet.font = "minecraft:default"
    } else {
      newSnippet.font = null
    }
    this.props.updateSnippet(newSnippet)
  }

  customAreaRender() {
    if (this.props.snippet instanceof NBTSnippet) {
      return <NBTSnippetController snippet={this.props.snippet} updateSnippet={this.props.updateSnippet} />
    } else if (
         this.props.snippet instanceof ScoreboardObjectiveSnippet
      || this.props.snippet instanceof SelectorSnippet
      || this.props.snippet instanceof TextSnippet
      || this.props.snippet instanceof KeybindSnippet
    ) {
      return <GenericSnippetController snippet={this.props.snippet} updateSnippet={this.props.updateSnippet} />
    } else {
      return <span>{typeof this.props.snippet} isn't implemented supported renderer</span>
    } 
  }

  clickEventRenderer() {
    if (!isFeatureAvailable(this.props.commandType, FeatureType.clicking)) {
      return null
    }

    const clickEventTypeIsCommand = this.props.snippet.click_event_type == ClickEventType.run_command || this.props.snippet.click_event_type == ClickEventType.suggest_command

    return (
      <>
        <div className="row">
          <div className="col">
            <h4>Click Event:</h4>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-4">
            <select className="custom-select" value={this.props.snippet.click_event_type} onChange={this.changeClickEventType}>
              <option key={ClickEventType.none} value={ClickEventType.none}>None</option>
              <option key={ClickEventType.open_url} value={ClickEventType.open_url}>Open URL</option>
              <option key={ClickEventType.run_command} value={ClickEventType.run_command}>Run Command</option>
              <option key={ClickEventType.suggest_command} value={ClickEventType.suggest_command}>Suggest Command</option>
              <option key={ClickEventType.change_page} value={ClickEventType.change_page}>Change Page (Books Only)</option>
              <option key={ClickEventType.copy_to_clipboard} value={ClickEventType.copy_to_clipboard}>Copy to Clipboard</option>
						</select>
          </div>
          {
            this.props.snippet.click_event_type !== ClickEventType.none ? (
              <div className="col">
                <input
                  list={clickEventTypeIsCommand ? "datalist-commands" : null}
                  type="text"
                  className="form-control"
                  value={this.props.snippet.click_event_value}
                  onChange={this.changeClickEventValue}
                />
              </div>  
            ) : null
          }
        </div>
        <hr />
      </>
    )
  }

  hoverEventRenderer() {
    if (!isFeatureAvailable(this.props.commandType, FeatureType.hovering)) {
      return null
    }

    return (
      <>
        <div className="row">
          <div className="col">
            <h4>Hover Event:</h4>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-4">
            <select className="custom-select" value={this.props.snippet.hover_event_type} onChange={this.changeHoverEventType}>
            <option key={HoverEventType.none} value={HoverEventType.none}>None</option>
            <option key={HoverEventType.show_entity} value={HoverEventType.show_entity}>Show Entity</option>
            <option key={HoverEventType.show_item} value={HoverEventType.show_item}>Show Item</option>
            <option key={HoverEventType.show_text} value={HoverEventType.show_text}>Show Text</option>
						</select>
          </div>
          { this.hoverEventValueRender() }
        </div>
        <hr />
      </>
    )
  }

  hoverEventValueRender() {
    if (this.props.snippet.hover_event_type == HoverEventType.show_text) {
      return (
        <div className="col">
          <div className="row">
            <div className="col inline-snippet-collection">
              <SnippetCollection commandType={CommandType.hovertext}
                                 snippets={this.props.snippet.hover_event_children}
                                 updateSnippets={this.changeHoverEventChildren}
                                 deleteAll={() => {
                                   this.changeHoverEventChildren([])
                                 }}
                                 v116Flag={this.props.v116Flag}
                                 />
            </div>
          </div>
        </div>
      )
    } else if (this.props.snippet.hover_event_type != HoverEventType.none) {
      return (
        <div className="col">
          <input type="text" className="form-control" value={this.props.snippet.hover_event_value} onChange={this.changeHoverEventValue}/>
        </div>
      )
    }
  }

  insertionRenderer() {
    if (!isFeatureAvailable(this.props.commandType, FeatureType.insertion)) {
      return null
    }

    return (
      <>
        <div className="row mb-2">
          <div className="col-4">
            <h4>Insertion:</h4>
          </div>
          <div className="col">
            <input className="form-control"
                   value={this.props.snippet.insertion}
                   onChange={this.changeInsertion} />
          </div>
        </div>
      </>
    )
  }

  render() {
    return (
      <>
        <div className="row mb-2">
          <div className="col">
            { this.customAreaRender() }
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col">
            <h4>
              Formatting Options:
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <div className="row mb-1">
              <div className="col">
                <span style={{ fontWeight: "bold" }}>
                  Preset Colors:
                </span>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col d-flex flex-wrap">
                {
                  Object.keys(minecraftColorSet)
                    .filter((color) => { return color != "none" })
                    .map((color) => {
                      return (
                        <MinecraftColorButton
                          key={color}
                          color={color}
                          checked={this.props.snippet.color == color}
                          onClick={(newColor) => {
                            this.updateField("color", newColor)
                          }}
                        />
                      )
                    })
                }
              </div>
            </div>
            {
              this.props.v116Flag ? (
                <div className="row mb-1">
                  <div className="col">
                    <span style={{ fontWeight: "bold" }}>
                      Custom Color:
                    </span>
                    <input
                      type="color"
                      value={getCSSHEX(this.props.snippet.color)}
                      onChange={(evt) => {
                        this.updateField("color", evt.target.value.toUpperCase())
                      }}
                    />
                  </div>
                </div>
              ) : null
            }
            <div className="row mb-2">
              <div className="col">
                {
                  this.props.snippet.color != "none" ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        this.updateField("color", "none")
                      }}
                    >
                      Remove Color
                    </button>
                  ) : (
                    <p className="mb-0">
                      No color is selected, so it will appear
                      the default color in-game, usually black.
                    </p>
                  )
                }
              </div>
            </div>
          </div>
          <div className="col-4">
            <Checkbox label="Bold" checked={this.props.snippet.bold} onChange={newValue => this.updateField("bold", newValue)} />
            <Checkbox label="Italic" checked={this.props.snippet.italic} onChange={newValue => this.updateField("italic", newValue)} />
            <Checkbox label="Underlined" checked={this.props.snippet.underlined} onChange={newValue => this.updateField("underlined", newValue)} />
            <Checkbox label="Strikethrough" checked={this.props.snippet.strikethrough} onChange={newValue => this.updateField("strikethrough", newValue)} />
            <Checkbox label="Obfuscated" checked={this.props.snippet.obfuscated} onChange={newValue => this.updateField("obfuscated", newValue)} />
          </div>
          {
            this.props.v116Flag ? (
              <div className="col-4">
                <div className="row">
                  <div className="col">
                    <Checkbox label="Custom Font" checked={this.props.snippet.font !== null} onChange={newValue => this.updateFontCheckbox(newValue)} />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {
                      (this.props.snippet.font !== null) ? (
                        <input type="text" className="form-control" value={this.props.snippet.font} onChange={this.changeFont}/>
                      ) : null
                    }
                  </div>
                </div>
              </div>
            ) : null
          }
        </div>
        <hr />

        { this.clickEventRenderer() }

        { this.hoverEventRenderer() }
        
        { this.insertionRenderer() }

        <br />


        <hr />
        
        {/* Preview */}

        <div className="row mb-2">
          <div className="col">
            <h4>Preview:</h4>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col">
            <p>
              { formatSnippet(this.props.snippet) }
            </p>
          </div>
        </div>

        {/* Exit Controls */}

        <div className="row">
          <div className="offset-8 col-2">
            <button className="btn btn-secondary btn-block" onClick={() => { this.props.stopEditing(false) }}>Cancel</button>
          </div>
          <div className="col-2">
            <button className="btn btn-primary btn-block" onClick={() => { this.props.stopEditing(true) }}>Save</button>
          </div>
        </div>
      </>
    )
  }
}