import { useRouter } from "next/router";
import styles from "./index.module.css";

const Configure = () => {
  const route = useRouter();
    console.log(route.query)
  return (
    <div className={styles.container}>
      <main>

        <h1>Your selected options</h1>
        <ul>
          {Object.entries(route.query).map(([key, value]) => (
            <li key={key}>
              {key}: <b>{value}</b>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};
export default Configure;
