import {GPPIsochroneService} from '../app/services/gpp.isochrone.service';

const gpp_key = "50bejnu55v5ievgkbvzxas6s";

let isochroneService = new GPPIsochroneService({
  url: "https://wxs.ign.fr/" + gpp_key + "/isochrone/isochrone.json",
  referer: "http://geo.agriculture/affectation-demo",
  concavity: 2
});

module.exports = {
  "gpp_key": gpp_key,
  "gpp_isochrone_url": "https://wxs.ign.fr/" + gpp_key + "/isochrone/isochrone.json",
  "gpp_referer": "http://geo.agriculture/affectation-demo",
  "IsochroneService": isochroneService
};
