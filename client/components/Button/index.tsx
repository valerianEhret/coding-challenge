import React from "react";
import classNames from "classnames";
import styles from "./index.module.css";

const Button = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>((props, ref) => (
  <a
    {...props}
    className={classNames(props.className, styles.button)}
    ref={ref}
  >
    {props.children}
  </a>
));

export default Button;
