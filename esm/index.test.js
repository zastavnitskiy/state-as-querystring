import { _URLSearchParamsToState, _stateToURLSearchParams } from "./index";

describe("encoding", () => {
  it("should encode string parameters", () => {
    const string = _stateToURLSearchParams({
      first: "one",
      second: 2
    });

    expect(string).toEqual("first=one&second=2");
  });

  it("should encode boolean parameters", () => {
    const string = _stateToURLSearchParams({
      truthy: true,
      falsy: false
    });

    expect(string).toEqual("truthy=true&falsy=false");
  });
  it("should encode parameters", () => {
    const string = _stateToURLSearchParams({
      arr: ["first", "second"]
    });

    expect(string).toEqual("arr[]=first&arr[]=second");
  });

  it("should encode only listed properties", () => {
    const string = _stateToURLSearchParams(
      {
        encode: true,
        doNotEncode: true
      },
      ["encode"]
    );

    expect(string).toEqual("encode=true");
  });

  it("should encode objects as json", () => {
    const string = _stateToURLSearchParams({
      obj: {
        "hello/": "world&"
      }
    });

    expect(string).toEqual("obj=%7B%22hello%2F%22%3A%22world%26%22%7D");
  });

  it("should encode objects in arrays too", () => {
    const string = _stateToURLSearchParams({
      arr: [
        {
          "hello/": "world&"
        },
        "other"
      ]
    });

    expect(string).toEqual(
      "arr[]=%7B%22hello%2F%22%3A%22world%26%22%7D&arr[]=other"
    );
  });
});

describe("decoding", () => {
  it("should decode string parameters", () => {
    const state = _URLSearchParamsToState("first=one&second=2");

    expect(state.first).toEqual("one");
    expect(state.second).toEqual(2);
  });

  it("should decode boolean parameters", () => {
    const state = _URLSearchParamsToState("truthy=true&falsy=false");

    expect(state.truthy).toEqual(true);
    expect(state.falsy).toEqual(false);
  });

  it("should decode object parameters", () => {
    const state = _URLSearchParamsToState("arr[]=first&arr[]=second");

    expect(state.arr.length).toEqual(2);
    expect(state.arr[0]).toEqual("first");
    expect(state.arr[1]).toEqual("second");
  });

  it("should use default parameters", () => {
    const state = _URLSearchParamsToState("arr[]=first&arr[]=second", {
      third: "3"
    });

    expect(state.arr.length).toEqual(2);
    expect(state.arr[0]).toEqual("first");
    expect(state.arr[1]).toEqual("second");
    expect(state.third).toEqual("3");
  });

  it("should decode objects as json", () => {
    const state = _URLSearchParamsToState(
      "obj=%7B%22hello%2F%22%3A%22world%26%22%7D"
    );

    expect(state.obj).toBeDefined();
    expect(state.obj["hello/"]).toEqual("world&");
  });

  it("should decode objects in arrays too", () => {
    const state = _URLSearchParamsToState(
      "arr[]=%7B%22hello%2F%22%3A%22world%26%22%7D&arr[]=other"
    );

    const string = _stateToURLSearchParams({
      arr: [
        {
          "hello/": "world&"
        },
        "other"
      ]
    });

    expect(state.arr).toBeDefined();
    expect(state.arr.length).toEqual(2);
    expect(state.arr[0]["hello/"]).toEqual("world&");
    expect(state.arr[1]).toEqual("other");
  });
});
