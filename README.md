# state-as-querystring
Save your application state in query string between page views.

## Usage
Idea is simple. When state in initiated, we read it from the query string.
Whenever it changes, we write it to the query string.
This keeps start between page views and allows sharing screen.

### Redux example
```
// read state from url when initializing
const store = createStore(reducer, readStateFromURL());

// write state to url when updating
store.subscribe(() => syncState(store.getState()));

### React example
[![Edit 13n3pr91nl](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/13n3pr91nl)
