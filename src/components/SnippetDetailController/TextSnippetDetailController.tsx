import * as React from "react";
import { TextSnippet } from "../../classes/Snippets/TextSnippet";

export interface TextSnippetDetailControllerProps {
  snippet: TextSnippet
  updateSnippet: (Snippet) => void
}

export class TextSnippetDetailController extends React.Component<TextSnippetDetailControllerProps, {}> {
  constructor(props: TextSnippetDetailControllerProps) {
    super(props)

    this.state = {}
    
    this.changeText = this.changeText.bind(this)
    this.updateField = this.updateField.bind(this)
  }

  changeText(event: any) {
    this.updateField("text", event.target.value)
  }

  updateField(field: string, value: any) {
    let newSnippet = this.props.snippet.copy()
    newSnippet[field] = value
    this.props.updateSnippet(newSnippet)
  }

  render() {
    return <input className="form-control" placeholder="Text" value={this.props.snippet.text} onChange={this.changeText} />   
  }
}