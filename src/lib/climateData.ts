export const nairobiStats2024 = {
  temperature: {
    average: 20.5, // in Celsius
    increase: 1.2, // °C since 1975
    baseline: "1975-2005",
    year: 2024,
  },
  airQuality: {
    pm25: 35.2, // μg/m³
    status: "Moderate",
    mainSources: ["Vehicle emissions", "Industrial emissions", "Dust"]
  },
  wasteManagement: {
    dailyWaste: 2, // million kg per day
    collectionRate: 65, // percentage
    recyclingRate: 8, // percentage
    dumpsites: 2, // major dumpsites
  },
  waterQuality: {
    accessToCleanWater: 85, // percentage
    riverPollution: "High",
    mainPollutants: ["Plastics", "Industrial waste", "Sewage"]
  },
  greenSpaces: {
    coverage: 12, // percentage of city area
    target: 30, // percentage target
    majorParks: ["Nairobi National Park", "Arboretum", "Uhuru Park", "Karura Forest"]
  }
};

export const carbonFootprintFactors = {
  // kg CO2 per unit
  electricity: 0.475, // per kWh
  naturalGas: 2.03, // per therm
  car: 0.404, // per mile (average car)
  flight: {
    short: 0.255, // per mile (<300 miles)
    medium: 0.178, // per mile (300-2300 miles)
    long: 0.151, // per mile (>2300 miles)
  },
  meat: {
    beef: 27, // per kg
    pork: 12, // per kg
    chicken: 6.9, // per kg
  },
  waste: 0.46, // per kg of waste
};

export interface UserProgress {
  points: number;
  streak: number;
  lastActiveDate: string;
  completedModules: string[];
  completedActions: string[];
  quizScores: Record<string, number>;
  achievements: string[];
}

export const achievements = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first action",
    icon: "🌱",
    points: 10,
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Complete a learning module",
    icon: "📚",
    points: 25,
  },
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    points: 50,
  },
  {
    id: "carbon-conscious",
    name: "Carbon Conscious",
    description: "Calculate your carbon footprint",
    icon: "🌍",
    points: 30,
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Score 100% on any quiz",
    icon: "🎓",
    points: 40,
  },
];

