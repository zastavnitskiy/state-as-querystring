# state-as-querystring
Save your application state in query string between page views.

## Usage
Idea is simple. When state in initiated, we read it from the query string.
Whenever it changes, we write it to the query string.
This keeps start between page views and allows sharing urls of a given state.

### React example
```javascript

import { saveStateToURL, readStateFromURL } from "state-as-querystring";

class App extends React.Component {
  // read state from url when initializing the store
  constructor(props) {
    super(props);
    this.state = readStateFromURL();
  }
  
  //save state to url when state is changed
  componentDidUpdate() {
    saveStateToURL(this.state);
  }

  render() {
    return (
        <textarea
          value={this.state.text}
        />
    );
  }
}

```
[![Edit 13n3pr91nl](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/13n3pr91nl)

## Redux example
```javascript
import { saveStateToURL, readStateFromURL } from "state-as-querystring";

// read state from url when initializing the store
const store = createStore(reducer, readStateFromURL());

// save state to url when state changes 
store.subscribe(() => saveStateToURL(store.getState()));

```
[![Edit redux-state-as-querystring](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/jlxz5vm5n3)
