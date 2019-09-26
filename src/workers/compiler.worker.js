self.onmessage = function(event) {
  const { id, snippets } = event.data
  self.postMessage({ id, compiled: JSON.stringify(snippets) })
}