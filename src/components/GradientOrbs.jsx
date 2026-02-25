const GradientOrbs = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse at 10% 10%, rgba(212, 158, 61, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 90% 90%, rgba(212, 158, 61, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(212, 158, 61, 0.04) 0%, transparent 50%)
        `
      }}
    />
  );
};

export default GradientOrbs;
