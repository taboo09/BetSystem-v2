using BetSystem.API.Persistence;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using BetSystem.API.Persistence.Core;
using Microsoft.AspNetCore.HttpOverrides;
using BetSystem.API.Persistence.Helper;

namespace BetSystem.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // services.AddDbContext<BetDbContext>(x => 
                // x.UseLazyLoadingProxies().UseSqlite(Configuration.GetConnectionString("Default-sqllite")));
            services.AddDbContext<BetDbContext>(x => 
                x.UseLazyLoadingProxies().UseSqlServer(Configuration.GetConnectionString("Default-sql")));
            // services.AddDbContext<BetDbContext>(x => 
            //  x.UseLazyLoadingProxies().UseMySql(Configuration.GetConnectionString("Default-mysql")));

            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddAutoMapper(typeof(Startup)); 
            services.AddCors();

            services.AddTransient<SeedData>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAppRepository, AppRepository>();
            services.AddScoped<ICurrencyRepository, CurrencyRepository>();
            services.AddScoped<ISeasonRepository, SeasonRepository>();
            services.AddScoped<ITeamRepository, TeamRepository>();
            services.AddScoped<IBetRepository, BetRepository>();
            services.AddScoped<IStatisticsRepository, StatisticsRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, SeedData seeder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            // seed currencies and app version table
            seeder.Seed();
            
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseMvc(routes => {
                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Fallback", action = "Index"}
                );
            });
        }
    }
}
