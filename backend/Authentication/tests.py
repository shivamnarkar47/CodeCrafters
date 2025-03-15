import random
import json

def generate_benchmark_data():
    benchmark_stocks = {
        "Nifty 50": ["Reliance Industries", "TCS", "Infosys", "HDFC Bank", "ICICI Bank"],
        "Nifty Bank": ["Axis Bank", "SBI", "Kotak Mahindra Bank", "HDFC Bank", "ICICI Bank"],
        "Sensex": ["L&T", "HUL", "Bharti Airtel", "Maruti Suzuki", "Tata Motors"],
        "Midcap 100": ["AU Small Finance", "Muthoot Finance", "Balkrishna Ind", "Astral", "Coromandel Intl"],
        "Smallcap 100": ["Mazagon Dock", "Indigo Paints", "Borosil", "VST Tillers", "Balaji Amines"]
    }
    
    structured_data = {"benchmarks": []}
    benchmark_id = 1
    
    for benchmark, stocks in benchmark_stocks.items():
        benchmark_entry = {
            "id": benchmark_id,
            "benchmark": benchmark,
            "stocks": []
        }
        
        for stock in stocks:  # Ensure unique stock names per benchmark
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
    
    with open("benchmark_100_data.json", "w") as f:
        json.dump(structured_data, f, indent=2)
    
    print("Data generation complete. Saved as benchmark_100_data.json")

# Run the script
generate_benchmark_data()
