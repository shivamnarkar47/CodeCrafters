import random
import json

def generate_bond_data():
    bond_types = [
        "Government Bond", "Corporate Bond", "Municipal Bond", "Treasury Bond", "Junk Bond",
        "Convertible Bond", "High-Yield Bond", "Zero-Coupon Bond", "Inflation-Protected Bond", "Fixed-Rate Bond"
    ]

    structured_data = {"bonds": []}

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
    with open("bonds_data.json", "w") as f:
        json.dump(structured_data, f, indent=2)

    print("Bond data generation complete. Saved as bonds_data.json")

# Run the script
generate_bond_data()
