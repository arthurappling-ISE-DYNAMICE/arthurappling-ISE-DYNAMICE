# NFL LINE MOVEMENT ANALYSIS
**Prime Pathwy — Sports Analytics Infrastructure**
*Sovereign AI Operating System*
*Last Updated: 2026-05-17 | Data Source: nfl-data-py (nflverse)*

---

## DATASET OVERVIEW

| Attribute | Value |
|---|---|
| Seasons Covered | 2023, 2024, 2025 |
| Total Games | 855 |
| Regular Season Games | 816 |
| Postseason Games | 39 (18 Wild Card + 12 Divisional + 6 Conference + 3 Super Bowl) |
| Data Source | nflverse via nfl-data-py Python package |
| Last Verified | 2026-05-17 |

---

## KEY QUANTITATIVE FINDINGS

### Spread Line Statistics (2023–2025)

| Metric | Value |
|---|---|
| Mean Spread Line | 1.60 (home team favored on average) |
| Median Spread Line | 2.5 |
| Standard Deviation | 5.83 |
| Min Spread | -16.5 |
| Max Spread | +19.5 |
| Home Cover Rate | **57.3%** |

**Analysis:** The home cover rate of 57.3% over three seasons suggests a persistent home-field advantage that the market has not fully priced. This is a statistically significant edge above the 50% breakeven threshold.

### Total Line Statistics (2023–2025)

| Metric | Value |
|---|---|
| Mean Total Line | 44.16 |
| Median Total Line | 44.5 |
| Standard Deviation | 4.29 |
| Min Total | 28.5 |
| Max Total | 56.5 |
| Over Rate | **50.3%** |

**Analysis:** The over rate of 50.3% is essentially breakeven, suggesting the total market is efficiently priced. No systematic edge in betting overs or unders without additional context (weather, rest, QB changes).

---

## REST DISADVANTAGE ANALYSIS

| Condition | Games | Notes |
|---|---|---|
| Home team short rest (<7 days) | 134 | Primarily Thursday Night Football |
| Away team short rest (<7 days) | 138 | Primarily Thursday Night Football |

**Key Finding:** Short rest games (Thursday Night Football) represent approximately 15.7% of all games. Historical research suggests that teams on short rest cover at a lower rate, particularly on the road. The `scheduling_disadvantage_report.csv` contains season-by-season breakdowns.

---

## WEATHER IMPACT SUMMARY

| Condition | Games | Notes |
|---|---|---|
| Cold weather (<40°F) | 92 | ~10.8% of all games |
| High wind (>15 mph) | 34 | ~4.0% of all games |
| Dome games | 276 | ~32.3% of all games |
| Divisional matchups | 293 | ~34.3% of all games |

**Key Finding:** Cold weather and high wind games show a tendency toward lower-scoring outcomes, which creates a potential edge in betting unders in outdoor cold/windy conditions. The `weather_correlation_data.csv` contains detailed season-by-season analysis.

---

## GAME TYPE DISTRIBUTION

| Game Type | Count | % of Total |
|---|---|---|
| Regular Season | 816 | 95.4% |
| Wild Card | 18 | 2.1% |
| Divisional | 12 | 1.4% |
| Conference Championship | 6 | 0.7% |
| Super Bowl | 3 | 0.4% |

---

## DATA DICTIONARY

| Column | Description |
|---|---|
| game_id | Unique game identifier |
| season | NFL season year |
| game_type | REG/WC/DIV/CON/SB |
| spread_line | Opening/consensus spread (positive = home team favored) |
| result | Home score minus away score |
| home_cover | True if home team covered the spread |
| home_clv | Closing Line Value for home team (result + spread_line) |
| total_line | Consensus total line |
| total | Actual combined score |
| over_hit | True if game went over the total |
| home_rest / away_rest | Days of rest for each team |
| home_short_rest | True if home team had <7 days rest |
| temp | Temperature at kickoff (°F) |
| wind | Wind speed at kickoff (mph) |
| roof | Stadium roof type (dome/closed/outdoors/open) |
| is_divisional | True if divisional matchup |

---

## OUTPUT FILES

| File | Description |
|---|---|
| `nfl_quant_master_dataset.csv` | Full 855-game dataset with all metrics |
| `line_movement_analysis.csv` | Season/game-type aggregated analysis |
| `scheduling_disadvantage_report.csv` | Rest disadvantage by season |
| `weather_correlation_data.csv` | Weather impact on scoring by season |
| `nfl_teams_reference.csv` | Team abbreviation reference |
| `raw_schedules_2023_2025.csv` | Raw nflverse data |

---

*Data Source: nfl-data-py (nflverse) — https://nflverse.nflverse.com/*
*Verified: 2026-05-17*
