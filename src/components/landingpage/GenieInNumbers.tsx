

const GenieInNumbers = () => {
  const stats = [
    { value: "500+", label: "Projects connected" },
    { value: "10K+", label: "Changes shipped" },
    { value: "98%", label: "Approval rate" },
  ];

  return (
    <section className="py-24 md:py-32 border-t border-border/50" id="genieinnumbers">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <p className="text-lg md:text-2xl text-muted-foreground font-bold mb-8 uppercase tracking-widest">
            Genie in numbers
            </p>
           
        </div>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold genie-gradient-text mb-3">
                {stat.value}
              </div>
              <div className="text-lg md:text-xl text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenieInNumbers;