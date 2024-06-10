package org.meteo_express_back.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.meteo_express_back.dto.ApiResponse;
import org.meteo_express_back.dto.HistoryEntry;
import org.meteo_express_back.model.Location;
import org.meteo_express_back.repository.LocationRepository;
import org.meteo_express_back.service.MeteoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class MeteoServiceImpl implements MeteoService {

    @Autowired
    private LocationRepository locationRepository;

    @Override
    public ResponseEntity<String> getMeteoData(String ville, Integer fenetre) {
        String defaultVille = "Amiens";
        if (ville == null) {
            ville = defaultVille;
        }

        Optional<Location> locationOptional = locationRepository.findByVille(ville);
        if (!locationOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Location location = locationOptional.get();
        String url = String.format("https://api.electricitymap.org/v3/carbon-intensity/history?lat=%s&lon=%s", location.getLatitude(), location.getLongitude());

        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(url, String.class);

        if (fenetre != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                ApiResponse apiResponse = mapper.readValue(result, ApiResponse.class);
                List<HistoryEntry> historyEntries = apiResponse.getHistoryEntries();
                int fromIndex = Math.max(0, historyEntries.size() - fenetre);
                List<HistoryEntry> lastEntries = historyEntries.subList(fromIndex, historyEntries.size());
                return ResponseEntity.ok(mapper.writeValueAsString(lastEntries));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Error parsing the API response");
            }
        }

        return ResponseEntity.ok(result);
    }
}