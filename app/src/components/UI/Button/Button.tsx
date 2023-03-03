import styles from "./Button.module.scss";

const Button = (props: {
  children: string;
  id?: string;
  disabled?: boolean;
}) => {
  return (
    <button id={props.id} disabled={props.disabled} className={styles.button}>
      {props.children}
    </button>
  );
};

export default Button;
