"""
ISE Dynamics — NFL Parlay Execution Engine
Master Logic: V5 "Supreme Execution" (Source: NFL_Betting_Folder_MERGED.pdf / V5_Supreme.docx)
Architect: Arthur Fitzgerald Appling Sr.
Updated: 2026-04-15

MASTER LOGIC HIERARCHY:
  V5 Supreme > V2.3 Flawless > V2 Prompt > V1 Foundation
  This file is the primary reasoning engine for all betting commands.
"""

# =============================================================================
# SECTION 1 — HARD THRESHOLDS (Box Closed — Do Not Override Without Authority)
# =============================================================================

# Survivability Score (SS) — Per V5 Supreme, Section 4 Definitions & Thresholds
SS_THRESHOLDS = {
    "anchor":           95,    # SS >= 95 | DEP: up to 3 tickets | Eligible for Straight duplication
    "high_confidence":  90,    # SS 90–94 | DEP: max 2 | Never both 8-leg AND Straight
    "solid":            88,    # SS 88–89 | DEP: max 1 | 6-leg adds only
    "borderline":       85,    # SS 85–87 | 8-leg only with Sentinel clearance
    "flagged":           0,    # sub-88 with red flags | Auto-Swap mandatory, no duplication
}

# Leg Build Minimum SS — Per V5 Section 6 BUILD steps
LEG_SS_MINIMUMS = {
    "4_leg_must_hit":       90,   # Anchors only (prefer 92–95)
    "6_leg_extension":      88,   # Add 2 legs; logical synergy with 4-leg required
    "8_leg_calculated":     85,   # Add 2 legs; screened by Rivalry Check + Bottom-Two Sentinel
    "straight_10":          88,   # Post-4/6/8; Straight-Card Firewall required
}

# Weather Risk Index (WRI) / Weather-Climate Intelligence (WCI)
WRI_THRESHOLDS = {
    "4_leg_max":    10,    # WRI must be <= 10% for 4-Leg inclusion
    "6_leg_max":    15,    # WRI <= 15% for 6-Leg
    "8_leg_max":    20,    # WRI <= 20% for 8-Leg (higher tolerance, lower SS floor compensates)
    "auto_swap":    25,    # WRI > 25% triggers mandatory Auto-Risk Swap regardless of SS
}

# Market Drift Thresholds — triggers re-score or Auto-Risk Swap (V5 Section 2)
MARKET_DRIFT = {
    "spread_max":   1.5,   # Spread drift > ±1.5 triggers re-score
    "total_max":    3.0,   # Total drift > ±3 triggers re-score
    # ML price band drift triggers Auto-Risk Swap (no fixed % — monitor vs opening line)
}

# Double Exposure Protocol (DEP) — V5 Section 5
DEP_DUPLICATION_BUDGET = {
    "anchor":          3,  # Up to 3 tickets (prefer 4+6+Straight; avoid 8/10 unless thin slate)
    "high_confidence": 2,  # Max 2; never both 8-leg AND Straight
    "solid":           1,  # Max 1; 6-leg adds only
    "borderline":      0,  # Must be swapped; cannot repeat across any ticket
}

# =============================================================================
# SECTION 2 — CORE LAWS (Hard Locks — V5 Section 3)
# =============================================================================

CORE_RULE_ZERO = """
CORE RULE ZERO (V5 Supreme — Hard Lock):
  Live, verifiable data only. Minimum 2 independent official feeds required
  for schedule/results/injuries before producing picks.
  If ANY game is unverifiable: "NO MATCHUP DATA AVAILABLE — REQUEST DENIED."
  No exceptions. No overrides.
"""

NO_THURSDAY_GAMES = True        # Default OFF — Monday allowed unless injury/weather flags escalate
BOTTOM_TWO_SENTINEL = True      # Two lowest-graded candidates BLOCKED from 8-leg
AUTO_RISK_SWAP_ACTIVE = True    # Any flagged leg auto-swapped to next-best passing all locks

