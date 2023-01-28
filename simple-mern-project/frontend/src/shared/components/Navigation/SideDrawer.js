import React from "react";
import ReactDOM from "react-dom";

import "./SideDrawer.css";

const SideDrawer = () => {
  const content = <aside className="side-drawer"></aside>;

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};
export default SideDrawer;
