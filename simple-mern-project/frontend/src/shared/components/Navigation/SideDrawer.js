import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./SideDrawer.css";

const SideDrawer = ({ children, show }) => {
  const content = (
    <CSSTransition in={show} timeout={200}>
      <aside className="side-drawer">{children}</aside>;
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};
export default SideDrawer;
