package org.meteo_express_back.controller;

import org.meteo_express_back.service.MeteoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/meteo")
public class MeteoController {

    @Autowired
    private MeteoService meteoService;

    @GetMapping("/meteoday")
    public ResponseEntity<String> getMeteoData(
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) Integer fenetre,
            @RequestParam(required = false) String heureDebut,
            @RequestParam(required = false) String heureFin) {
        return meteoService.getMeteoData(ville, fenetre, heureDebut, heureFin);
    }
}