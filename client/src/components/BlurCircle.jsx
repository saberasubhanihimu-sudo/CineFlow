const BlurCircle = ({
  top = "auto",
  bottom = "auto",
  left = "auto",
  right = "auto",
}) => {
  return (
    <div
      className="absolute h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl -z-10 pointer-events-none"
      style={{
        top,
        bottom,
        left,
        right,
      }}
    />
  );
};

export default BlurCircle;