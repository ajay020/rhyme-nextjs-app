import { ClipLoader } from "react-spinners";

type Props = {
  loading: boolean;
};

const styles = {
  display: "flex",
  justifyContent: "center",
};

export default function Spinner({ loading }: Props) {
  return (
    <div style={styles}>
      <ClipLoader size={24} color={"#810000"} loading={loading} />
    </div>
  );
}
