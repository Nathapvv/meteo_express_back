package org.meteo_express_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ApiResponse {
    private String zone;
    @JsonProperty("history")
    private List<HistoryEntry> historyEntries;
}
