import * as React from "react";
import { Snippet, Color, SnippetType } from "../classes/Snippet"

export interface SnippetDetailControllerProps {
    snippet: Snippet
    updateSnippet: (Snippet) => void
    stopEditing: (boolean) => void
}

export interface SnippetDetailControllerState {
    
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class SnippetDetailController extends React.Component<SnippetDetailControllerProps, SnippetDetailControllerState> {

    constructor(props: SnippetDetailControllerProps) {
        super(props)

        this.state = {}
        
        this.changeText = this.changeText.bind(this)
        this.changeSelector = this.changeSelector.bind(this)
        this.changeScoreName = this.changeScoreName.bind(this)
        this.changeScoreObjective = this.changeScoreObjective.bind(this)
        this.updateField = this.updateField.bind(this)
        this.changeSnippetType = this.changeSnippetType.bind(this)
        this.mainSnippetFields = this.mainSnippetFields.bind(this)
    }

    changeText(event: any) {
        this.updateField("text", event.target.value)
    }

    changeSelector(event: any) {
        this.updateField("selector", event.target.value)
    }

    changeScoreName(event: any) {
        this.updateField("score_name", event.target.value)
    }

    changeScoreObjective(event: any) {
        this.updateField("score_objective", event.target.value)
    }

    updateField(field: string, value: any) {
        let newSnippet = this.props.snippet.copy()
        newSnippet[field] = value
        this.props.updateSnippet(newSnippet)
    }

    changeSnippetType(event) {
        let newSnippet = this.props.snippet.copy()
        newSnippet.type = event.target.value
        this.props.updateSnippet(newSnippet)
    }

    mainSnippetFields() {
        switch (this.props.snippet.type) {
            case SnippetType.text:
                return (
                    <div className="row margin-below">
                        <div className="col">
                            <input className="form-control" placeholder="Text" value={this.props.snippet.text} onChange={this.changeText} />   
                        </div>
                    </div>
                )
            case SnippetType.selector:
                return (
                    <div className="row margin-below">
                        <div className="col">
                            <input className="form-control" placeholder="Selector" value={this.props.snippet.selector} onChange={this.changeSelector} />
                        </div>
                    </div>
                )
            case SnippetType.scoreboardObjective:
                return (
                    <>
                        <div className="row margin-below">
                            <div className="col">
                                <input className="form-control" placeholder="Player" value={this.props.snippet.score_name} onChange={this.changeScoreName} />
                            </div>
                        </div>
                        <div className="row margin-below">
                            <div className="col">
                                <input className="form-control" placeholder="Objective" value={this.props.snippet.score_objective} onChange={this.changeScoreObjective} />
                            </div>
                        </div>
                    </>
                )
            default:
                return <span>Editing unsupported for <pre>{this.props.snippet.type}</pre> type</span>
        }
    }

    render() {
        return (
            <>
                <div className="row margin-below">
                    <div className="col">
                        <select className="form-control" onChange={this.changeSnippetType} value={this.props.snippet.type}>
                            <option value={SnippetType.text}>Plain Text</option>
                            <option value={SnippetType.selector}>Selector</option>
                            <option value={SnippetType.scoreboardObjective}>Scoreboard Objective</option>
                        </select>
                    </div>
                </div>
                
                { this.mainSnippetFields() }

                <div className="row">
                    <div className="offset-1 col-2">
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