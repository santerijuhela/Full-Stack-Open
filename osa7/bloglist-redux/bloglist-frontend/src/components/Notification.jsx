import { useSelector } from "react-redux";

const Notification = ({ notification }) => {
  notification = useSelector(state => state.notification)
  
  if (!notification) {
    return null;
  }

  const { message, isError } = notification;

  const style = {
    color: isError ? "red" : "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={style}>{message}</div>;
};

export default Notification;
