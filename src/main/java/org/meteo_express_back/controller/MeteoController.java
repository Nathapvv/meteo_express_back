package org.meteo_express_back.controller;

import org.meteo_express_back.model.Location;
import org.meteo_express_back.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class MeteoController {

    @Autowired
    private LocationRepository locationRepository;

    @GetMapping("/locations/{ville}")
    public ResponseEntity<Location> getLocationByVille(@PathVariable String ville) {
        Optional<Location> location = locationRepository.findByVille(ville);
        return location.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
