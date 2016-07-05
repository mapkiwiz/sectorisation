package fr.gouv.agriculture.stats.sectorisation;

import java.io.IOException;
import java.util.Properties;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.ParseException;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.util.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AppServer {

  private static final Logger LOGGER = LoggerFactory.getLogger(AppServer.class);
  private Server server;
  private int port;
  private Properties properties;

  public AppServer(CommandLine options) throws IOException {

    setProperties(options);

  }

  public void start() throws Exception {

//    ServletContextHandler servletContextHandler = new ServletContextHandler(
//      ServletContextHandler.NO_SECURITY |
//        ServletContextHandler.NO_SESSIONS);
//    servletContextHandler.setContextPath("/sectorisation");

    ContextHandler context = new ContextHandler();
    context.setContextPath("/sectorisation");
    ResourceHandler resourceHandler = new ResourceHandler();
    resourceHandler.setBaseResource(Resource.newClassPathResource("/META-INF/resources"));
    resourceHandler.setDirectoriesListed(true);
    context.setHandler(resourceHandler);

    HandlerList handlers = new HandlerList();
    handlers.addHandler(context);
    // handlers.addHandler(servletContextHandler);

    server = new Server(port);
    server.setHandler(handlers);
    server.start();
    // System.out.println(server.dump());
    // server.join();

  }

  public void stop() {

    if (server == null) return;

    try {
      LOGGER.info("Server shutting down ...");
      server.stop();
    } catch (Exception e) {
      LOGGER.error(e.getMessage(), e);
    }

  }

  protected void setProperties(CommandLine options) throws IOException {

      properties = new Properties();
      LOGGER.info("Loading default configuration properties");
      properties.load(getClass().getClassLoader().getResourceAsStream("default.properties"));
//
//    String config;
//
//    if ((config = options.getOptionValue("c", null)) != null) {
//      LOGGER.info("Reading configuration from file {}", config);
//      properties = new Properties(properties);
//      properties.load(new FileInputStream(config));
//    }

    port = Integer.valueOf(options.getOptionValue("p", properties.getProperty("http.port")));

  }

  public static void main(String[] args) {

    try {

      DefaultParser commandLineParser = new DefaultParser();
      CommandLine options = commandLineParser.parse(
        new AppServerOptions(), args);

      final AppServer server = new AppServer(options);
      server.start();
      LOGGER.info("Server started on port {}", server.port);

      Runtime.getRuntime().addShutdownHook(new Thread() {

        @Override
        public void run() {
          server.stop();
        }

      });

    } catch (ParseException e) {

      LOGGER.error(e.getMessage());
      HelpFormatter helpFormatter = new HelpFormatter();
      helpFormatter.printHelp(AppServer.class.getSimpleName(), new AppServerOptions());

      LOGGER.debug(e.getMessage(), e);

    } catch (Exception e) {

      LOGGER.error(e.getMessage(), e);

    }

  }

}
