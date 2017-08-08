using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.FileProviders;
using System.IO;
using SmarterBalanced.SampleItems.Dal.Providers;
using SmarterBalanced.SampleItems.Dal.Configurations.Models;
using SmarterBalanced.ScoringGuide.Core.Repos;

namespace SmarterBalanced.ScoringGuide.Web
{
    public class Startup
    {
        public Startup(IHostingEnvironment env, ILoggerFactory factory)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
            ConfigureLogging(env, factory);
            logger = factory.CreateLogger<Startup>();
        }
        private readonly ILogger logger;

        public IConfigurationRoot Configuration { get; }

        private void ConfigureLogging(IHostingEnvironment env, ILoggerFactory factory)
        {
            factory.AddConsole(Configuration.GetSection("Logging"));
            factory.AddDebug();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            SampleItemsContext context;
            AppSettings appSettings = new AppSettings();
            Configuration.Bind(appSettings);
            try
            {
                context = SampleItemsProvider.LoadContext(appSettings, logger);
            }
            catch (Exception e)
            {
                logger.LogCritical($"{e.Message} occurred when loading the context");
                throw e;
            }

            // Add framework services.
            services.AddScoped<IScoringRepo, ScoringRepo>();
            services.AddMvc();
            services.AddRouting();

            services.AddSingleton(context);
            services.AddSingleton(appSettings);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseStaticFiles();

            if (env.IsDevelopment())
            {
                var options = new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Scripts")),
                    RequestPath = new Microsoft.AspNetCore.Http.PathString("/Scripts"),
                    ServeUnknownFileTypes = true
                };
                app.UseStaticFiles(options);

                app.UseDeveloperExceptionPage();
                app.UseStatusCodePages();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseStatusCodePagesWithRedirects("/Home/StatusCodeError?code={0}");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=ScoringGuide}/{action=Index}/{id?}");
            });
        }
    }
}
