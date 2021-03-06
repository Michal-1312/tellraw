import { Color } from "../classes/Color";
import { KeybindSnippet } from "../classes/Snippets/SnippetTypes/KeybindSnippet";
import { LinebreakSnippet } from "../classes/Snippets/SnippetTypes/LinebreakSnippet";
import { NBTSnippet } from "../classes/Snippets/SnippetTypes/NBTSnippet";
import { PagebreakSnippet } from "../classes/Snippets/SnippetTypes/PagebreakSnippet";
import { ScoreboardObjectiveSnippet } from "../classes/Snippets/SnippetTypes/ScoreboardObjectiveSnippet";
import { SelectorSnippet } from "../classes/Snippets/SnippetTypes/SelectorSnippet";
import { Snippet } from "../classes/Snippets/SnippetTypes/Snippet";
import { TextSnippet } from "../classes/Snippets/SnippetTypes/TextSnippet";
import { LSKEY_SNIPPET_ARR, VERSION } from "../constants";

export function legacyStatePreparation() {
  
  const lsformat = parseInt(localStorage.getItem("jformat") || VERSION.toString())
  console.log("Verifying format...")
  console.log("Currently", lsformat)
  console.log("Wanted", VERSION)

  if (lsformat < 5) {
    console.warn("Resetting local state instead of upgrading")
    localStorage.clear()
    return
  }
  
  if (lsformat == 5) {
    console.log(`Upgrading local state from ${lsformat} to ${VERSION}`)
    console.log("Mapping colors, then deferring to default loader")

    const source_str = localStorage.getItem(LSKEY_SNIPPET_ARR)
    const source_array = JSON.parse(source_str || "[]") as Array<object>

    const correctedSnippetArray = upgradeV5State(source_array)

    localStorage.setItem(LSKEY_SNIPPET_ARR, JSON.stringify(correctedSnippetArray))
  }

  localStorage.setItem("jformat", VERSION.toString())
}

export function upgradeV5State(source_array: Array<object>): Array<object> {
  return source_array.map((s): object => {
    const parsedColorInt = parseInt(s["color"])
    if (!isNaN(parsedColorInt)) {
      const v5ColorMap: Color[] = [
        "black",
        "dark_blue",
        "dark_green",
        "dark_aqua",
        "dark_red",
        "dark_purple",
        "gold",
        "gray",
        "dark_gray",
        "blue",
        "green",
        "aqua",
        "red",
        "light_purple",
        "yellow",
        "white",
        "none"
      ]
      if (parsedColorInt < v5ColorMap.length) {
        s["color"] = v5ColorMap[parsedColorInt]
      }
    }

    return s
  })
}

// Version 6
export function loadCurrentVersionState(source_array: Array<object>): Array<Snippet> {
  return source_array.map((s): Snippet => {
    if (s.hasOwnProperty("hover_event_children")) {
      const childSnippets = loadCurrentVersionState(s["hover_event_children"])
      s["hover_event_children"] = childSnippets
    }

    if (s.hasOwnProperty("text")) {
      if (s["text"] === "\n") {
        return (Object as any).assign(new LinebreakSnippet(), s)
      } else {
        return (Object as any).assign(new TextSnippet(), s)
      }
    } else if (s.hasOwnProperty("keybind")) {
      return (Object as any).assign(new KeybindSnippet(), s)
    } else if (s.hasOwnProperty("score") || s.hasOwnProperty("score_name")) {
      return (Object as any).assign(new ScoreboardObjectiveSnippet(), s)
    } else if (s.hasOwnProperty("selector")) {
      return (Object as any).assign(new SelectorSnippet(), s)
    } else if (s.hasOwnProperty("nbt")) {
      return (Object as any).assign(new NBTSnippet(), s)
    } else if (s.hasOwnProperty("isPagebreak")) {
      return (Object as any).assign(new PagebreakSnippet(), s)
    } else {
      let x = new TextSnippet()
      x.text = `Failed to claim ${JSON.stringify(s)}`
      return x
    }
  })
}