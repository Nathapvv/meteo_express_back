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

import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MeteoServiceImpl implements MeteoService {

    @Autowired
    private LocationRepository locationRepository;

    @Override
    public ResponseEntity<String> getMeteoData(String ville, Integer fenetre, String heureDebut, String heureFin) {
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

        if (fenetre != null || (heureDebut != null && heureFin != null)) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                ApiResponse apiResponse = mapper.readValue(result, ApiResponse.class);
                List<HistoryEntry> historyEntries = apiResponse.getHistoryEntries();

                if (heureDebut != null && heureFin != null) {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
                    LocalTime debut = LocalTime.parse(heureDebut, formatter);
                    LocalTime fin = LocalTime.parse(heureFin, formatter);

                    historyEntries = historyEntries.stream()
                            .filter(entry -> {
                                ZonedDateTime zdt = ZonedDateTime.parse(entry.getDatetime());
                                LocalTime entryTime = zdt.toLocalTime();
                                return (entryTime.isAfter(debut) || entryTime.equals(debut)) && (entryTime.isBefore(fin) || entryTime.equals(fin));
                            })
                            .collect(Collectors.toList());
                }

                if (fenetre != null) {
                    int size = historyEntries.size();
                    int step = size / fenetre;
                    List<HistoryEntry> selectedEntries = new ArrayList<>();
                    for (int i = step - 1; i < size; i += step) {
                        selectedEntries.add(historyEntries.get(i));
                    }
                    historyEntries = selectedEntries;
                }

                return ResponseEntity.ok(mapper.writeValueAsString(historyEntries));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Error parsing the API response");
            }
        }

        return ResponseEntity.ok(result);
    }
}