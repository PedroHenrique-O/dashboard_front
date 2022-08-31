import ReactLoading, { LoadingType } from "react-loading";

interface LoadingProps {
  type?: LoadingType;
  color?: string;
  height?: string | number;
  width?: string | number;
}

export function LoadingComponent({
  color,
  height = "40%",
  type,
  width = "40%",
}: LoadingProps) {
  return (
    <div className=" overflow-clip overflow-y-hidden flex items-center justify-center ">
      <ReactLoading type={type} color={color} height={height} width={width} />
    </div>
  );
}