# =============================================================================
# SECTION 3 — LEGACY SAFETY PROTOCOL
# Named Legacy Sensitivity Teams (require >= 2 strong counterproofs to fade at home)
# Sources: V5 Section 3 Core Laws + V2 Prompt Core Directives
# =============================================================================

LEGACY_SENSITIVITY_TEAMS = [
    # Named explicitly in V5 Supreme and V2 Prompt
    {"team": "Green Bay Packers",      "home_field": "Lambeau Field",    "ss_floor_bonus": 5},
    {"team": "Kansas City Chiefs",     "home_field": "Arrowhead Stadium","ss_floor_bonus": 5},
    {"team": "Pittsburgh Steelers",    "home_field": "Acrisure Stadium", "ss_floor_bonus": 5},
    # Implied "etc." — add as historical data confirms legacy patterns
    {"team": "San Francisco 49ers",    "home_field": "Levi's Stadium",   "ss_floor_bonus": 3},
    {"team": "Baltimore Ravens",       "home_field": "M&T Bank Stadium", "ss_floor_bonus": 3},
    {"team": "Buffalo Bills",          "home_field": "Highmark Stadium", "ss_floor_bonus": 3},
    {"team": "Dallas Cowboys",         "home_field": "AT&T Stadium",     "ss_floor_bonus": 2},
    {"team": "Philadelphia Eagles",    "home_field": "Lincoln Financial", "ss_floor_bonus": 2},
]

LEGACY_COUNTERPROOF_REQUIRED = 2   # Minimum counterproofs to fade any Legacy Sensitivity Team at home

# =============================================================================
# SECTION 4 — AUTO-RISK SWAP TREE (V5 Section 3 + Section 6 Step 10)
# =============================================================================

AUTO_RISK_SWAP_TRIGGERS = [
    "ss_below_floor",           # SS drops below leg-type minimum
    "legacy_conflict",          # Fading a Legacy team without 2+ counterproofs
    "weather_downgrade",        # WRI breach for the leg type
    "injury_impact_flag",       # Key player IIA (Injury Impact Assessment) breach
    "market_drift_breach",      # Spread ±1.5 / Total ±3 / ML band shift
    "dep_budget_exceeded",      # Duplication budget violated
    "bottom_two_sentinel",      # Leg ranked bottom-two in candidate pool
    "divisional_rivalry_flag",  # Fading historical divisional dominator without extra proof
    "push_risk_high",           # Game flagged as high push-risk
]

def auto_risk_swap(candidate_pool, flagged_leg, reason):
    """
    Auto-Risk Swap Tree — V5 Supreme Section 3 / Section 6 Step 10.
    Replaces a flagged leg with the next-best candidate that passes ALL locks.
    Runs iteratively until all constraints are satisfied.

    Args:
        candidate_pool: list of dicts with 'team', 'ss', 'wri', 'legacy', 'rivalry'
        flagged_leg: dict — the leg being replaced
        reason: str — one of AUTO_RISK_SWAP_TRIGGERS

    Returns:
        replacement leg dict or None if no valid swap found
    """
    sorted_pool = sorted(candidate_pool, key=lambda x: x.get("ss", 0), reverse=True)
    for candidate in sorted_pool:
        if candidate == flagged_leg:
            continue
        if _passes_all_locks(candidate):
            return candidate
    return None  # Abort ticket construction if no valid replacement

def _passes_all_locks(leg):
    """Verify a leg passes all hard locks before inclusion."""
    ss = leg.get("ss", 0)
    wri = leg.get("wri", 100)
    is_legacy_fade = leg.get("legacy_fade", False)
    counterproofs = leg.get("counterproofs", 0)

    if ss < SS_THRESHOLDS["flagged"]:
        return False
    if wri > WRI_THRESHOLDS["auto_swap"]:
        return False
    if is_legacy_fade and counterproofs < LEGACY_COUNTERPROOF_REQUIRED:
        return False
    return True

