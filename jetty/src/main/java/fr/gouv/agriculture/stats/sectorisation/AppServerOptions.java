package fr.gouv.agriculture.stats.sectorisation;

import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;

public class AppServerOptions extends Options {

  public AppServerOptions() {

    Option optPort = new Option("p", "port", true, "server port");
    optPort.setType(Integer.class);
    optPort.setArgName("port");
    addOption(optPort);

  }

}
