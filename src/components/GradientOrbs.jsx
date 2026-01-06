const GradientOrbs = () => {
  return (
    <>
      <div className="fixed top-20 left-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
    </>
  );
};

export default GradientOrbs;
