import React from "./core/react/index.ts";
import { createRoot } from "./core/react-dom/client/createRoot.ts";
// import App from "./App";
// console.log("sas1", App, React.createElement(App, { a: 1 }, "sax"));
// console.log("sas2", App, React.createElement(App, { a: 1 }, ["sax"]));
// console.log("sas3", App, React.createElement(App, { a: 1 }, "sax"));
// console.log("sas4", App, React.createElement(App, { a: 1 }, ["sax"]));
// console.log("sas5", App, React.createElement(App));
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
