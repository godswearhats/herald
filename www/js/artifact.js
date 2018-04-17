class Artifact {
  constructor(name, data) {
    this.name = name
    this.id = data.id
    this.description = data.description
    this.rules = data.rules // TODO make it modify specials / spells
    this.points = data.points
    this.label = this.name + ' (' + this.points + ')'
  }
  
  asListItem() {
    let artifact = document.createElement('li')
    let anchor = document.createElement('a')
    anchor.innerHTML = this.label
    $(anchor).attr('href', '#entry-details')
    var self = this
    $(anchor).on('click', function(event) {
      current.entry.artifact = self
    })
    artifact.appendChild(anchor)
    return artifact
  }
  
  toHTML() {
    let div = document.createElement('div')
    div.innerHTML = this.label
    return div
  }
  
  
}

class ArtifactList {
  constructor(raw) {
    const list = []
    $.each(raw, function(name, data) {
      list.push(new Artifact(name, data))
    })
    this.list = list
  }
  
  artifactWithID(index) {
    return this.list[index]
  }
  
  asList(element) {
    if (this.listItems) { 
      return this.listItems 
    }
    let listItems = document.createElement('ul')
    for (let i = 1; i < this.list.length; i++) { // note index starting at 1
      listItems.appendChild(this.list[i].asListItem())
    }
    listItems.setAttribute('data-filter', 'true')
    listItems.setAttribute('data-input', '#artifacts-autocomplete')
    $(listItems).listview()
    return this.listItems = listItems
  }
}