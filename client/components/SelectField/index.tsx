import classNames from "classnames";
import Stack from "../Stack";
import styles from "./index.module.css";

type SelectFieldProps = {
  label: React.ReactNode;
  id: string;
} & React.ComponentPropsWithoutRef<"select">;

const SelectField: React.FC<SelectFieldProps> = (props) => {


  return <Stack scale={1} className={styles["select-field"]}>
    <label htmlFor={props.id}>{props.label}</label>
    <div className={styles.wrapper}>
      <select
          {...props}
          className={classNames(props.className, styles.select)}
          id={props.id}

      >
        {props.children}

      </select>
      <div className={styles["caret-wrapper"]}>
        <svg
            className={styles.caret}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
        >

          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  </Stack>
};

export default SelectField;
