export const carMakes = [
  "Audi",
  "BMW",
  "Ford",
  "Mercedes-Benz",
  "Vauxhall",
  "Volkswagen",
  "Nissan",
  "Toyota",
  "Honda",
  "Peugeot",
  "Renault",
  "Citroën",
  "Mazda",
  "Hyundai",
  "Kia",
  "Volvo",
  "Jaguar",
  "Land Rover",
  "Mini",
  "Skoda",
];

export const carModels: Record<string, string[]> = {
  Audi: ["A1", "A3", "A4", "A5", "A6", "Q3", "Q5", "Q7", "TT"],
  BMW: [
    "1 Series",
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "X1",
    "X3",
    "X5",
  ],
  Ford: ["Fiesta", "Focus", "Mondeo", "Kuga", "Puma", "Mustang"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "GLA", "GLC", "GLE"],
  Vauxhall: ["Corsa", "Astra", "Insignia", "Mokka", "Grandland"],
  Volkswagen: ["Polo", "Golf", "Passat", "Tiguan", "T-Roc", "Touareg"],
  Nissan: ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf"],
  Toyota: ["Yaris", "Corolla", "Camry", "RAV4", "C-HR", "Prius"],
  Honda: ["Jazz", "Civic", "Accord", "CR-V", "HR-V"],
  Peugeot: ["108", "208", "308", "2008", "3008", "5008"],
};

export const carYears = Array.from(
  { length: 25 },
  (_, index) => (2025 - index).toString()
);

export const fuelTypes = [
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
  "Plug-in Hybrid",
];

export const engineSizes = [
  "1.0L",
  "1.2L",
  "1.4L",
  "1.6L",
  "1.8L",
  "2.0L",
  "2.2L",
  "2.5L",
  "3.0L",
  "3.5L",
  "4.0L",
  "5.0L+",
];
