import Icon from "../Icon/Icon";
import "./Alert.styles.scss";

type AlertProps = {
  message: string;
};

export default function Alert({ message }: AlertProps) {
  return (
    <div className="alert">
      <Icon icon="warning-circle" color="var(--gray-100)" size="2em" />
      <p>{message}</p>
    </div>
  );
}
