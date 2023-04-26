import { CircularProgress } from "@mui/material";

const LoadingPage = () => {
  return (
    <div className="dark">
      <div className="dark:bg-bg h-screen flex items-center">
        <div className=" w-full">
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
