export function _stateToURLSearchParams(
  state,
  propertiesToEncode = Object.keys(state)
) {
  let result = [];

  const propertiesToEncodeSet = new Set(propertiesToEncode);

  Object.keys(state)
    .filter(key => propertiesToEncodeSet.has(key))
    .forEach(key => {
      const value = state[key];

      if (Array.isArray(value)) {
        value.forEach(value => {
          result.push(`${key}[]=${_encodeValue(value)}`);
        });
      } else {
        result.push(`${key}=${_encodeValue(value)}`);
      }
    });

  return result.join("&");
}

function _encodeValue(rawValue) {
  let result;

  switch (typeof rawValue) {
    case "number":
    case "boolean":
    case "string":
      result = rawValue;
      break
    default:
      result = JSON.stringify(rawValue);
      break;
  }

  return encodeURIComponent(result);
}

function _decodeValue(rawEncodedString) {
  const rawString = decodeURIComponent(rawEncodedString);
  switch (rawString) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      const numValue = parseInt(rawString, 10);
      if (isNaN(numValue)) {
        try {
          return JSON.parse(rawString);
        } catch (e) {
          return rawString;
        }
      } else {
        return numValue;
      }
  }
}

export function _URLSearchParamsToState(urlSearchParams, defaultState) {
  const parts = urlSearchParams.split("&");

  const pairs = parts
    .map(part => part.split("="))
    .filter(pair => pair.length === 2);

  const keyValues = pairs.reduce((memo, [key, value]) => {
    const values = memo.get(key) || [];

    values.push(value);

    memo.set(key, values);
    return memo;
  }, new Map());

  const state = {};

  keyValues.forEach((value, key) => {
    if (key.endsWith("[]")) {
      state[key.slice(0, -2)] = value.map(_decodeValue);
    } else {
      state[key] = _decodeValue(value[0]);
    }
  });

  return { ...defaultState, ...state };
}

export function saveStateToURL(state, propsToSync) {
  const serialized = _stateToURLSearchParams(state, propsToSync);
  const url = new URL(window.location);
  if (url.search.substr(1) !== serialized) {
    url.search = serialized;
    window.history.replaceState({ state: state }, "", url.toString());
  }
}

export function readStateFromURL() {
  const url = new URL(window.location);
  const { search } = url;
  return _URLSearchParamsToState(search.substr(1));
}