const LoadingScreen = () => {
  return (
    <div className="fixed left-0 top-0 z-50 grid h-screen w-screen place-content-center">
      <div className="absolute bottom-0 top-0 h-screen w-screen bg-neutral-800 opacity-40"></div>
      <div className="loading-circle z-10"></div>
    </div>
  );
};

export default LoadingScreen;
