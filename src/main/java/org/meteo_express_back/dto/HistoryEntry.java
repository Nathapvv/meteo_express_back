package org.meteo_express_back.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class HistoryEntry {
    private String zone;
    private int carbonIntensity;
    private String datetime;
    private String updatedAt;
    private String createdAt;
    private String emissionFactorType;
    private boolean isEstimated;
    private String estimationMethod;
}
