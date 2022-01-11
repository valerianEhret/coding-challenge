import classNames from "classnames";
import styles from "./index.module.css";

type StackProps = {
  scale: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
} & React.ComponentPropsWithoutRef<"div">;

const Stack: React.FC<StackProps> = (props) => (
  <div
    {...props}
    className={classNames(
      styles[`stack-${props.scale}`],
      styles.stack,
      props.className
    )}
  >
    {props.children}
  </div>
);

export default Stack;
