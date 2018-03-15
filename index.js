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

      switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
          result.push(`${key}=${encodeURIComponent(value)}`);
          break;
        default:
          if (Array.isArray(value)) {
            value.forEach(value => {
              result.push(`${key}[]=${value}`);
            });
            break;
          } else {
            result.push(`${key}=${value}`);
          }
      }
    });

  return result.join('&');
}

function _processValue(rawValue) {
  switch (rawValue) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      const numValue = parseInt(rawValue, 10);
      if (isNaN(numValue)) {
        return decodeURIComponent(rawValue);
      } else {
        return numValue;
      }
  }
}

export function _URLSearchParamsToState(urlSearchParams, defaultState) {
  const parts = urlSearchParams.split('&');

  const pairs = parts
    .map(part => part.split('='))
    .filter(pair => pair.length === 2);

  const keyValues = pairs.reduce((memo, [key, value]) => {
    const values = memo.get(key) || [];

    values.push(value);

    memo.set(key, values);
    return memo;
  }, new Map());

  const state = {};

  keyValues.forEach((value, key) => {
    if (key.endsWith('[]')) {
      state[key.slice(0, -2)] = value.map(_processValue);
    } else {
      state[key] = _processValue(value[0]);
    }
  });

  return { ...defaultState, ...state };
}

export function syncURL(state) {
  const serialized = _stateToURLSearchParams(state, [
    'selected',
    'reason',
    'edit',
    'selectedBlocks',
    'mode',
    'modal'
  ]);
  const url = new URL(window.location);
  url.search = serialized;

  window.history.pushState({ state: state }, '', url.toString());
}

export function readUrl() {
  const url = new URL(window.location);
  const { search } = url;
  return _URLSearchParamsToState(search.substr(1));
}