export const learningModules = [
  // Beginner Level Modules
  {
    id: "climate-basics",
    title: "Climate Science Fundamentals",
    description: "Understanding the greenhouse effect and carbon cycle",
    duration: "15 min",
    difficulty: "Beginner",
    content: {
      sections: [
        {
          title: "What is Climate Change?",
          text: "Climate change refers to long-term shifts in global temperatures and weather patterns. While natural processes have always caused variations, human activities since the 1800s have been the primary driver of modern climate change.",
        },
        {
          title: "The Greenhouse Effect",
          text: "Earth's atmosphere traps heat from the sun, keeping our planet warm enough for life. Greenhouse gases like CO2, methane, and water vapor create this effect. However, human activities have increased these gases, intensifying the natural greenhouse effect and warming the planet.",
        },
        {
          title: "The Carbon Cycle",
          text: "Carbon naturally cycles through the atmosphere, oceans, soil, and living organisms. Burning fossil fuels releases stored carbon rapidly, disrupting this balance and increasing atmospheric CO2 from 280 ppm (pre-industrial) to 425 ppm today.",
        },
      ],
      keyTakeaways: [
        "Global temperatures have risen 1.45°C since pre-industrial times",
        "Human activities emit ~40 billion tons of CO2 annually",
        "The greenhouse effect is natural, but human activity has amplified it",
      ],
    },
  },
  {
    id: "weather-vs-climate",
    title: "Weather vs Climate",
    description: "Learn the crucial difference between daily weather and long-term climate patterns",
    duration: "12 min",
    difficulty: "Beginner",
    content: {
      sections: [
        {
          title: "Understanding the Difference",
          text: "Weather is what you experience day-to-day: rain, sunshine, wind, temperature. Climate is the average of weather patterns over decades. A cold winter day doesn't disprove climate change; it's the long-term warming trend that matters.",
        },
        {
          title: "Climate Data Collection",
          text: "Scientists collect temperature data from weather stations, satellites, ocean buoys, and ice cores. This data spans over 150 years for surface temperatures and much longer through natural records like tree rings and ice cores.",
        },
        {
          title: "Identifying Trends",
          text: "Climate trends emerge over 30+ year periods. The past decade was the warmest on record, with each of the last four decades warmer than the previous one. This consistent pattern reveals the climate change signal.",
        },
      ],
      keyTakeaways: [
        "Weather is short-term, climate is long-term average",
        "Climate scientists use decades of data to identify trends",
        "Natural variability exists within an overall warming trend",
      ],
    },
  },
  {
    id: "carbon-footprint-intro",
    title: "Your Carbon Footprint",
    description: "Discover what a carbon footprint is and how your daily choices impact the climate",
    duration: "13 min",
    difficulty: "Beginner",
    content: {
      sections: [
        {
          title: "What is a Carbon Footprint?",
          text: "Your carbon footprint is the total greenhouse gas emissions caused by your activities, measured in CO2 equivalents. It includes direct emissions (like driving) and indirect emissions (like electricity use and product manufacturing).",
        },
        {
          title: "Major Contributors",
          text: "Transportation, home energy use, diet, and consumption are the biggest factors. The average person in developed countries emits 10-20 tons of CO2 annually, while the global sustainable target is around 2-3 tons per person.",
        },
        {
          title: "Why It Matters",
          text: "Individual footprints add up to collective impact. Understanding your footprint helps identify where you can make the biggest difference. Small changes across millions of people create significant emissions reductions.",
        },
      ],
      keyTakeaways: [
        "Carbon footprint measures your total greenhouse gas impact",
        "Average footprints in developed nations are 3-10x sustainable levels",
        "Individual actions contribute to collective climate solutions",
      ],
    },
  },
  {
    id: "fossil-fuels",
    title: "Fossil Fuels & Energy",
    description: "Understand how fossil fuels formed and why they're causing climate change",
    duration: "14 min",
    difficulty: "Beginner",
    content: {
      sections: [
        {
          title: "Formation of Fossil Fuels",
          text: "Fossil fuels (coal, oil, natural gas) formed over millions of years from ancient plant and animal remains. Buried under layers of sediment, heat and pressure transformed this organic matter into energy-dense carbon compounds.",
        },
        {
          title: "The Problem with Burning",
          text: "When we burn fossil fuels, we rapidly release carbon that was stored underground for millions of years. This carbon combines with oxygen to form CO2, which accumulates in the atmosphere faster than natural processes can absorb it.",
        },
        {
          title: "Energy Transition",
          text: "Moving from fossil fuels to renewable energy is essential. Solar, wind, and hydroelectric power generate electricity without emissions. Battery technology and grid improvements make renewables increasingly viable replacements.",
        },
      ],
      keyTakeaways: [
        "Fossil fuels release ancient carbon into the atmosphere",
        "80% of global energy still comes from fossil fuels",
        "Renewable energy technology is now cost-competitive",
      ],
    },
  },
  {
    id: "climate-myths",
    title: "Common Climate Myths",
    description: "Debunking misconceptions and understanding the science",
    duration: "16 min",
    difficulty: "Beginner",
    content: {
      sections: [
        {
          title: "Myth: Climate Always Changes",
          text: "True, climate has changed naturally throughout Earth's history. However, current warming is happening 10x faster than historical natural changes and directly correlates with human CO2 emissions. Natural factors alone cannot explain this rapid warming.",
        },
        {
          title: "Myth: Scientists Disagree",
          text: "Over 97% of climate scientists agree humans are causing global warming. This consensus is based on overwhelming evidence from multiple independent data sources worldwide. The science is as settled as gravity or evolution.",
        },
        {
          title: "Myth: It's Too Late",
          text: "While we've already locked in some warming, every fraction of a degree matters. Action now prevents worse outcomes. We have the technology to dramatically reduce emissions; what we need is rapid implementation and political will.",
        },
      ],
      keyTakeaways: [
        "Current warming is unprecedented in speed and human-caused",
        "Scientific consensus on human-caused climate change is overwhelming",
        "It's not too late to prevent the worst impacts",
      ],
    },
  },

  // Intermediate Level Modules
  {
    id: "climate-impacts",
    title: "Climate Change Impacts",
    description: "Real-world effects on ecosystems and communities",
    duration: "20 min",
    difficulty: "Intermediate",
    content: {
      sections: [
        {
          title: "Extreme Weather Events",
          text: "Climate change intensifies extreme weather. In 2024 alone, we saw 127 major heatwaves, 93 severe flooding events, and 78 significant wildfires globally. These events cause loss of life, property damage, and ecosystem destruction.",
        },
        {
          title: "Sea Level Rise",
          text: "Oceans have risen 10.6 cm since 1993, threatening coastal communities. Thermal expansion (warming water takes up more space) and melting ice sheets drive this rise. By 2100, levels could rise 0.3-1 meter, displacing millions.",
        },
        {
          title: "Ecosystem Disruption",
          text: "Rising temperatures force species to migrate or face extinction. Coral reefs, vital ocean ecosystems, are bleaching due to warming waters. Arctic ice loss affects polar bears, seals, and indigenous communities.",
        },
      ],
      keyTakeaways: [
        "1 million species face extinction due to climate change",
        "Small island nations face existential threats from sea level rise",
        "Climate change disproportionately affects vulnerable communities",
      ],
    },
  },
  {
    id: "ocean-acidification",
    title: "Ocean Acidification",
    description: "How CO2 is changing ocean chemistry and marine life",
    duration: "18 min",
    difficulty: "Intermediate",
    content: {
      sections: [
        {
          title: "The Chemistry",
          text: "Oceans absorb about 25% of human CO2 emissions. When CO2 dissolves in seawater, it forms carbonic acid, lowering ocean pH. Since pre-industrial times, ocean pH has dropped by 0.1 units, making oceans 30% more acidic.",
        },
        {
          title: "Impact on Marine Life",
          text: "Acidification dissolves calcium carbonate, which shellfish, corals, and plankton need to build shells and skeletons. Coral reefs are especially vulnerable. Disruption at the base of the food chain affects entire marine ecosystems.",
        },
        {
          title: "Economic and Food Security",
          text: "Over 3 billion people rely on oceans for protein. Shellfish industries face collapse in acidified waters. Coral reef loss threatens coastal protection, tourism, and biodiversity. The economic impact reaches hundreds of billions annually.",
        },
      ],
      keyTakeaways: [
        "Oceans have become 30% more acidic since industrialization",
        "Shellfish and coral reefs face existential threats",
        "Ocean acidification threatens global food security",
      ],
    },
  },
  {
    id: "climate-feedback-loops",
    title: "Climate Feedback Loops",
    description: "Self-reinforcing cycles that accelerate climate change",
    duration: "22 min",
    difficulty: "Intermediate",
    content: {
      sections: [
        {
          title: "Ice-Albedo Feedback",
          text: "White ice reflects sunlight back to space (high albedo). As ice melts, it exposes dark ocean or land, which absorbs more heat, causing more melting. This positive feedback loop accelerates Arctic warming at twice the global rate.",
        },
        {
          title: "Permafrost Thawing",
          text: "Arctic permafrost stores twice as much carbon as the atmosphere. As it thaws, microbes decompose organic matter, releasing CO2 and methane (a potent greenhouse gas). This releases more carbon, causing more warming and thawing.",
        },
        {
          title: "Amazon Rainforest Dieback",
          text: "Drought and deforestation stress the Amazon, potentially transforming it from a carbon sink to a carbon source. Loss of forest cover reduces rainfall, causing more drought and fire risk—another dangerous feedback loop.",
        },
      ],
      keyTakeaways: [
        "Feedback loops can accelerate warming beyond initial predictions",
        "Arctic warming is happening twice as fast as global average",
        "Tipping points may trigger irreversible changes",
      ],
    },
  },
  {
    id: "climate-migration",
    title: "Climate Migration & Justice",
    description: "Understanding climate-induced displacement and equity issues",
    duration: "21 min",
    difficulty: "Intermediate",
    content: {
      sections: [
        {
          title: "Climate Refugees",
          text: "By 2050, 200+ million people may be displaced by climate impacts like sea-level rise, drought, and extreme weather. Small island nations face complete submersion. Many climate migrants have no legal refugee status.",
        },
        {
          title: "Environmental Justice",
          text: "Communities that contributed least to climate change often suffer most. Developing nations face severe impacts with fewer resources to adapt. Within countries, low-income communities and communities of color face disproportionate risks.",
        },
        {
          title: "Loss and Damage",
          text: "Beyond adaptation, some impacts cause irreversible loss. Island nations losing territory, communities losing ancestral lands, species going extinct. Climate finance discussions now include compensation for unavoidable losses.",
        },
      ],
      keyTakeaways: [
        "Climate change is a justice issue affecting vulnerable populations most",
        "200+ million climate migrants projected by 2050",
        "Rich nations have historical responsibility to support adaptation",
      ],
    },
  },
  {
    id: "agriculture-food-security",
    title: "Agriculture & Food Security",
    description: "Climate impacts on farming and global food systems",
    duration: "19 min",
    difficulty: "Intermediate",
    content: {
      sections: [
        {
          title: "Crop Yields and Heat Stress",
          text: "Major crops like wheat, rice, and corn suffer reduced yields above optimal temperatures. Every 1°C of warming reduces wheat yields by 6%. Extreme heat during flowering can cause total crop failure.",
        },
        {
          title: "Water Scarcity",
          text: "Agriculture uses 70% of global freshwater. Climate change alters precipitation patterns, causing droughts in breadbasket regions. Groundwater depletion and glacier melt threaten irrigation systems serving billions.",
        },
        {
          title: "Sustainable Agriculture",
          text: "Regenerative farming, crop diversification, and agroforestry build climate resilience. Reducing food waste (⅓ of production) and shifting toward plant-based diets significantly reduces agriculture's climate impact.",
        },
      ],
      keyTakeaways: [
        "Climate change threatens food security for billions",
        "Agriculture both affects and is affected by climate change",
        "Sustainable practices can reduce emissions while improving resilience",
      ],
    },
  },

  // Advanced Level Modules
  {
    id: "solutions",
    title: "Climate Solutions & Technologies",
    description: "Renewable energy and carbon reduction strategies",
    duration: "25 min",
    difficulty: "Advanced",
    content: {
      sections: [
        {
          title: "Renewable Energy Revolution",
          text: "Solar power capacity grew 28% in 2024 to 1,600 GW globally. Wind energy expanded 22% to 1,050 GW. These clean energy sources now provide 30% of global electricity. Battery storage technology makes renewables more reliable than ever.",
        },
        {
          title: "Carbon Capture & Storage",
          text: "Direct air capture technology removes CO2 from the atmosphere. While still developing, facilities like Climeworks in Iceland capture thousands of tons annually. Enhanced natural solutions include reforestation and soil carbon sequestration.",
        },
        {
          title: "Sustainable Transportation",
          text: "Electric vehicles, public transit, biking, and walking reduce transportation emissions (28% of global emissions). EVs powered by renewable energy produce 70% fewer lifecycle emissions than gas vehicles.",
        },
      ],
      keyTakeaways: [
        "Renewable energy is now cheaper than fossil fuels in most regions",
        "We have the technology to solve climate change; implementation is key",
        "Individual actions combined with policy changes drive systemic change",
      ],
    },
  },
  {
    id: "circular-economy",
    title: "Circular Economy",
    description: "Redesigning production and consumption to eliminate waste",
    duration: "24 min",
    difficulty: "Advanced",
    content: {
      sections: [
        {
          title: "Beyond Linear Economy",
          text: "Traditional 'take-make-dispose' models waste resources and generate emissions. Circular economy redesigns systems for reuse, repair, and recycling. Products are designed for longevity and disassembly, keeping materials in use.",
        },
        {
          title: "Industrial Symbiosis",
          text: "One industry's waste becomes another's input. Steel slag becomes cement, brewery waste becomes animal feed. Industrial symbiosis networks create zero-waste manufacturing hubs, reducing both emissions and costs.",
        },
        {
          title: "Product-as-Service",
          text: "Shifting from ownership to access incentivizes durability. Companies retain ownership and responsibility for products, ensuring quality, repairability, and eventual recycling. This model reduces resource extraction by 30-50%.",
        },
      ],
      keyTakeaways: [
        "Circular economy could reduce industrial emissions by 45%",
        "Design for durability, repair, and recycling from the start",
        "Business model innovation is as important as technology",
      ],
    },
  },
  {
    id: "carbon-pricing",
    title: "Carbon Pricing & Policy",
    description: "Economic mechanisms to reduce emissions at scale",
    duration: "26 min",
    difficulty: "Advanced",
    content: {
      sections: [
        {
          title: "Carbon Tax vs Cap-and-Trade",
          text: "Carbon taxes charge per ton of CO2 emitted, making pollution expensive. Cap-and-trade sets emission limits and allows trading of permits. Both put a price on carbon, incentivizing reduction. Over 60 carbon pricing schemes operate globally.",
        },
        {
          title: "Policy Effectiveness",
          text: "British Columbia's carbon tax reduced emissions 5-15% while maintaining economic growth. EU's emissions trading system covers 40% of emissions. Effective policies include revenue recycling to support vulnerable communities and green investments.",
        },
        {
          title: "Just Transition",
          text: "Moving away from fossil fuels requires supporting affected workers and communities. Just transition policies fund retraining, economic diversification, and social safety nets. Clean energy creates more jobs, but they must be accessible to displaced workers.",
        },
      ],
      keyTakeaways: [
        "Carbon pricing makes emissions expensive, driving clean alternatives",
        "Effective policies balance environmental goals with social equity",
        "Just transition ensures no communities left behind",
      ],
    },
  },
  {
    id: "climate-tech-innovation",
    title: "Climate Tech Innovation",
    description: "Emerging technologies for decarbonization",
    duration: "27 min",
    difficulty: "Advanced",
    content: {
      sections: [
        {
          title: "Green Hydrogen",
          text: "Hydrogen produced using renewable electricity (electrolysis) creates zero-emission fuel. It can decarbonize heavy industry, shipping, and aviation—sectors hard to electrify. Cost must drop 50% to compete with fossil fuels, but investment is accelerating rapidly.",
        },
        {
          title: "Advanced Nuclear",
          text: "Next-generation reactors (small modular reactors, thorium reactors) offer safer, more efficient nuclear power. They provide reliable baseload power to complement variable renewables. Several designs approaching commercialization could transform energy systems.",
        },
        {
          title: "Alternative Proteins",
          text: "Lab-grown meat, plant-based proteins, and precision fermentation could reduce agriculture emissions by 80%. Technologies are reaching price parity with conventional meat. Consumer acceptance and scaling production are key challenges.",
        },
      ],
      keyTakeaways: [
        "Innovation pipeline offers solutions for hard-to-decarbonize sectors",
        "Green hydrogen could transform heavy industry and transport",
        "Technology alone isn't enough; deployment and adoption matter most",
      ],
    },
  },
  {
    id: "climate-finance",
    title: "Climate Finance & Investment",
    description: "Mobilizing capital for climate solutions",
    duration: "23 min",
    difficulty: "Advanced",
    content: {
      sections: [
        {
          title: "The Investment Gap",
          text: "Meeting climate goals requires $3-5 trillion annual investment globally. Current climate finance is ~$600 billion annually. Closing this gap requires redirecting capital from fossil fuels to clean energy, adaptation, and resilience.",
        },
        {
          title: "Green Bonds and ESG",
          text: "Green bonds fund climate-positive projects. ESG (Environmental, Social, Governance) investing integrates climate risk into decisions. Assets under ESG management exceed $35 trillion. However, greenwashing remains a significant concern requiring stronger standards.",
        },
        {
          title: "Development Finance",
          text: "Developing nations need $300 billion annually for climate adaptation. Multilateral development banks, climate funds, and innovative mechanisms like debt-for-climate swaps mobilize resources. Rich nations committed $100 billion annually but delivery has lagged.",
        },
      ],
      keyTakeaways: [
        "Climate investment is massively profitable and necessary",
        "Financial sector must redirect trillions from fossil fuels to solutions",
        "International climate finance is both moral obligation and global security",
      ],
    },
  },
];

