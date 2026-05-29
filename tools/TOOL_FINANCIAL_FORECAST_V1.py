#!/usr/bin/env python3
"""
TOOL_FINANCIAL_FORECAST_V1.py
Prime Pathwy Sovereign Intelligence Engine
Runs rolling 12-month financial projections based on MRR and acquisitions.
Author: Arthur F. Appling Sr.
Version: 1.0.0
"""

import sys
import numpy as np

def project_revenue(current_mrr, growth_rate, churn_rate, acquisition_month, acquired_ebitda, months=12):
    """Calculate monthly recurring revenue and total cumulative cash flow."""
    projections = []
    mrr = current_mrr
    cumulative_cash = 0.0
    
    for month in range(1, months + 1):
        # Apply organic growth and churn
        mrr = mrr * (1 + growth_rate - churn_rate)
        monthly_rev = mrr
        
        # Inject acquired business revenue at the target month
        if month >= acquisition_month:
            monthly_rev += (acquired_ebitda / 12)
            
        cumulative_cash += monthly_rev
        projections.append({
            "month": month,
            "mrr": round(mrr, 2),
            "monthly_revenue": round(monthly_rev, 2),
            "cumulative_cash": round(cumulative_cash, 2)
        })
        
    return projections

def main():
    print("======================================================================")
    print("PRIME PATHWY — SOVEREIGN FINANCIAL FORECASTING MODEL")
    print("======================================================================")
    
    # Standard Parameters
    current_mrr = 25000.00      # $25k starting MRR
    growth_rate = 0.05          # 5% organic growth rate
    churn_rate = 0.01           # 1% organic churn rate
    acquisition_month = 6       # Acquire competitor in Month 6
    acquired_ebitda = 180000.00 # Acquired competitor generates $180k annual EBITDA
    
    projections = project_revenue(current_mrr, growth_rate, churn_rate, acquisition_month, acquired_ebitda)
    
    print(f"Starting MRR: ${current_mrr:,.2f} | Monthly Growth: {growth_rate*100}% | Churn: {churn_rate*100}%")
    print(f"Acquisition Month: {acquisition_month} | Acquired Annual EBITDA: ${acquired_ebitda:,.2f}\n")
    
    print(f"{'Month':<6} | {'Core MRR':<12} | {'Monthly Rev':<15} | {'Cumulative Cash':<15}")
    print("-" * 60)
    
    for p in projections:
        print(f"Month {p['month']:02d} | ${p['mrr']:<10,.2f} | ${p['monthly_revenue']:<13,.2f} | ${p['cumulative_cash']:<13,.2f}")
        
    print("======================================================================")
    print("Sovereign Financial Projections — Confidential Institutional Asset")
    print("======================================================================")

if __name__ == "__main__":
    main()
