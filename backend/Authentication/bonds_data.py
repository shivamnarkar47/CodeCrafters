import random
import json

def generate_benchmark_and_bond_data():
    benchmark_stocks = {
        "Nifty 50": ["Reliance Industries", "TCS", "Infosys", "HDFC Bank", "ICICI Bank", "L&T", "HUL", "Bharti Airtel", "Maruti Suzuki", "Tata Motors"],
        "Nifty Bank": ["Axis Bank", "SBI", "Kotak Mahindra Bank", "HDFC Bank", "ICICI Bank", "Federal Bank", "IndusInd Bank", "IDFC First Bank", "PNB", "Bandhan Bank"],
        "Sensex": ["Asian Paints", "Nestle", "HCL Technologies", "Tech Mahindra", "Wipro", "UltraTech Cement", "Grasim", "Dr Reddy's", "Sun Pharma", "Bajaj Auto"],
        "Midcap 100": ["AU Small Finance", "Muthoot Finance", "Balkrishna Ind", "Astral", "Coromandel Intl", "Deepak Nitrite", "L&T Finance", "Coforge", "Voltas", "Zydus Life"],
        "Smallcap 100": ["Mazagon Dock", "Indigo Paints", "Borosil", "VST Tillers", "Balaji Amines", "BSE Ltd", "ITD Cementation", "MCX", "RHI Magnesita", "Fineotex Chem"]
    }
    
    bond_types = ["Government Bond", "Corporate Bond", "Municipal Bond", "Treasury Bond", "Junk Bond"]
    
    structured_data = {"benchmarks": [], "bonds": []}
    benchmark_id = 1
    
    # Generate 100 unique stocks per benchmark
    for benchmark, stocks in benchmark_stocks.items():
        benchmark_entry = {
            "id": benchmark_id,
            "benchmark": benchmark,
            "stocks": []
        }
        
        selected_stocks = random.sample(stocks, min(10, len(stocks)))  # Select 10 unique stocks per benchmark
        
        for stock in selected_stocks:
            for _ in range(10):  # Create 10 different stock entries
                open_price = round(random.uniform(12000, 75000), 2)
                day_high = round(open_price + random.uniform(50, 500), 2)
                day_low = round(open_price - random.uniform(50, 500), 2)
                close_price = round(random.uniform(day_low, day_high), 2)
                buy_price = round(close_price + random.uniform(5, 50), 2)
                sell_price = round(close_price - random.uniform(5, 50), 2)
                current_price = round(random.uniform(day_low, day_high), 2)

                benchmark_entry["stocks"].append({
                    "id": len(benchmark_entry["stocks"]) + 1,
                    "stock": stock,
                    "open": open_price,
                    "day_high": day_high,
                    "day_low": day_low,
                    "close": close_price,
                    "buy_price": buy_price,
                    "sell_price": sell_price,
                    "current_price": current_price
                })
        
        structured_data["benchmarks"].append(benchmark_entry)
        benchmark_id += 1
    
    # Generate 100 unique bonds
    for bond_id in range(1, 101):
        bond_type = random.choice(bond_types)
        bond_price = round(random.uniform(1000, 10000), 2)
        interest_rate = round(random.uniform(2.0, 10.0), 2)
        maturity_years = random.randint(1, 30)
        
        structured_data["bonds"].append({
            "id": bond_id,
            "type": bond_type,
            "price": bond_price,
            "interest_rate": interest_rate,
            "maturity_years": maturity_years
        })
    
    # Save JSON file
    with open("benchmark_bond_data.json", "w") as f:
        json.dump(structured_data, f, indent=2)
    
    print("Data generation complete. Saved as benchmark_bond_data.json")

# Run the script
generate_benchmark_and_bond_data()
