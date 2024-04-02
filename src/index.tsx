import React from "./core/react/index.ts";
import App from "./App";
import { createRoot } from "./core/react-dom/client/createRoot.ts";
console.log(<div></div>);

// let test = React.createElement(App, { a: 1 }, "sax", <App a />);
// console.log("sas6", test, (test.type as Function)({ a: 1, children: "sax" }));
console.log(
  "sa",
  <div>
    1
    <div>
      2
      <div>
        3<div>4</div>
      </div>
    </div>
    <div>
      5<div>6</div>
    </div>
  </div>,
);
createRoot(document.getElementById("container")!).render(
  <div x="d1">
    1
    <App test="1" />
    <div x="d2">
      2
      <div x="d3">
        3<div x="d4">4</div>
      </div>
    </div>
    <div x="d5">
      5<div x="d6">6</div>
    </div>
  </div>,
);