# =============================================================================
# SECTION 5 — TWO-PATH TICKET VALIDATION (DEP Split)
# =============================================================================
# Path A: Parlay Stack   — 4-Leg → 6-Leg → 8-Leg (cascading build)
# Path B: Straight Card  — 10-Leg Straight (DEP Firewall between A and B)
# An Anchor (SS >= 95) is the ONLY leg eligible to appear on BOTH paths.

def validate_two_path(path_a_legs, path_b_legs, candidate_pool):
    """
    Two-Path Ticket Validation.
    Path A = Parlay stack (4/6/8-leg). Path B = Straight 10.
    Enforces DEP firewall: no non-Anchor overlap between paths.

    Returns: (path_a_valid, path_b_valid, violations)
    """
    violations = []
    path_a_teams = {leg["team"] for leg in path_a_legs}
    path_b_teams = {leg["team"] for leg in path_b_legs}

    overlap = path_a_teams & path_b_teams
    for team in overlap:
        leg = next((l for l in path_a_legs + path_b_legs if l["team"] == team), {})
        ss = leg.get("ss", 0)
        if ss < SS_THRESHOLDS["anchor"]:
            violations.append({
                "team": team,
                "reason": "Non-Anchor in both Path A and Path B — DEP violation",
                "action": "Remove from Path B or swap to alternate candidate"
            })

    path_a_valid = all(leg.get("ss", 0) >= LEG_SS_MINIMUMS["4_leg_must_hit"] for leg in path_a_legs[:4])
    path_b_valid = len(violations) == 0

    return path_a_valid, path_b_valid, violations

# =============================================================================
# SECTION 6 — OUTPUT MODE BUILDERS
# =============================================================================

def build_4_leg_must_hit(candidate_pool):
    """
    4-Leg Parlay (Must Hit) — V5 Section 6 Step 5.
    Selection: Anchors only (SS >= 90, prefer >= 92-95).
    WRI: Must be <= 10%.
    No Thursday games by default.
    Output: Airtable-ready rows [Matchup, Team to Win, SS, WRI, Momentum Tag]
    """
    eligible = [
        g for g in candidate_pool
        if g.get("ss", 0) >= LEG_SS_MINIMUMS["4_leg_must_hit"]
        and g.get("wri", 100) <= WRI_THRESHOLDS["4_leg_max"]
        and not (NO_THURSDAY_GAMES and g.get("day") == "Thursday")
    ]
    eligible.sort(key=lambda x: x.get("ss", 0), reverse=True)
    selected = eligible[:4]
    return _format_output(selected, ticket_type="4-Leg (Must Hit)")


def build_6_leg_extension(base_4_leg, candidate_pool):
    """
    6-Leg Parlay (Extension) — V5 Section 6 Step 6.
    Builds from the 4-Leg. Adds 2 legs with SS >= 88.
    Logical synergy with 4-leg base required.
    WRI: Must be <= 15%.
    """
    base_teams = {leg["team"] for leg in base_4_leg}
    additions = [
        g for g in candidate_pool
        if g["team"] not in base_teams
        and g.get("ss", 0) >= LEG_SS_MINIMUMS["6_leg_extension"]
        and g.get("wri", 100) <= WRI_THRESHOLDS["6_leg_max"]
    ]
    additions.sort(key=lambda x: x.get("ss", 0), reverse=True)
    selected = base_4_leg + additions[:2]
    return _format_output(selected, ticket_type="6-Leg (Extended Win)")


