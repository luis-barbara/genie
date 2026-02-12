
const DashboardPreview = () => {
  return (
    <div className="mt-20 max-w-6xl mx-auto">
      <div className="relative">
        {/* Glow effect behind dashboard */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-3xl scale-95" />
        
        <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-2 shadow-2xl shadow-primary/10">
          <div className="rounded-xl bg-genie-surface overflow-hidden">
            {/* Mock Dashboard */}
            <div className="flex">
              {/* Mini sidebar */}
              <div className="w-56 border-r border-border/50 p-4 hidden lg:block">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg genie-gradient-bg" />
                  <div className="h-4 w-16 rounded bg-foreground/20" />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={`h-9 rounded-lg ${i === 1 ? 'bg-primary/20' : 'bg-secondary/30'}`} />
                  ))}
                </div>
              </div>
              
              {/* Main content */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 w-32 rounded bg-foreground/20" />
                  <div className="flex gap-2">
                    <div className="h-9 w-24 rounded-lg bg-secondary/50" />
                    <div className="h-9 w-9 rounded-lg genie-gradient-bg" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Issues", value: "142" },
                    { label: "Critical", value: "12" },
                    { label: "Fixed", value: "89" },
                    { label: "Success", value: "98%" },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                      <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-xl bg-secondary/20 border border-border/20" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
