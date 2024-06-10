package org.meteo_express_back.service;

import org.springframework.http.ResponseEntity;

public interface MeteoService {
    ResponseEntity<String> getMeteoData(String ville, Integer fenetre);
}