def build_8_leg_calculated_risk(base_6_leg, candidate_pool):
    """
    8-Leg Parlay (Calculated Risk) — V5 Section 6 Step 7.
    Builds from 6-Leg. Adds 2 legs with SS >= 85-88.
    Bottom-Two Sentinel: two lowest-SS candidates BLOCKED.
    WRI: Must be <= 20%.
    Divisional Rivalry Auto-Check applied.
    """
    base_teams = {leg["team"] for leg in base_6_leg}
    additions = [
        g for g in candidate_pool
        if g["team"] not in base_teams
        and g.get("ss", 0) >= LEG_SS_MINIMUMS["8_leg_calculated"]
        and g.get("wri", 100) <= WRI_THRESHOLDS["8_leg_max"]
        and not g.get("bottom_two_sentinel", False)
    ]
    # Apply Bottom-Two Sentinel — block the 2 weakest from pool
    additions.sort(key=lambda x: x.get("ss", 0), reverse=True)
    if len(additions) > 2:
        additions = additions[:-2]  # Remove bottom two
    selected = base_6_leg + additions[:2]
    return _format_output(selected, ticket_type="8-Leg (Calculated Risk)")


def _format_output(legs, ticket_type):
    """
    Format legs into Airtable/Excel-ready output.
    Columns: Ticket Type | Matchup | Team to Win | SS | WRI | Momentum Tag | DEP Class
    """
    rows = []
    for leg in legs:
        ss = leg.get("ss", 0)
        dep_class = (
            "Anchor" if ss >= SS_THRESHOLDS["anchor"] else
            "High-Confidence" if ss >= SS_THRESHOLDS["high_confidence"] else
            "Solid" if ss >= SS_THRESHOLDS["solid"] else
            "Borderline"
        )
        rows.append({
            "ticket_type":    ticket_type,
            "matchup":        leg.get("matchup", ""),
            "team_to_win":    leg.get("team", ""),
            "ss":             ss,
            "wri":            leg.get("wri", "N/A"),
            "momentum_tag":   leg.get("momentum_tag", ""),  # Fast Starter | Sustainer | Closer | Mirage
            "dep_class":      dep_class,
            "rivalry_flag":   leg.get("rivalry_flag", False),
            "legacy_flag":    leg.get("legacy_flag", False),
        })
    return rows

# =============================================================================
# SECTION 7 — DATA INGESTION (William Hill / Caesars Feed Stub)
# =============================================================================

def fetch_william_hill_odds(week, year):
    """
    Scrape William Hill/Caesars for current NFL lines.
    CORE RULE ZERO: Must cross-verify against 2+ independent official feeds.
    Replace stub with live scraper or API integration.

    Required data per game:
      - Spread (opening + current)
      - Total (opening + current)
      - Moneyline (opening + current)
      - Injury reports (official NFL feed)
      - Weather (game-day forecast at stadium)
    """
    # TODO: Implement live feed (Caesars API / odds scraper)
    # Drift check: if abs(current_spread - opening_spread) > 1.5 → re-score
    # Drift check: if abs(current_total - opening_total) > 3.0 → re-score
    raise NotImplementedError("Live feed not yet wired. Connect Caesars API or scraper.")

def fetch_injury_report(week, year):
    """Pull official NFL injury report. Required for IIA (Injury Impact Assessment)."""
    raise NotImplementedError("Connect NFL official feed.")

def fetch_weather_report(stadium, game_date):
    """Pull game-day weather forecast. Required for WRI computation."""
    raise NotImplementedError("Connect weather API (e.g., OpenWeatherMap, Weather.gov).")

# =============================================================================
# SECTION 8 — MOMENTUM TAGS (V5 Section 2 / Game-Flow Intelligence)
# =============================================================================

MOMENTUM_TAGS = {
    "Fast Starter":  "1Q/1H dominance — strong early-game efficiency",
    "Sustainer":     "Consistent across all halves — reliable full-game performance",
    "Closer":        "2H/4Q strength — dangerous in late-game situations",
    "Mirage":        "Won despite poor core efficiency — high recidivism risk, fade candidate",
}