export const quizQuestions = {
  "climate-basics": [
    {
      question: "What percentage increase in atmospheric CO2 have we seen since pre-industrial times?",
      options: ["25%", "52%", "75%", "100%"],
      correct: 1,
      explanation: "Atmospheric CO2 has increased from 280 ppm to 425 ppm, a 52% increase driven primarily by fossil fuel combustion.",
    },
    {
      question: "What is the primary human activity contributing to climate change?",
      options: [
        "Agriculture",
        "Deforestation",
        "Burning fossil fuels",
        "Industrial processes",
      ],
      correct: 2,
      explanation: "While all contribute, burning fossil fuels for energy and transportation is the largest source, accounting for about 75% of greenhouse gas emissions.",
    },
    {
      question: "How much has Earth's average temperature increased since pre-industrial times?",
      options: ["0.5°C", "1.45°C", "2.5°C", "3.0°C"],
      correct: 1,
      explanation: "As of 2024, global average temperature has increased approximately 1.45°C, approaching the critical 1.5°C threshold.",
    },
    {
      question: "Which greenhouse gas is most abundant in the atmosphere?",
      options: ["Carbon dioxide", "Methane", "Water vapor", "Nitrous oxide"],
      correct: 2,
      explanation: "Water vapor is the most abundant greenhouse gas, but CO2 is the most important human-influenced greenhouse gas driving climate change.",
    },
    {
      question: "What is the greenhouse effect?",
      options: [
        "A method of growing plants",
        "Atmospheric trapping of heat",
        "Pollution from greenhouses",
        "A type of renewable energy",
      ],
      correct: 1,
      explanation: "The greenhouse effect is the process where atmospheric gases trap heat from the sun, keeping Earth warm enough for life.",
    },
    {
      question: "How many billion tons of CO2 do human activities emit annually?",
      options: ["10 billion", "20 billion", "40 billion", "60 billion"],
      correct: 2,
      explanation: "Human activities emit approximately 40 billion tons of CO2 annually, primarily from burning fossil fuels.",
    },
    {
      question: "What was the pre-industrial atmospheric CO2 level?",
      options: ["180 ppm", "280 ppm", "350 ppm", "425 ppm"],
      correct: 1,
      explanation: "Pre-industrial CO2 levels were around 280 ppm. Today they've reached 425 ppm, a 52% increase.",
    },
    {
      question: "Which natural process removes CO2 from the atmosphere?",
      options: ["Volcanic eruptions", "Ocean evaporation", "Photosynthesis", "Wind erosion"],
      correct: 2,
      explanation: "Photosynthesis in plants and phytoplankton removes CO2 from the atmosphere, but human emissions now exceed this natural removal.",
    },
    {
      question: "What drives the natural carbon cycle?",
      options: [
        "Human industry",
        "Photosynthesis and respiration",
        "Only fossil fuel burning",
        "Solar radiation alone",
      ],
      correct: 1,
      explanation: "The carbon cycle is driven by photosynthesis (removing CO2) and respiration/decomposition (releasing CO2) in a natural balance.",
    },
    {
      question: "Why is current climate change different from past natural changes?",
      options: [
        "It's happening much faster",
        "It's caused by humans",
        "CO2 levels are unprecedented in recent history",
        "All of the above",
      ],
      correct: 3,
      explanation: "Current climate change is unprecedented in its speed, human causation, and the rapid rise in CO2 levels within such a short timeframe.",
    },
  ],
  "weather-vs-climate": [
    {
      question: "What is the main difference between weather and climate?",
      options: [
        "Weather is short-term, climate is long-term",
        "They are the same thing",
        "Weather is global, climate is local",
        "Climate changes daily, weather doesn't",
      ],
      correct: 0,
      explanation: "Weather describes short-term atmospheric conditions, while climate is the average of weather patterns over decades.",
    },
    {
      question: "How long must scientists observe patterns to identify climate trends?",
      options: ["1 year", "5 years", "10 years", "30+ years"],
      correct: 3,
      explanation: "Climate trends emerge over 30+ year periods, which is why scientists need long-term data to distinguish climate change from natural variability.",
    },
    {
      question: "Does a cold winter disprove global warming?",
      options: [
        "Yes, cold weather proves no warming",
        "No, weather varies while climate trends continue",
        "Only if it's the coldest winter ever",
        "Yes, because climate and weather are the same",
      ],
      correct: 1,
      explanation: "A cold winter is a weather event. Climate change refers to long-term trends, which show consistent warming despite short-term variability.",
    },
    {
      question: "What sources do scientists use to collect temperature data?",
      options: [
        "Only weather stations",
        "Only satellites",
        "Weather stations, satellites, ocean buoys, and ice cores",
        "Only computer models",
      ],
      correct: 2,
      explanation: "Scientists use multiple independent sources including weather stations, satellites, ocean buoys, and natural records to ensure accurate climate data.",
    },
    {
      question: "How far back does surface temperature data extend?",
      options: ["20 years", "50 years", "100 years", "150+ years"],
      correct: 3,
      explanation: "Direct surface temperature measurements extend back over 150 years, providing robust data for identifying long-term warming trends.",
    },
    {
      question: "What natural records extend climate data beyond direct measurements?",
      options: ["Newspaper articles", "Tree rings and ice cores", "Old photographs", "Ancient myths"],
      correct: 1,
      explanation: "Tree rings, ice cores, coral growth patterns, and sediment layers preserve climate information going back thousands of years.",
    },
    {
      question: "Which of the following is an example of weather?",
      options: ["Average rainfall over 50 years", "Tomorrow's thunderstorm", "Decade-long drought patterns", "Century-long temperature trends"],
      correct: 1,
      explanation: "Tomorrow's thunderstorm is a weather event—a short-term atmospheric condition. The others describe climate patterns.",
    },
    {
      question: "How have the last four decades compared temperature-wise?",
      options: [
        "Each colder than the previous",
        "No clear pattern",
        "Each warmer than the previous",
        "Exactly the same temperature",
      ],
      correct: 2,
      explanation: "Each of the last four decades has been warmer than the previous one, demonstrating a clear long-term warming trend.",
    },
    {
      question: "Can weather be predicted further ahead than climate trends?",
      options: [
        "Yes, weather is easier to predict long-term",
        "No, climate trends are more predictable over decades",
        "Both are equally predictable",
        "Neither can be predicted",
      ],
      correct: 1,
      explanation: "Paradoxically, long-term climate trends are more predictable than specific weather weeks in advance, because climate reflects energy balance.",
    },
    {
      question: "What does the consistent pattern of warming decades indicate?",
      options: [
        "Natural random variation",
        "A clear climate change signal",
        "Measurement errors",
        "Normal weather patterns",
      ],
      correct: 1,
      explanation: "The consistent pattern of warming decades, observed globally from multiple sources, indicates a clear climate change signal beyond natural variation.",
    },
  ],
  "carbon-footprint-intro": [
    {
      question: "What is a carbon footprint?",
      options: [
        "The size of your shoe",
        "Total greenhouse gas emissions from your activities",
        "Only CO2 from driving",
        "Carbon in the soil",
      ],
      correct: 1,
      explanation: "A carbon footprint is the total greenhouse gas emissions caused by your activities, measured in CO2 equivalents.",
    },
    {
      question: "What is the average carbon footprint in developed countries?",
      options: ["2-3 tons/year", "5-7 tons/year", "10-20 tons/year", "30-40 tons/year"],
      correct: 2,
      explanation: "The average person in developed countries emits 10-20 tons of CO2 annually, far above the sustainable target of 2-3 tons.",
    },
    {
      question: "What is the global sustainable carbon footprint target per person?",
      options: ["1 ton/year", "2-3 tons/year", "10 tons/year", "20 tons/year"],
      correct: 1,
      explanation: "To limit warming to 1.5°C, the global sustainable target is around 2-3 tons of CO2 per person annually.",
    },
    {
      question: "Which of these contributes to your carbon footprint?",
      options: ["Only driving", "Only electricity", "Only food", "All of the above plus more"],
      correct: 3,
      explanation: "Your carbon footprint includes transportation, home energy, diet, consumption, and more—all activities that generate greenhouse gases.",
    },
    {
      question: "What are indirect emissions?",
      options: [
        "Emissions from your car",
        "Emissions from manufacturing products you buy",
        "Only factory smokestacks",
        "Emissions from other countries",
      ],
      correct: 1,
      explanation: "Indirect emissions come from the production, transportation, and disposal of goods you consume, even if you don't directly burn the fuel.",
    },
    {
      question: "Why does individual carbon footprint matter?",
      options: [
        "It doesn't matter at all",
        "Individual actions add up to collective impact",
        "Only governments can make a difference",
        "Personal footprints are too small to count",
      ],
      correct: 1,
      explanation: "Individual footprints add up to collective impact. Millions of people making changes create significant emissions reductions.",
    },
    {
      question: "Which sector is typically the largest contributor to personal carbon footprints?",
      options: ["Food", "Transportation", "Home energy", "Varies by individual"],
      correct: 3,
      explanation: "The largest contributor varies by individual based on lifestyle—some drive extensively, others heat large homes or fly frequently.",
    },
    {
      question: "What does measuring your footprint help you do?",
      options: [
        "Nothing useful",
        "Identify where you can make the biggest difference",
        "Feel guilty only",
        "Compare with friends only",
      ],
      correct: 1,
      explanation: "Measuring your footprint helps identify where you can make the biggest difference, focusing efforts on high-impact changes.",
    },
    {
      question: "Does reducing your carbon footprint require completely giving up modern life?",
      options: [
        "Yes, you must live in a cave",
        "No, strategic changes in key areas make huge differences",
        "Yes, no electricity allowed",
        "Only if you want to be perfect",
      ],
      correct: 1,
      explanation: "Reducing your footprint doesn't require extreme sacrifice—strategic changes in transportation, energy, and diet make huge differences.",
    },
    {
      question: "How does the carbon footprint concept help climate action?",
      options: [
        "It doesn't help",
        "Makes climate change personal and actionable",
        "Only helps corporations avoid responsibility",
        "Creates guilt without solutions",
      ],
      correct: 1,
      explanation: "The carbon footprint concept makes climate change personal and actionable, showing how individual choices contribute to solutions.",
    },
  ],
  "fossil-fuels": [
    {
      question: "How long did it take for fossil fuels to form?",
      options: ["Decades", "Centuries", "Thousands of years", "Millions of years"],
      correct: 3,
      explanation: "Fossil fuels formed over millions of years from ancient plant and animal remains buried under sediment.",
    },
    {
      question: "What percentage of global energy comes from fossil fuels?",
      options: ["30%", "50%", "65%", "80%"],
      correct: 3,
      explanation: "Approximately 80% of global energy still comes from fossil fuels (coal, oil, and natural gas).",
    },
    {
      question: "What happens when we burn fossil fuels?",
      options: [
        "Carbon is destroyed",
        "Ancient carbon is rapidly released as CO2",
        "New carbon is created",
        "Carbon returns underground",
      ],
      correct: 1,
      explanation: "Burning fossil fuels rapidly releases carbon stored for millions of years, adding CO2 to the atmosphere faster than natural processes can absorb it.",
    },
    {
      question: "Why can't natural processes absorb all our CO2 emissions?",
      options: [
        "Natural processes don't absorb CO2",
        "We're releasing carbon much faster than it can be absorbed",
        "The oceans are full",
        "Plants stopped photosynthesis",
      ],
      correct: 1,
      explanation: "We're releasing carbon accumulated over millions of years in just decades—far faster than natural absorption processes can handle.",
    },
    {
      question: "Which renewable energy sources are mentioned as replacements?",
      options: [
        "Only solar",
        "Only wind",
        "Solar, wind, and hydroelectric",
        "Nuclear only",
      ],
      correct: 2,
      explanation: "Solar, wind, and hydroelectric power all generate electricity without emissions and are increasingly viable fossil fuel replacements.",
    },
    {
      question: "Are renewable energy sources cost-competitive with fossil fuels?",
      options: [
        "No, much more expensive",
        "Yes, now cost-competitive in many regions",
        "Only in sunny areas",
        "Only with massive subsidies",
      ],
      correct: 1,
      explanation: "Renewable energy is now cost-competitive with fossil fuels in most regions, and costs continue to decline.",
    },
    {
      question: "What forms when carbon from burning fossil fuels combines with oxygen?",
      options: ["Water", "Carbon dioxide (CO2)", "Methane", "Ozone"],
      correct: 1,
      explanation: "When we burn fossil fuels, carbon combines with oxygen to form CO2, the primary greenhouse gas driving climate change.",
    },
    {
      question: "What makes battery technology important for renewable energy?",
      options: [
        "Batteries produce energy",
        "Batteries make renewables more reliable by storing energy",
        "Batteries replace solar panels",
        "Batteries are just for phones",
      ],
      correct: 1,
      explanation: "Battery technology stores renewable energy for use when the sun isn't shining or wind isn't blowing, making renewables more reliable.",
    },
    {
      question: "What transformed organic matter into fossil fuels?",
      options: ["Fire", "Heat and pressure over millions of years", "Water", "Wind"],
      correct: 1,
      explanation: "Buried under sediment, heat and pressure transformed ancient organic matter into energy-dense fossil fuels over millions of years.",
    },
    {
      question: "Why is transitioning away from fossil fuels essential?",
      options: [
        "They're expensive",
        "They release ancient carbon causing climate change",
        "They're running out next year",
        "Because it's trendy",
      ],
      correct: 1,
      explanation: "Transitioning away from fossil fuels is essential because burning them releases ancient carbon, causing dangerous climate change.",
    },
  ],
  "climate-myths": [
    {
      question: "What percentage of climate scientists agree humans are causing global warming?",
      options: ["50%", "75%", "85%", "97%+"],
      correct: 3,
      explanation: "Over 97% of climate scientists agree humans are causing global warming, based on overwhelming evidence from multiple independent sources.",
    },
    {
      question: "How fast is current warming compared to natural historical changes?",
      options: [
        "Same speed",
        "2x faster",
        "5x faster",
        "10x faster",
      ],
      correct: 3,
      explanation: "Current warming is happening approximately 10 times faster than historical natural changes, which is why we know it's human-caused.",
    },
    {
      question: "Can natural factors alone explain current warming?",
      options: [
        "Yes, it's just natural cycles",
        "No, current warming correlates directly with human emissions",
        "Maybe, scientists aren't sure",
        "Yes, it's just the sun",
      ],
      correct: 1,
      explanation: "Natural factors alone cannot explain current warming. It correlates directly with human CO2 emissions and exceeds natural variability.",
    },
    {
      question: "Is climate science as settled as other scientific theories?",
      options: [
        "No, it's just speculation",
        "Yes, as settled as gravity or evolution",
        "Scientists completely disagree",
        "No one really knows",
      ],
      correct: 1,
      explanation: "Climate science is as settled as gravity or evolution, based on over a century of research and overwhelming evidence from multiple disciplines.",
    },
    {
      question: "Is it too late to prevent all climate impacts?",
      options: [
        "Yes, completely hopeless",
        "No, but every fraction of a degree prevented matters",
        "Yes, we're past the point of no return",
        "Climate change isn't real",
      ],
      correct: 1,
      explanation: "While we've locked in some warming, it's not too late. Every fraction of a degree matters, and rapid action can prevent the worst outcomes.",
    },
    {
      question: "Do we have the technology to dramatically reduce emissions?",
      options: [
        "No, we need new inventions",
        "Yes, we have the technology; implementation is key",
        "Technology can't solve this",
        "Only future technology will work",
      ],
      correct: 1,
      explanation: "We already have the technology to dramatically reduce emissions. What we need now is rapid implementation and political will.",
    },
    {
      question: "Has climate naturally changed in the past?",
      options: [
        "No, climate was always stable",
        "Yes, but current change is unprecedented in speed and human-caused",
        "Yes, so current change is nothing unusual",
        "Only during ice ages",
      ],
      correct: 1,
      explanation: "Yes, climate has changed naturally, but current warming is unprecedented in speed, extent, and is directly caused by human activities.",
    },
    {
      question: "What do scientists use to confirm human-caused warming?",
      options: [
        "Just computer models",
        "Multiple independent data sources worldwide",
        "Only temperature records",
        "Political opinions",
      ],
      correct: 1,
      explanation: "Scientists use multiple independent data sources including temperature records, ice cores, ocean measurements, and satellite data worldwide.",
    },
    {
      question: "If scientists disagreed, would that disprove climate change?",
      options: [
        "Yes, any disagreement disproves it",
        "No, the overwhelming consensus is what matters",
        "Yes, science requires 100% agreement",
        "Scientists always disagree on everything",
      ],
      correct: 1,
      explanation: "Minor disagreements on details exist in all science. What matters is the overwhelming consensus on the fundamental facts of human-caused warming.",
    },
    {
      question: "What prevents the worst climate outcomes?",
      options: [
        "Nothing, it's inevitable",
        "Rapid implementation of existing solutions",
        "Waiting for a miracle technology",
        "Hoping it goes away",
      ],
      correct: 1,
      explanation: "Preventing the worst outcomes requires rapid implementation of existing solutions—renewable energy, efficiency, sustainable practices, and policy changes.",
    },
  ],
  "climate-impacts": [
    {
      question: "How many major heatwave events occurred globally in 2024?",
      options: ["78", "93", "127", "150"],
      correct: 2,
      explanation: "2024 saw 127 major heatwaves globally, demonstrating the increasing frequency of extreme heat events due to climate change.",
    },
    {
      question: "How much has sea level risen since 1993?",
      options: ["5.2 cm", "10.6 cm", "15.8 cm", "20.3 cm"],
      correct: 1,
      explanation: "Oceans have risen 10.6 cm since 1993, driven by thermal expansion and melting ice sheets, threatening coastal communities worldwide.",
    },
    {
      question: "How many species face extinction due to climate change?",
      options: ["100,000", "500,000", "1 million", "5 million"],
      correct: 2,
      explanation: "Approximately 1 million species face extinction due to climate change and habitat loss, representing an unprecedented biodiversity crisis.",
    },
    {
      question: "What drives sea level rise?",
      options: [
        "Only melting glaciers",
        "Only thermal expansion",
        "Both thermal expansion and melting ice",
        "Underwater volcanoes",
      ],
      correct: 2,
      explanation: "Sea level rise is driven by both thermal expansion (warming water takes up more space) and melting ice sheets and glaciers.",
    },
    {
      question: "By 2100, how much could sea levels rise?",
      options: ["5-10 cm", "20-30 cm", "30-100 cm", "200 cm"],
      correct: 2,
      explanation: "By 2100, sea levels could rise 30-100 cm (0.3-1 meter) depending on emissions, potentially displacing millions of people.",
    },
    {
      question: "What is happening to coral reefs?",
      options: [
        "Growing rapidly",
        "Bleaching due to warming waters",
        "Moving to deeper water",
        "Unaffected by climate change",
      ],
      correct: 1,
      explanation: "Coral reefs are experiencing widespread bleaching due to warming waters, threatening vital ocean ecosystems and the species that depend on them.",
    },
    {
      question: "How many severe flooding events occurred in 2024?",
      options: ["45", "67", "93", "112"],
      correct: 2,
      explanation: "2024 saw 93 severe flooding events globally, reflecting intensified precipitation patterns due to climate change.",
    },
    {
      question: "Which communities are disproportionately affected by climate change?",
      options: [
        "Rich communities only",
        "Vulnerable and low-income communities",
        "All communities equally",
        "Only island nations",
      ],
      correct: 1,
      explanation: "Climate change disproportionately affects vulnerable communities, including low-income populations, indigenous peoples, and developing nations.",
    },
    {
      question: "How many significant wildfires occurred globally in 2024?",
      options: ["45", "78", "105", "134"],
      correct: 1,
      explanation: "2024 saw 78 significant wildfires globally, with climate change creating conditions for more frequent and intense fires.",
    },
    {
      question: "What happens to species as temperatures rise?",
      options: [
        "They adapt instantly",
        "They migrate or face extinction",
        "Nothing changes",
        "They all become extinct immediately",
      ],
      correct: 1,
      explanation: "Rising temperatures force species to migrate to cooler areas or face extinction if they cannot adapt or migrate quickly enough.",
    },
  ],
  "ocean-acidification": [
    {
      question: "What percentage of human CO2 emissions do oceans absorb?",
      options: ["10%", "25%", "50%", "75%"],
      correct: 1,
      explanation: "Oceans absorb about 25% of human CO2 emissions, which helps slow atmospheric warming but causes ocean acidification.",
    },
    {
      question: "By how much has ocean pH dropped since pre-industrial times?",
      options: ["0.01 units", "0.1 units", "0.5 units", "1.0 unit"],
      correct: 1,
      explanation: "Ocean pH has dropped by 0.1 units since pre-industrial times, making oceans 30% more acidic (pH is logarithmic).",
    },
    {
      question: "How much more acidic are oceans now compared to pre-industrial times?",
      options: ["10%", "20%", "30%", "50%"],
      correct: 2,
      explanation: "Oceans are now 30% more acidic than in pre-industrial times due to absorbed CO2 forming carbonic acid.",
    },
    {
      question: "What forms when CO2 dissolves in seawater?",
      options: ["Oxygen", "Carbonic acid", "Salt", "Sugar"],
      correct: 1,
      explanation: "When CO2 dissolves in seawater, it forms carbonic acid, which lowers ocean pH and makes water more acidic.",
    },
    {
      question: "What does acidification dissolve that marine life needs?",
      options: ["Sodium chloride", "Calcium carbonate", "Iron oxide", "Silicon dioxide"],
      correct: 1,
      explanation: "Acidification dissolves calcium carbonate, which shellfish, corals, and plankton need to build shells and skeletons.",
    },
    {
      question: "How many people rely on oceans for protein?",
      options: ["500 million", "1 billion", "2 billion", "3+ billion"],
      correct: 3,
      explanation: "Over 3 billion people rely on oceans as a primary source of protein, making ocean health critical for global food security.",
    },
    {
      question: "Which marine organisms are especially vulnerable to acidification?",
      options: [
        "Large fish only",
        "Shellfish, corals, and plankton",
        "Whales and dolphins",
        "Seaweed",
      ],
      correct: 1,
      explanation: "Shellfish, corals, and plankton are especially vulnerable because they need calcium carbonate to build shells and skeletons.",
    },
    {
      question: "What happens when the base of the marine food chain is disrupted?",
      options: [
        "Nothing significant",
        "Only small fish are affected",
        "Entire marine ecosystems are affected",
        "Only coral reefs are affected",
      ],
      correct: 2,
      explanation: "Disruption at the base of the food chain (plankton) affects entire marine ecosystems, as larger species depend on these organisms.",
    },
    {
      question: "What is the economic impact of ocean acidification?",
      options: [
        "Minimal",
        "A few million dollars",
        "Hundreds of billions annually",
        "Only affects poor countries",
      ],
      correct: 2,
      explanation: "Ocean acidification's economic impact reaches hundreds of billions annually through fisheries collapse, reef loss, and coastal protection.",
    },
    {
      question: "Why are coral reefs particularly vulnerable?",
      options: [
        "They're only in warm water",
        "They depend on calcium carbonate for structure",
        "They're too old",
        "They're not actually vulnerable",
      ],
      correct: 1,
      explanation: "Coral reefs build their structures from calcium carbonate, which dissolves in acidified water, making them extremely vulnerable.",
    },
  ],
  "climate-feedback-loops": [
    {
      question: "What is the ice-albedo feedback?",
      options: [
        "Ice creates more ice",
        "Melting ice exposes dark surfaces that absorb more heat",
        "Ice reflects heat into space forever",
        "Ice prevents all warming",
      ],
      correct: 1,
      explanation: "As ice melts, it exposes dark ocean or land that absorbs more heat than reflective white ice, causing more melting in a self-reinforcing loop.",
    },
    {
      question: "How much faster is Arctic warming compared to global average?",
      options: ["Same speed", "50% faster", "Twice as fast", "Ten times as fast"],
      correct: 2,
      explanation: "Arctic warming is happening twice as fast as the global average, largely due to the ice-albedo feedback loop.",
    },
    {
      question: "How much carbon is stored in Arctic permafrost?",
      options: [
        "Same as atmosphere",
        "Half of atmosphere",
        "Twice as much as atmosphere",
        "Very little",
      ],
      correct: 2,
      explanation: "Arctic permafrost stores twice as much carbon as the entire atmosphere, posing a massive threat if released through thawing.",
    },
    {
      question: "What happens when permafrost thaws?",
      options: [
        "Nothing significant",
        "Microbes decompose organic matter, releasing CO2 and methane",
        "Carbon is absorbed by soil",
        "It immediately refreezes",
      ],
      correct: 1,
      explanation: "When permafrost thaws, microbes decompose previously frozen organic matter, releasing CO2 and methane (a potent greenhouse gas).",
    },
    {
      question: "What is the Amazon rainforest feedback risk?",
      options: [
        "More rain will make it grow",
        "Drought and deforestation could transform it from carbon sink to source",
        "It will stay the same forever",
        "It will expand naturally",
      ],
      correct: 1,
      explanation: "Drought and deforestation stress the Amazon, potentially transforming it from a carbon sink to a carbon source in a dangerous feedback loop.",
    },
    {
      question: "What are tipping points?",
      options: [
        "Normal climate variations",
        "Thresholds that trigger irreversible changes",
        "Times when climate stops changing",
        "Points where everything reverses",
      ],
      correct: 1,
      explanation: "Tipping points are thresholds beyond which climate systems change fundamentally and may be difficult or impossible to reverse.",
    },
    {
      question: "Why do feedback loops make climate change more dangerous?",
      options: [
        "They don't affect anything",
        "They can accelerate warming beyond initial predictions",
        "They always reverse warming",
        "They only affect polar regions",
      ],
      correct: 1,
      explanation: "Feedback loops can accelerate warming beyond initial predictions by creating self-reinforcing cycles that amplify the original warming.",
    },
    {
      question: "What happens as Amazon forest cover decreases?",
      options: [
        "Rainfall increases",
        "Rainfall decreases, causing more drought and fire risk",
        "Nothing changes",
        "Other forests grow bigger",
      ],
      correct: 1,
      explanation: "Loss of forest cover reduces rainfall (trees generate rain), causing more drought and fire risk in another dangerous feedback loop.",
    },
    {
      question: "Is methane a more potent greenhouse gas than CO2?",
      options: [
        "No, methane is weaker",
        "Yes, methane is much more potent",
        "They're exactly equal",
        "Methane isn't a greenhouse gas",
      ],
      correct: 1,
      explanation: "Methane is over 25 times more potent than CO2 as a greenhouse gas over a 100-year period, making permafrost methane release particularly dangerous.",
    },
    {
      question: "What does 'albedo' mean?",
      options: [
        "Ice temperature",
        "Reflectivity of a surface",
        "Ice thickness",
        "Snow depth",
      ],
      correct: 1,
      explanation: "Albedo is the reflectivity of a surface. White ice has high albedo (reflects heat), while dark ocean has low albedo (absorbs heat).",
    },
  ],
  "climate-migration": [
    {
      question: "How many people may be displaced by climate impacts by 2050?",
      options: ["50 million", "100 million", "200+ million", "500 million"],
      correct: 2,
      explanation: "By 2050, over 200 million people may be displaced by climate impacts like sea-level rise, drought, and extreme weather.",
    },
    {
      question: "Do climate migrants have legal refugee status?",
      options: [
        "Yes, always",
        "Many have no legal refugee status",
        "Only in some countries",
        "All are recognized as refugees",
      ],
      correct: 1,
      explanation: "Many climate migrants have no legal refugee status under current international law, leaving them vulnerable and without protection.",
    },
    {
      question: "Which nations face complete submersion from sea-level rise?",
      options: [
        "No nations face this",
        "Small island nations",
        "All coastal nations",
        "Only unpopulated islands",
      ],
      correct: 1,
      explanation: "Small island nations like Tuvalu and the Maldives face complete submersion from sea-level rise, forcing entire populations to relocate.",
    },
    {
      question: "Who typically suffers most from climate impacts?",
      options: [
        "Those who contributed most to emissions",
        "Communities that contributed least to climate change",
        "Everyone suffers equally",
        "Only wealthy nations",
      ],
      correct: 1,
      explanation: "Communities that contributed least to climate change often suffer most, making it a profound justice issue requiring global responsibility.",
    },
    {
      question: "How are climate impacts distributed globally?",
      options: [
        "Equally everywhere",
        "Only affect poor nations",
        "Disproportionately affect vulnerable communities",
        "Only affect wealthy nations",
      ],
      correct: 2,
      explanation: "Climate impacts disproportionately affect vulnerable communities, including developing nations and marginalized groups within all countries.",
    },
    {
      question: "What is 'loss and damage' in climate discussions?",
      options: [
        "Property insurance",
        "Compensation for unavoidable irreversible losses",
        "Natural disaster cleanup",
        "War reparations",
      ],
      correct: 1,
      explanation: "Loss and damage refers to compensation for unavoidable, irreversible impacts like lost territory, cultural heritage, and species extinction.",
    },
    {
      question: "Within countries, who faces disproportionate climate risks?",
      options: [
        "Wealthy communities",
        "Everyone equally",
        "Low-income and marginalized communities",
        "Rural areas only",
      ],
      correct: 2,
      explanation: "Within countries, low-income and marginalized communities face disproportionate risks due to less resources, worse housing, and vulnerable locations.",
    },
    {
      question: "Why is climate change considered a justice issue?",
      options: [
        "It's not a justice issue",
        "Affects vulnerable populations most despite contributing least",
        "Everyone is affected equally",
        "Only because of legal disputes",
      ],
      correct: 1,
      explanation: "Climate change is a justice issue because vulnerable populations suffer most despite contributing least to the problem.",
    },
    {
      question: "What do some island nations face losing?",
      options: [
        "Just some coastal areas",
        "Their entire territory and sovereignty",
        "Nothing significant",
        "Only beaches",
      ],
      correct: 1,
      explanation: "Some island nations face losing their entire territory and sovereignty to sea-level rise, unprecedented in modern history.",
    },
    {
      question: "What responsibility do rich nations have in climate action?",
      options: [
        "No special responsibility",
        "Historical responsibility to support adaptation",
        "Same as everyone else",
        "Only to protect themselves",
      ],
      correct: 1,
      explanation: "Rich nations have historical responsibility to support adaptation in vulnerable countries, having contributed most to cumulative emissions.",
    },
  ],
  "agriculture-food-security": [
    {
      question: "By what percentage do wheat yields decrease for every 1°C of warming?",
      options: ["2%", "6%", "10%", "15%"],
      correct: 1,
      explanation: "Every 1°C of warming reduces wheat yields by approximately 6%, threatening food security in many regions.",
    },
    {
      question: "What percentage of global freshwater does agriculture use?",
      options: ["30%", "50%", "70%", "90%"],
      correct: 2,
      explanation: "Agriculture uses about 70% of global freshwater, making climate-driven water scarcity especially threatening to food production.",
    },
    {
      question: "What fraction of food produced is wasted?",
      options: ["1/10", "1/5", "1/3", "1/2"],
      correct: 2,
      explanation: "Approximately one-third of all food produced globally is wasted, representing a massive opportunity to reduce agriculture's climate impact.",
    },
    {
      question: "What major crops are threatened by heat stress?",
      options: [
        "Only wheat",
        "Wheat, rice, and corn",
        "Only vegetables",
        "No major crops affected",
      ],
      correct: 1,
      explanation: "Major staple crops including wheat, rice, and corn all suffer reduced yields above optimal temperatures, threatening global food security.",
    },
    {
      question: "What happens when extreme heat occurs during crop flowering?",
      options: [
        "Crops grow faster",
        "Nothing significant",
        "Can cause total crop failure",
        "Yields increase",
      ],
      correct: 2,
      explanation: "Extreme heat during the critical flowering period can cause total crop failure, as reproduction is disrupted.",
    },
    {
      question: "How does climate change affect precipitation patterns?",
      options: [
        "Makes them more consistent",
        "Alters patterns, causing droughts in key agricultural regions",
        "Increases rain everywhere",
        "No effect on precipitation",
      ],
      correct: 1,
      explanation: "Climate change alters precipitation patterns, causing droughts in important breadbasket regions and floods elsewhere.",
    },
    {
      question: "What threatens irrigation systems serving billions?",
      options: [
        "Too much rain",
        "Groundwater depletion and glacier melt",
        "Improved technology",
        "Nothing threatens them",
      ],
      correct: 1,
      explanation: "Groundwater depletion and glacier melt threaten irrigation systems that billions depend on for food production.",
    },
    {
      question: "What agricultural practices build climate resilience?",
      options: [
        "Monoculture only",
        "Regenerative farming, crop diversification, agroforestry",
        "Increased pesticide use",
        "Clearing more land",
      ],
      correct: 1,
      explanation: "Regenerative farming, crop diversification, and agroforestry build climate resilience while reducing environmental impact.",
    },
    {
      question: "How can reducing food waste help climate action?",
      options: [
        "It can't help",
        "Significantly reduces agriculture's climate impact",
        "Only helps a little",
        "Makes things worse",
      ],
      correct: 1,
      explanation: "Reducing food waste significantly reduces agriculture's climate impact by avoiding unnecessary production, land use, and emissions.",
    },
    {
      question: "Does shifting toward plant-based diets reduce agriculture's climate impact?",
      options: [
        "No effect",
        "Yes, significantly reduces impact",
        "Makes it worse",
        "Only helps marginally",
      ],
      correct: 1,
      explanation: "Shifting toward plant-based diets significantly reduces agriculture's climate impact, as animal agriculture is extremely resource-intensive.",
    },
  ],
  "solutions": [
    {
      question: "By what percentage did solar power capacity grow in 2024?",
      options: ["15%", "22%", "28%", "35%"],
      correct: 2,
      explanation: "Solar power capacity grew by 28% in 2024, reaching 1,600 GW globally, demonstrating the rapid acceleration of clean energy adoption.",
    },
    {
      question: "What percentage of global emissions comes from transportation?",
      options: ["15%", "20%", "28%", "35%"],
      correct: 2,
      explanation: "Transportation accounts for approximately 28% of global greenhouse gas emissions, making it a critical sector for climate action.",
    },
    {
      question: "What percentage of global electricity comes from renewables?",
      options: ["10%", "20%", "30%", "50%"],
      correct: 2,
      explanation: "Renewable energy sources now provide approximately 30% of global electricity, up from just 20% a decade ago.",
    },
    {
      question: "How much fewer lifecycle emissions do EVs powered by renewables produce?",
      options: ["20%", "40%", "70%", "90%"],
      correct: 2,
      explanation: "Electric vehicles powered by renewable energy produce 70% fewer lifecycle emissions than gas vehicles.",
    },
    {
      question: "What is wind energy's global capacity?",
      options: ["500 GW", "850 GW", "1,050 GW", "1,500 GW"],
      correct: 2,
      explanation: "Wind energy capacity reached 1,050 GW globally in 2024, growing 22% and providing clean electricity to millions.",
    },
    {
      question: "Is renewable energy now cheaper than fossil fuels?",
      options: [
        "No, much more expensive",
        "Yes, in most regions",
        "Only in sunny places",
        "Never will be cheaper",
      ],
      correct: 1,
      explanation: "Renewable energy is now cheaper than fossil fuels in most regions, making the transition economically favorable.",
    },
    {
      question: "What does direct air capture technology do?",
      options: [
        "Captures water",
        "Removes CO2 from the atmosphere",
        "Generates electricity",
        "Purifies air of pollutants only",
      ],
      correct: 1,
      explanation: "Direct air capture technology removes CO2 directly from the atmosphere, though it's still developing and energy-intensive.",
    },
    {
      question: "What makes battery storage important for renewables?",
      options: [
        "Makes them look better",
        "Makes renewables more reliable",
        "Generates extra power",
        "Reduces costs only",
      ],
      correct: 1,
      explanation: "Battery storage makes renewables more reliable by storing energy when production exceeds demand and releasing it when needed.",
    },
    {
      question: "What natural solutions help sequester carbon?",
      options: [
        "Only technology works",
        "Reforestation and soil carbon sequestration",
        "Nothing natural works",
        "Only ocean solutions",
      ],
      correct: 1,
      explanation: "Natural solutions like reforestation and soil carbon sequestration complement technological approaches to remove CO2 from the atmosphere.",
    },
    {
      question: "What do we need for climate solutions to work?",
      options: [
        "Only new technology",
        "Implementation of existing solutions and policy changes",
        "Waiting for miracles",
        "Nothing, it's hopeless",
      ],
      correct: 1,
      explanation: "We have the technology; what we need is rapid implementation of existing solutions combined with strong policy changes and political will.",
    },
  ],
  "circular-economy": [
    {
      question: "What is the traditional linear economy model?",
      options: [
        "Make-reuse-recycle",
        "Take-make-dispose",
        "Reduce-reuse-recycle",
        "Buy-keep-repair",
      ],
      correct: 1,
      explanation: "The traditional linear economy follows a 'take-make-dispose' model that wastes resources and generates emissions.",
    },
    {
      question: "By what percentage could circular economy reduce industrial emissions?",
      options: ["15%", "25%", "45%", "65%"],
      correct: 2,
      explanation: "Circular economy approaches could reduce industrial emissions by approximately 45% through reuse, repair, and recycling.",
    },
    {
      question: "What is industrial symbiosis?",
      options: [
        "Factories working together",
        "One industry's waste becomes another's input",
        "Shared ownership",
        "International trade",
      ],
      correct: 1,
      explanation: "Industrial symbiosis is when one industry's waste becomes another's input, creating zero-waste manufacturing networks.",
    },
    {
      question: "What does product-as-service model incentivize?",
      options: [
        "Planned obsolescence",
        "Durability and repairability",
        "Cheaper products",
        "More consumption",
      ],
      correct: 1,
      explanation: "Product-as-service models incentivize durability and repairability because companies retain ownership and responsibility for products.",
    },
    {
      question: "How much can product-as-service models reduce resource extraction?",
      options: ["10-20%", "30-50%", "60-70%", "80-90%"],
      correct: 1,
      explanation: "Product-as-service models can reduce resource extraction by 30-50% by maximizing product longevity and utilization.",
    },
    {
      question: "What principle guides circular economy design?",
      options: [
        "Cheapest materials",
        "Design for durability, repair, and recycling from the start",
        "Single-use convenience",
        "Maximum profit only",
      ],
      correct: 1,
      explanation: "Circular economy requires designing for durability, repair, and recycling from the start, not as an afterthought.",
    },
    {
      question: "What happens in zero-waste manufacturing hubs?",
      options: [
        "All waste goes to landfill",
        "Materials cycle between industries",
        "Waste is exported",
        "Nothing special",
      ],
      correct: 1,
      explanation: "In zero-waste manufacturing hubs, materials cycle between industries through industrial symbiosis, eliminating waste.",
    },
    {
      question: "What does circular economy redesign?",
      options: [
        "Only products",
        "Entire systems for reuse, repair, and recycling",
        "Only packaging",
        "Just marketing",
      ],
      correct: 1,
      explanation: "Circular economy redesigns entire systems—not just products—for reuse, repair, and recycling, fundamentally changing how we produce and consume.",
    },
    {
      question: "Is business model innovation important for circular economy?",
      options: [
        "No, only technology matters",
        "Yes, as important as technology",
        "Business models don't matter",
        "Only for some industries",
      ],
      correct: 1,
      explanation: "Business model innovation is as important as technology for circular economy, changing incentives and relationships between producers and consumers.",
    },
    {
      question: "What keeps materials in use in circular economy?",
      options: [
        "Government force only",
        "Design for longevity and disassembly",
        "Hope and wishes",
        "Traditional recycling alone",
      ],
      correct: 1,
      explanation: "Products designed for longevity and easy disassembly keep materials in use longer, maximizing value and minimizing waste.",
    },
  ],
  "carbon-pricing": [
    {
      question: "What does a carbon tax do?",
      options: [
        "Pays people to pollute",
        "Charges per ton of CO2 emitted",
        "Removes CO2 from air",
        "Funds oil companies",
      ],
      correct: 1,
      explanation: "A carbon tax charges a fee per ton of CO2 emitted, making pollution expensive and incentivizing emissions reduction.",
    },
    {
      question: "How many carbon pricing schemes operate globally?",
      options: ["10", "30", "60+", "100+"],
      correct: 2,
      explanation: "Over 60 carbon pricing schemes operate globally, covering portions of emissions in various countries and regions.",
    },
    {
      question: "What is cap-and-trade?",
      options: [
        "A hat exchange program",
        "Sets emission limits and allows trading of permits",
        "Unlimited emissions for a fee",
        "A tax on electricity",
      ],
      correct: 1,
      explanation: "Cap-and-trade sets total emission limits and allows companies to trade emission permits, creating a market price for carbon.",
    },
    {
      question: "How much did British Columbia's carbon tax reduce emissions?",
      options: ["1-3%", "5-15%", "20-30%", "40-50%"],
      correct: 1,
      explanation: "British Columbia's carbon tax reduced emissions by 5-15% while maintaining economic growth, demonstrating policy effectiveness.",
    },
    {
      question: "What percentage of EU emissions does its trading system cover?",
      options: ["10%", "25%", "40%", "60%"],
      correct: 2,
      explanation: "The EU's emissions trading system covers approximately 40% of the union's greenhouse gas emissions.",
    },
    {
      question: "What is revenue recycling in carbon pricing?",
      options: [
        "Burning money",
        "Using carbon tax revenue to support communities and green investments",
        "Giving money to polluters",
        "Funding fossil fuels",
      ],
      correct: 1,
      explanation: "Revenue recycling uses carbon tax revenue to support vulnerable communities, fund green investments, and ensure equitable transition.",
    },
    {
      question: "What is a just transition?",
      options: [
        "Abandoning fossil fuel workers",
        "Supporting affected workers and communities in the shift to clean energy",
        "Keeping fossil fuel jobs forever",
        "Only helping companies",
      ],
      correct: 1,
      explanation: "Just transition ensures affected workers and communities receive support—retraining, economic diversification, safety nets—in the shift to clean energy.",
    },
    {
      question: "Does carbon pricing work while maintaining economic growth?",
      options: [
        "No, always destroys economy",
        "Yes, examples show emissions reduction with growth",
        "No evidence either way",
        "Only hurts economy",
      ],
      correct: 1,
      explanation: "Evidence from British Columbia and elsewhere shows carbon pricing can reduce emissions while maintaining economic growth.",
    },
    {
      question: "What do effective carbon policies balance?",
      options: [
        "Only environmental goals",
        "Environmental goals with social equity",
        "Only economic growth",
        "Corporate profits only",
      ],
      correct: 1,
      explanation: "Effective carbon policies balance environmental goals with social equity, ensuring vulnerable communities are supported.",
    },
    {
      question: "Does clean energy create more jobs than fossil fuels?",
      options: [
        "No, far fewer jobs",
        "Yes, but they must be accessible to displaced workers",
        "Exactly the same",
        "Only temporary jobs",
      ],
      correct: 1,
      explanation: "Clean energy creates more jobs than fossil fuels, but just transition policies ensure these jobs are accessible to displaced workers.",
    },
  ],
  "climate-tech-innovation": [
    {
      question: "What is green hydrogen?",
      options: [
        "Hydrogen colored green",
        "Hydrogen produced using renewable electricity",
        "Hydrogen from fossil fuels",
        "A plant-based fuel",
      ],
      correct: 1,
      explanation: "Green hydrogen is hydrogen produced using renewable electricity through electrolysis, creating zero-emission fuel.",
    },
    {
      question: "How much must green hydrogen costs drop to compete with fossil fuels?",
      options: ["10%", "25%", "50%", "75%"],
      correct: 2,
      explanation: "Green hydrogen costs must drop approximately 50% to compete economically with fossil fuels, though investment is accelerating this.",
    },
    {
      question: "Which sectors can green hydrogen help decarbonize?",
      options: [
        "Only cars",
        "Heavy industry, shipping, and aviation",
        "Only electricity",
        "None, it doesn't work",
      ],
      correct: 1,
      explanation: "Green hydrogen can decarbonize heavy industry, shipping, and aviation—sectors that are hard to electrify directly.",
    },
    {
      question: "What are small modular reactors?",
      options: [
        "Tiny conventional reactors",
        "Next-generation safer, more efficient nuclear designs",
        "Solar panels",
        "Wind turbines",
      ],
      correct: 1,
      explanation: "Small modular reactors are next-generation nuclear designs offering safer, more efficient power with flexible deployment.",
    },
    {
      question: "What role can advanced nuclear play?",
      options: [
        "Replace all renewables",
        "Provide reliable baseload power to complement renewables",
        "No useful role",
        "Only for weapons",
      ],
      correct: 1,
      explanation: "Advanced nuclear can provide reliable baseload power to complement variable renewables, creating a complete clean energy system.",
    },
    {
      question: "By how much could alternative proteins reduce agriculture emissions?",
      options: ["20%", "40%", "80%", "100%"],
      correct: 2,
      explanation: "Lab-grown meat, plant-based proteins, and precision fermentation could reduce agriculture emissions by approximately 80%.",
    },
    {
      question: "Are alternative proteins reaching price parity with conventional meat?",
      options: [
        "No, still 10x more expensive",
        "Yes, approaching price parity",
        "No, will never be affordable",
        "Already much cheaper",
      ],
      correct: 1,
      explanation: "Alternative protein technologies are approaching price parity with conventional meat, making them increasingly competitive.",
    },
    {
      question: "Is technology alone enough to solve climate change?",
      options: [
        "Yes, only technology matters",
        "No, deployment and adoption are equally important",
        "Technology can't help at all",
        "Only policy matters",
      ],
      correct: 1,
      explanation: "Technology alone isn't enough; deployment, adoption, policy support, and behavior change are equally important for climate solutions.",
    },
    {
      question: "What are key challenges for alternative proteins?",
      options: [
        "None, perfect solution",
        "Consumer acceptance and scaling production",
        "Impossible to make",
        "Worse for environment",
      ],
      correct: 1,
      explanation: "Consumer acceptance and scaling production are key challenges for alternative proteins to achieve widespread adoption.",
    },
    {
      question: "What does the innovation pipeline offer?",
      options: [
        "Nothing useful",
        "Solutions for hard-to-decarbonize sectors",
        "Only marginal improvements",
        "Ways to keep using fossil fuels",
      ],
      correct: 1,
      explanation: "The innovation pipeline offers solutions for hard-to-decarbonize sectors like aviation, shipping, and heavy industry.",
    },
  ],
  "climate-finance": [
    {
      question: "How much annual investment is required globally to meet climate goals?",
      options: [
        "$500 billion",
        "$1-2 trillion",
        "$3-5 trillion",
        "$10 trillion",
      ],
      correct: 2,
      explanation: "Meeting climate goals requires approximately $3-5 trillion in annual investment globally across all sectors.",
    },
    {
      question: "How much is current annual climate finance?",
      options: [
        "$100 billion",
        "$600 billion",
        "$2 trillion",
        "$5 trillion",
      ],
      correct: 1,
      explanation: "Current climate finance is approximately $600 billion annually, far short of the $3-5 trillion needed.",
    },
    {
      question: "What are green bonds?",
      options: [
        "Government savings bonds",
        "Bonds that fund climate-positive projects",
        "Eco-friendly paper bonds",
        "Agricultural investments",
      ],
      correct: 1,
      explanation: "Green bonds are financial instruments that specifically fund climate-positive projects like renewable energy and efficiency.",
    },
    {
      question: "What does ESG stand for?",
      options: [
        "Energy Solar Grid",
        "Environmental, Social, Governance",
        "Efficient Sustainable Growth",
        "Economic Security Group",
      ],
      correct: 1,
      explanation: "ESG stands for Environmental, Social, and Governance factors integrated into investment decisions.",
    },
    {
      question: "How much is under ESG management globally?",
      options: [
        "$5 trillion",
        "$15 trillion",
        "$35+ trillion",
        "$100 trillion",
      ],
      correct: 2,
      explanation: "Assets under ESG (Environmental, Social, Governance) management exceed $35 trillion globally, showing mainstream acceptance.",
    },
    {
      question: "What is greenwashing?",
      options: [
        "Cleaning with eco-friendly products",
        "Misleading claims about environmental benefits",
        "Painting buildings green",
        "Water conservation",
      ],
      correct: 1,
      explanation: "Greenwashing is making misleading claims about environmental benefits, a significant concern requiring stronger standards and enforcement.",
    },
    {
      question: "How much do developing nations need annually for climate adaptation?",
      options: [
        "$50 billion",
        "$100 billion",
        "$300 billion",
        "$1 trillion",
      ],
      correct: 2,
      explanation: "Developing nations need approximately $300 billion annually for climate adaptation to cope with unavoidable climate impacts.",
    },
    {
      question: "What is a debt-for-climate swap?",
      options: [
        "Paying off personal loans",
        "Reducing national debt in exchange for climate investments",
        "Trading carbon credits",
        "Corporate bond trading",
      ],
      correct: 1,
      explanation: "Debt-for-climate swaps reduce a nation's debt burden in exchange for commitments to climate action and conservation investments.",
    },
    {
      question: "Is climate investment profitable?",
      options: [
        "No, always loses money",
        "Yes, massively profitable and necessary",
        "Break-even at best",
        "Only profitable short-term",
      ],
      correct: 1,
      explanation: "Climate investment is massively profitable and necessary, with clean energy offering strong returns while avoiding climate risks.",
    },
    {
      question: "Why is international climate finance both moral and security issue?",
      options: [
        "It's not important",
        "Climate impacts cross borders; supporting adaptation prevents instability",
        "Only a moral issue",
        "Only about money",
      ],
      correct: 1,
      explanation: "International climate finance is both moral obligation and global security issue—climate impacts cross borders, and supporting adaptation prevents instability and migration crises.",
    },
  ],
};