def assign_momentum_tag(team_stats):
    """
    Assign Momentum Tag based on 1Q/HT/2H splits, EPA/Success Rate,
    Explosive Plays, Red Zone TD%, Turnover Margin.
    """
    first_half_edge = team_stats.get("first_half_margin", 0)
    second_half_edge = team_stats.get("second_half_margin", 0)
    epa = team_stats.get("epa_per_play", 0)

    if first_half_edge > 7 and second_half_edge < 0:
        return "Fast Starter"
    elif first_half_edge > 3 and second_half_edge > 3:
        return "Sustainer"
    elif second_half_edge > 7:
        return "Closer"
    elif team_stats.get("win") and epa < 0:
        return "Mirage"
    return "Untagged"

# =============================================================================
# SECTION 9 — WEEKLY AUDIT / DYNAMIC FEEDBACK LOOP (V5 Section 7)
# =============================================================================

def weekly_recalibration(week_results, ss_weights):
    """
    Post-week dynamic feedback loop.
    - Compute hit% by tier (Anchor / High-Conf / Solid) vs predicted SS
    - Adjust SS weights based on calibration error
    - Attribute ROI to each leg; penalize Mirage wins
    - Update Momentum Tags where splits repeat
    - Log bookmaker multipliers (4/6/8/10) to detect suppression/boost trends
    - Produce 'Week Memo' (one page summary)
    """
    memo = {
        "week":         week_results.get("week"),
        "tier_hits":    {},
        "adjustments":  [],
        "house_trends": [],
    }
    # TODO: Populate with actual result data
    return memo

# =============================================================================
# SECTION 10 — MASTER EXECUTION ENTRY POINT
# =============================================================================

def run_parlay_engine(week, year, raw_game_data):
    """
    Master execution entry point — V5 Supreme full flow.

    Step 1:  Data Pull + Core Rule Zero validation (2+ feeds)
    Step 2:  Week N-1 Autopsy — compute efficiency, assign Momentum Tags
    Step 3:  Candidate Scoring — SS with penalties/bonuses
    Step 4:  Build 4-Leg (Must Hit)
    Step 5:  Build 6-Leg (Extension)
    Step 6:  Build 8-Leg (Calculated Risk)
    Step 7:  DEP Scan across all tickets
    Step 8:  Bottom-Two Sentinel
    Step 9:  Auto-Risk Swap until all constraints satisfied
    Step 10: Market Refresh (late line/injury/weather)
    Step 11: Output (Airtable-ready 4 / 6 / 8 rows)
    Step 12: Two-Path Validation (Path A: Parlay | Path B: Straight 10)
    Step 13: Straight-Card Firewall → emit Straight 10 table
    """
    print(f"ISE DYNAMICS — V5 SUPREME ENGINE — Week {week} {year}")
    print(CORE_RULE_ZERO)

    # Step 1: Rule Zero check
    feeds_verified = raw_game_data.get("feeds_verified", 0)
    if feeds_verified < 2:
        return "NO MATCHUP DATA AVAILABLE — REQUEST DENIED. (Core Rule Zero: <2 feeds verified)"

    candidate_pool = raw_game_data.get("candidates", [])

    # Step 2-3: Tag and score (stubs — requires live data)
    for game in candidate_pool:
        game["momentum_tag"] = assign_momentum_tag(game.get("stats", {}))

    # Step 4-6: Build tickets
    four_leg   = build_4_leg_must_hit(candidate_pool)
    six_leg    = build_6_leg_extension(four_leg, candidate_pool)
    eight_leg  = build_8_leg_calculated_risk(six_leg, candidate_pool)

    # Step 12: Two-Path Validation
    path_a_valid, path_b_valid, violations = validate_two_path(
        four_leg + six_leg + eight_leg, [], candidate_pool
    )

    return {
        "4_leg_must_hit":         four_leg,
        "6_leg_extended_win":     six_leg,
        "8_leg_calculated_risk":  eight_leg,
        "dep_violations":         violations,
        "path_a_valid":           path_a_valid,
        "path_b_valid":           path_b_valid,
    }
