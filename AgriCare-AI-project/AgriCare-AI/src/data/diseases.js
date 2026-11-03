// Disease knowledge base covering 24 crops and 76 disease/healthy conditions.
// Custom-trained foliar pathology dataset.

export const CROPS = [
  "Tomato",
  "Potato",
  "Corn (Maize)",
  "Sugarcane",
  "Rice",
  "Wheat",
  "Cotton",
  "Groundnut",
  "Chilli",
  "Citrus",
  "Papaya",
  "Cashew",
  "Cassava",
  "Grape",
  "Pepper (Bell)",
  "Soybean",
  "Apple",
  "Orange",
  "Peach",
  "Strawberry",
  "Cherry",
  "Squash",
  "Blueberry",
  "Raspberry"
];

export const DISEASES = [
  {
    "id": "tomato-early-blight",
    "crop": "Tomato",
    "name": "Early Blight",
    "pathogen": "Alternaria solani (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "A common fungal disease causing dark concentric-ring spots on older leaves, which spreads upward in warm, humid weather.",
    "symptoms": [
      "Brown to black spots with concentric \"target-board\" rings on lower, older leaves",
      "Yellow halo around the spots; affected leaves turn yellow and drop",
      "Dark, sunken lesions on stems and near the fruit stalk"
    ],
    "management": [
      "Remove and destroy infected lower leaves immediately",
      "Spray a recommended fungicide such as Mancozeb or Chlorothalonil as per label dose",
      "Repeat sprays at 7–10 day intervals during humid weather",
      "Avoid overhead irrigation; water at the base of the plant"
    ],
    "prevention": [
      "Use certified disease-free seed and resistant varieties",
      "Follow 2–3 year crop rotation away from tomato, potato and brinjal",
      "Mulch the soil to stop spores splashing onto leaves",
      "Keep proper plant spacing for air circulation"
    ]
  },
  {
    "id": "tomato-late-blight",
    "crop": "Tomato",
    "name": "Late Blight",
    "pathogen": "Phytophthora infestans (oomycete)",
    "type": "Fungal",
    "severity": "High",
    "summary": "A fast-spreading, destructive disease favoured by cool, wet weather. It can destroy a crop within days if untreated.",
    "symptoms": [
      "Large, irregular, water-soaked grey-green patches on leaves",
      "White fuzzy growth on the underside of leaves in humid conditions",
      "Dark brown, greasy lesions on stems and firm brown patches on fruits"
    ],
    "management": [
      "Remove and burn affected plants – do not compost them",
      "Spray systemic fungicides like Metalaxyl + Mancozeb or Cymoxanil + Mancozeb as per label",
      "Alternate fungicide groups to avoid resistance",
      "Consult the local Krishi Vigyan Kendra (KVK) if the spread is fast"
    ],
    "prevention": [
      "Plant resistant varieties and healthy seedlings",
      "Avoid planting near potato fields",
      "Use drip irrigation and avoid wet foliage overnight",
      "Monitor fields closely during cool, cloudy, rainy spells"
    ]
  },
  {
    "id": "tomato-bacterial-spot",
    "crop": "Tomato",
    "name": "Bacterial Spot",
    "pathogen": "Xanthomonas spp. (bacterium)",
    "type": "Bacterial",
    "severity": "Moderate",
    "summary": "A bacterial disease producing small dark spots on leaves and fruits, spread by rain splash and infected seed.",
    "symptoms": [
      "Small, water-soaked spots that turn dark brown to black",
      "Spots may merge, and leaves turn yellow and fall",
      "Raised, scabby spots on green fruits"
    ],
    "management": [
      "Remove badly infected plants and plant debris",
      "Spray copper-based bactericides (e.g. Copper oxychloride) as per label",
      "Avoid working in the field when plants are wet"
    ],
    "prevention": [
      "Use certified, hot-water-treated seed",
      "Rotate crops for at least 2 years",
      "Disinfect tools and stakes between seasons"
    ]
  },
  {
    "id": "tomato-leaf-mold",
    "crop": "Tomato",
    "name": "Leaf Mold",
    "pathogen": "Passalora fulva (fungus)",
    "type": "Fungal",
    "severity": "Low",
    "summary": "Common in greenhouses and humid conditions. It causes yellow patches on upper leaf surfaces with olive-green mold below.",
    "symptoms": [
      "Pale green to yellow patches on the upper leaf surface",
      "Olive-green to greyish velvety mold on the leaf underside",
      "Leaves curl, wither and drop in severe cases"
    ],
    "management": [
      "Improve ventilation and reduce humidity (especially in polyhouses)",
      "Remove infected leaves",
      "Apply a recommended fungicide such as Chlorothalonil as per label"
    ],
    "prevention": [
      "Grow resistant varieties",
      "Avoid dense planting and excess nitrogen",
      "Keep relative humidity below 85%"
    ]
  },
  {
    "id": "tomato-septoria-leaf-spot",
    "crop": "Tomato",
    "name": "Septoria Leaf Spot",
    "pathogen": "Septoria lycopersici (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Many small circular spots with grey centres appear on lower leaves, causing heavy leaf loss.",
    "symptoms": [
      "Numerous small, circular spots with grey/white centres and dark borders",
      "Tiny black dots (fruiting bodies) in the centre of spots",
      "Lower leaves yellow, wither and drop first"
    ],
    "management": [
      "Remove infected lower leaves",
      "Spray Mancozeb or Chlorothalonil at recommended doses",
      "Water at the base of plants in the morning"
    ],
    "prevention": [
      "Rotate crops and remove plant debris after harvest",
      "Control solanaceous weeds around the field",
      "Mulch to reduce soil splash"
    ]
  },
  {
    "id": "tomato-yellow-leaf-curl",
    "crop": "Tomato",
    "name": "Yellow Leaf Curl Virus",
    "pathogen": "Tomato yellow leaf curl virus (TYLCV), spread by whitefly",
    "type": "Viral",
    "severity": "High",
    "summary": "A viral disease transmitted by whiteflies. Infected plants are stunted with small, curled, yellow leaves and very low yield.",
    "symptoms": [
      "Upward curling and cupping of leaves",
      "Yellowing of leaf margins and between veins",
      "Stunted plant growth and heavy flower drop"
    ],
    "management": [
      "There is no cure for infected plants – uproot and destroy them early",
      "Control whiteflies with yellow sticky traps and recommended insecticides (e.g. Imidacloprid / neem oil)",
      "Remove weeds that host whiteflies"
    ],
    "prevention": [
      "Use virus-resistant/tolerant varieties",
      "Raise seedlings under insect-proof nets",
      "Use reflective mulches and border crops like maize"
    ]
  },
  {
    "id": "tomato-spider-mites",
    "crop": "Tomato",
    "name": "Spider Mites (Two-spotted)",
    "pathogen": "Tetranychus urticae (mite pest)",
    "type": "Pest",
    "severity": "Moderate",
    "summary": "Tiny sap-sucking mites on the underside of leaves cause fine yellow speckling; populations explode in hot, dry weather.",
    "symptoms": [
      "Fine yellow or white speckles (stippling) on the upper leaf surface",
      "Fine silky webbing on the underside of leaves and between stems",
      "Leaves turn bronze, dry out and fall in heavy infestations"
    ],
    "management": [
      "Spray the underside of leaves with a strong jet of water to knock mites off",
      "Apply neem oil, wettable sulphur or a recommended miticide (e.g. Abamectin, Fenazaquin) as per label",
      "Remove and destroy heavily infested leaves"
    ],
    "prevention": [
      "Avoid water stress – mites thrive on dry, dusty plants",
      "Do not overuse broad-spectrum insecticides that kill natural predators",
      "Inspect the underside of leaves weekly in hot weather"
    ]
  },
  {
    "id": "tomato-target-spot",
    "crop": "Tomato",
    "name": "Target Spot",
    "pathogen": "Corynespora cassiicola (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Brown spots with light centres and concentric rings on leaves, stems and fruit; favoured by warm, wet weather.",
    "symptoms": [
      "Small brown spots that enlarge into round lesions with concentric rings",
      "Spots often have a light tan centre and may crack",
      "Sunken spots on fruit and heavy leaf drop from the lower canopy"
    ],
    "management": [
      "Remove infected lower leaves and plant debris",
      "Spray Chlorothalonil, Mancozeb or Azoxystrobin as per label dose",
      "Improve airflow by pruning and staking"
    ],
    "prevention": [
      "Avoid overhead irrigation and long leaf-wetness periods",
      "Rotate away from tomato and other host crops",
      "Keep proper plant spacing"
    ]
  },
  {
    "id": "tomato-mosaic-virus",
    "crop": "Tomato",
    "name": "Tomato Mosaic Virus",
    "pathogen": "Tomato mosaic virus (ToMV)",
    "type": "Viral",
    "severity": "High",
    "summary": "A very stable, contagious virus that causes light and dark green mottling and distorted leaves; spread by hands, tools and seed.",
    "symptoms": [
      "Light green / dark green mosaic mottling on leaves",
      "Leaves become curled, narrow or fern-like",
      "Stunted plants with uneven ripening of fruit"
    ],
    "management": [
      "There is no cure – uproot and destroy infected plants",
      "Wash hands and disinfect tools after handling plants",
      "Do not smoke or use tobacco near plants"
    ],
    "prevention": [
      "Use certified virus-free or resistant seed",
      "Disinfect trays, stakes and tools between seasons",
      "Remove weeds and volunteer tomato plants"
    ]
  },
  {
    "id": "tomato-healthy",
    "crop": "Tomato",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots, lesions or mold"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring every 5–7 days"
    ],
    "prevention": [
      "Maintain balanced fertilization based on soil test",
      "Ensure proper irrigation and drainage",
      "Inspect plants regularly for early signs of pests or disease"
    ]
  },
  {
    "id": "potato-early-blight",
    "crop": "Potato",
    "name": "Early Blight",
    "pathogen": "Alternaria solani (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Dark brown spots with concentric rings on older potato leaves; reduces tuber size if severe.",
    "symptoms": [
      "Brown target-like spots with concentric rings on older leaves",
      "Yellowing around spots and premature leaf fall",
      "Dark, slightly sunken lesions on tubers"
    ],
    "management": [
      "Spray Mancozeb or Chlorothalonil at the first sign of disease",
      "Remove infected foliage",
      "Ensure adequate nitrogen – stressed plants are more susceptible"
    ],
    "prevention": [
      "Use certified seed tubers",
      "Rotate crops for 2–3 years",
      "Destroy crop debris after harvest"
    ]
  },
  {
    "id": "potato-late-blight",
    "crop": "Potato",
    "name": "Late Blight",
    "pathogen": "Phytophthora infestans (oomycete)",
    "type": "Fungal",
    "severity": "High",
    "summary": "The most destructive potato disease. It spreads rapidly in cool, humid weather and can rot tubers in storage.",
    "symptoms": [
      "Water-soaked, dark brown to black patches on leaf tips and margins",
      "White mold ring on the underside of leaves in the morning",
      "Reddish-brown dry rot inside tubers"
    ],
    "management": [
      "Spray Metalaxyl + Mancozeb or Cymoxanil + Mancozeb as per label",
      "Cut and remove haulms (stems) 10–15 days before harvest in affected fields",
      "Do not store infected tubers"
    ],
    "prevention": [
      "Use resistant varieties (e.g. Kufri Jyoti, Kufri Badshah) and certified seed",
      "Prophylactic spray when weather is cool and cloudy",
      "Earth up properly to protect tubers"
    ]
  },
  {
    "id": "potato-healthy",
    "crop": "Potato",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots, lesions or mold"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring"
    ],
    "prevention": [
      "Use certified seed tubers",
      "Balanced NPK as per soil test",
      "Monitor during cool and humid weather"
    ]
  },
  {
    "id": "corn-common-rust",
    "crop": "Corn (Maize)",
    "name": "Common Rust",
    "pathogen": "Puccinia sorghi (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Small cinnamon-brown pustules on both leaf surfaces, favoured by moderate temperatures and high humidity.",
    "symptoms": [
      "Small, oval, reddish-brown powdery pustules on both sides of leaves",
      "Pustules turn dark brown/black as the plant matures",
      "Severe infection causes leaves to yellow and die early"
    ],
    "management": [
      "Spray Mancozeb or a triazole fungicide (e.g. Propiconazole) as per label when pustules appear",
      "Remove heavily infected leaves in small plots"
    ],
    "prevention": [
      "Grow rust-resistant hybrids",
      "Avoid very late sowing",
      "Remove volunteer maize plants"
    ]
  },
  {
    "id": "corn-northern-leaf-blight",
    "crop": "Corn (Maize)",
    "name": "Northern Leaf Blight",
    "pathogen": "Exserohilum turcicum (fungus)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Long, cigar-shaped grey-green lesions on leaves that can cause major yield losses before grain filling.",
    "symptoms": [
      "Long (2.5–15 cm) elliptical, cigar-shaped grey-green to tan lesions",
      "Lesions start on lower leaves and move upward",
      "Leaves appear burnt in severe cases"
    ],
    "management": [
      "Spray Mancozeb or Propiconazole at disease onset as per label",
      "Repeat after 10–15 days if needed"
    ],
    "prevention": [
      "Use resistant hybrids",
      "Crop rotation and deep ploughing of residue",
      "Balanced fertilization"
    ]
  },
  {
    "id": "corn-gray-leaf-spot",
    "crop": "Corn (Maize)",
    "name": "Gray Leaf Spot",
    "pathogen": "Cercospora zeae-maydis (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Rectangular grey to tan lesions restricted by leaf veins; common in warm, humid areas with maize residue.",
    "symptoms": [
      "Rectangular, narrow lesions running parallel to leaf veins",
      "Lesions are tan to grey, sometimes with yellow borders",
      "Lesions merge and kill large leaf areas"
    ],
    "management": [
      "Apply a recommended strobilurin or triazole fungicide as per label",
      "Improve field drainage"
    ],
    "prevention": [
      "Rotate with non-host crops",
      "Bury crop residue",
      "Grow tolerant hybrids"
    ]
  },
  {
    "id": "corn-healthy",
    "crop": "Corn (Maize)",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible lesions or pustules"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring"
    ],
    "prevention": [
      "Balanced fertilization",
      "Timely weeding and irrigation",
      "Watch for fall armyworm damage"
    ]
  },
  {
    "id": "apple-scab",
    "crop": "Apple",
    "name": "Apple Scab",
    "pathogen": "Venturia inaequalis (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Olive-green to black velvety spots on leaves and fruits, causing cracked, deformed fruit.",
    "symptoms": [
      "Olive-green to dark velvety spots on leaves",
      "Leaves become distorted and may drop early",
      "Dark, scabby, cracked lesions on fruits"
    ],
    "management": [
      "Spray Captan, Mancozeb or Difenoconazole as per the state horticulture spray schedule",
      "Collect and destroy fallen leaves"
    ],
    "prevention": [
      "Plant scab-resistant varieties",
      "Prune for open canopy",
      "Apply urea spray on fallen leaves in autumn"
    ]
  },
  {
    "id": "apple-black-rot",
    "crop": "Apple",
    "name": "Black Rot",
    "pathogen": "Botryosphaeria obtusa (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Causes \"frog-eye\" leaf spots, cankers on branches and black rotting of fruits.",
    "symptoms": [
      "Purple spots that enlarge into brown \"frog-eye\" spots with purple margins",
      "Sunken cankers on branches",
      "Fruit rot starting at the blossom end, turning black and mummified"
    ],
    "management": [
      "Prune out cankers and dead wood",
      "Remove mummified fruits",
      "Spray Captan as per schedule"
    ],
    "prevention": [
      "Maintain orchard sanitation",
      "Avoid tree wounds",
      "Keep trees vigorous with balanced nutrition"
    ]
  },
  {
    "id": "apple-cedar-rust",
    "crop": "Apple",
    "name": "Cedar Apple Rust",
    "pathogen": "Gymnosporangium juniperi-virginianae (fungus)",
    "type": "Fungal",
    "severity": "Low",
    "summary": "Bright yellow-orange spots on leaves; the fungus alternates between apple and juniper/cedar trees.",
    "symptoms": [
      "Bright yellow-orange spots on the upper leaf surface",
      "Small tube-like structures on the underside of spots",
      "Premature leaf fall in heavy infections"
    ],
    "management": [
      "Spray Myclobutanil or Mancozeb from pink-bud stage as per label"
    ],
    "prevention": [
      "Remove nearby juniper/cedar hosts where possible",
      "Plant resistant varieties"
    ]
  },
  {
    "id": "apple-healthy",
    "crop": "Apple",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots or rust"
    ],
    "management": [
      "No treatment needed",
      "Follow the routine orchard spray schedule"
    ],
    "prevention": [
      "Annual pruning and sanitation",
      "Balanced nutrition",
      "Regular monitoring"
    ]
  },
  {
    "id": "grape-black-rot",
    "crop": "Grape",
    "name": "Black Rot",
    "pathogen": "Guignardia bidwellii (fungus)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Brown leaf spots with dark borders and shrivelled, black, mummified berries.",
    "symptoms": [
      "Small reddish-brown circular spots with dark margins on leaves",
      "Black dots (pycnidia) inside the spots",
      "Berries turn brown, then black, hard and shrivelled"
    ],
    "management": [
      "Remove mummified berries and infected canes",
      "Spray Mancozeb or Myclobutanil as per label"
    ],
    "prevention": [
      "Good canopy management for airflow",
      "Clean vineyard floor after harvest"
    ]
  },
  {
    "id": "grape-esca",
    "crop": "Grape",
    "name": "Esca (Black Measles)",
    "pathogen": "Phaeomoniella and Phaeoacremonium spp. (fungal complex)",
    "type": "Fungal",
    "severity": "High",
    "summary": "A trunk disease that causes \"tiger-stripe\" leaf patterns and dark spotting on berries.",
    "symptoms": [
      "Yellow or reddish stripes between leaf veins (\"tiger stripes\")",
      "Small dark spots on berries",
      "Sudden wilting of vines in summer"
    ],
    "management": [
      "Prune and destroy infected wood",
      "Protect large pruning wounds with a wound sealant/fungicide"
    ],
    "prevention": [
      "Prune in dry weather",
      "Use healthy planting material"
    ]
  },
  {
    "id": "grape-leaf-blight",
    "crop": "Grape",
    "name": "Leaf Blight (Isariopsis Leaf Spot)",
    "pathogen": "Pseudocercospora vitis (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Irregular dark brown spots on leaves that lead to early defoliation.",
    "symptoms": [
      "Irregular dark red-brown spots on leaves",
      "Spots join to form large dead areas",
      "Early leaf fall"
    ],
    "management": [
      "Spray Mancozeb or copper fungicides as per label",
      "Remove infected leaves"
    ],
    "prevention": [
      "Maintain open canopy",
      "Avoid excessive irrigation"
    ]
  },
  {
    "id": "grape-healthy",
    "crop": "Grape",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring"
    ],
    "prevention": [
      "Canopy management",
      "Balanced nutrition",
      "Regular scouting"
    ]
  },
  {
    "id": "pepper-bacterial-spot",
    "crop": "Pepper (Bell)",
    "name": "Bacterial Spot",
    "pathogen": "Xanthomonas spp. (bacterium)",
    "type": "Bacterial",
    "severity": "Moderate",
    "summary": "Water-soaked spots that turn brown on leaves and fruits, causing leaf drop and fruit blemishes.",
    "symptoms": [
      "Small water-soaked spots that become brown with yellow halos",
      "Severe leaf drop",
      "Raised, scabby spots on fruits"
    ],
    "management": [
      "Spray copper-based bactericides as per label",
      "Remove infected plants and debris"
    ],
    "prevention": [
      "Use disease-free seed and transplants",
      "Rotate crops",
      "Avoid overhead irrigation"
    ]
  },
  {
    "id": "pepper-healthy",
    "crop": "Pepper (Bell)",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring"
    ],
    "prevention": [
      "Balanced fertilization",
      "Proper irrigation",
      "Regular scouting"
    ]
  },
  {
    "id": "cherry-powdery-mildew",
    "crop": "Cherry",
    "name": "Powdery Mildew",
    "pathogen": "Podosphaera clandestina (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "White powdery fungal growth on young leaves and shoots that causes curling and weakens the tree.",
    "symptoms": [
      "White, powdery patches on the leaf surface, mostly on young leaves",
      "Leaves curl upward and may become brittle",
      "Powdery growth can also appear on fruit"
    ],
    "management": [
      "Spray wettable sulphur or a recommended fungicide (e.g. Hexaconazole, Myclobutanil) as per label",
      "Prune and remove infected shoots"
    ],
    "prevention": [
      "Prune for an open canopy and good airflow",
      "Avoid excess nitrogen",
      "Remove root suckers and water sprouts"
    ]
  },
  {
    "id": "cherry-healthy",
    "crop": "Cherry",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots or powdery growth"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring"
    ],
    "prevention": [
      "Annual pruning",
      "Balanced nutrition",
      "Regular scouting"
    ]
  },
  {
    "id": "orange-citrus-greening",
    "crop": "Orange",
    "name": "Citrus Greening (Huanglongbing)",
    "pathogen": "Candidatus Liberibacter asiaticus (bacterium), spread by citrus psyllid",
    "type": "Bacterial",
    "severity": "High",
    "summary": "A deadly, incurable citrus disease spread by the Asian citrus psyllid. Leaves show blotchy yellow mottling and fruit stays small and bitter.",
    "symptoms": [
      "Blotchy, asymmetric yellow mottling on leaves",
      "Yellow shoots and twig dieback",
      "Small, lopsided, bitter fruit that stays green at the bottom"
    ],
    "management": [
      "There is no cure – remove and destroy infected trees to protect the orchard",
      "Control citrus psyllids with recommended insecticides (e.g. Imidacloprid, Thiamethoxam)",
      "Apply balanced nutrition, including zinc and manganese, to keep trees vigorous"
    ],
    "prevention": [
      "Plant only certified disease-free nursery plants",
      "Monitor regularly for psyllids, especially on new flush",
      "Remove infected trees quickly"
    ]
  },
  {
    "id": "peach-bacterial-spot",
    "crop": "Peach",
    "name": "Bacterial Spot",
    "pathogen": "Xanthomonas arboricola pv. pruni (bacterium)",
    "type": "Bacterial",
    "severity": "Moderate",
    "summary": "Small water-soaked spots on leaves that fall out leaving a \"shot-hole\" look; also causes cracked spots on fruit.",
    "symptoms": [
      "Small, angular, water-soaked spots that turn purple-brown",
      "Centres of spots drop out, giving a shot-hole appearance",
      "Yellowing and early leaf fall; pitted, cracked spots on fruit"
    ],
    "management": [
      "Spray copper-based bactericides during the dormant and early season as per label",
      "Prune out infected twigs"
    ],
    "prevention": [
      "Plant tolerant varieties",
      "Avoid excess nitrogen",
      "Use windbreaks to reduce leaf injury"
    ]
  },
  {
    "id": "peach-healthy",
    "crop": "Peach",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots or holes"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring"
    ],
    "prevention": [
      "Annual pruning",
      "Balanced nutrition",
      "Regular scouting"
    ]
  },
  {
    "id": "strawberry-leaf-scorch",
    "crop": "Strawberry",
    "name": "Leaf Scorch",
    "pathogen": "Diplocarpon earlianum (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Many small dark purple spots that merge until the leaf looks burnt or scorched; weakens plants and reduces yield.",
    "symptoms": [
      "Numerous small, irregular dark purple spots on the upper leaf surface",
      "Spots merge and the leaf turns reddish-purple, then brown and dry",
      "Lesions can also appear on stalks and runners"
    ],
    "management": [
      "Remove and destroy infected leaves after harvest",
      "Spray Captan or another recommended fungicide as per label"
    ],
    "prevention": [
      "Use disease-free planting material",
      "Use drip irrigation instead of overhead watering",
      "Renew beds every 2–3 years"
    ]
  },
  {
    "id": "strawberry-healthy",
    "crop": "Strawberry",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring"
    ],
    "prevention": [
      "Mulch beds to keep fruit and leaves clean",
      "Drip irrigation",
      "Regular scouting"
    ]
  },
  {
    "id": "squash-powdery-mildew",
    "crop": "Squash",
    "name": "Powdery Mildew",
    "pathogen": "Podosphaera xanthii / Erysiphe cichoracearum (fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "White powdery patches on cucurbit leaves that spread quickly in warm, dry days with humid nights.",
    "symptoms": [
      "White, talc-like powdery spots on upper and lower leaf surfaces",
      "Spots merge to cover the whole leaf",
      "Leaves turn yellow, dry up and die early"
    ],
    "management": [
      "Spray wettable sulphur, Karathane (Dinocap) or Hexaconazole as per label",
      "Remove heavily infected leaves"
    ],
    "prevention": [
      "Grow resistant varieties",
      "Give plants full sun and good spacing",
      "Avoid excess nitrogen"
    ]
  },
  {
    "id": "soybean-healthy",
    "crop": "Soybean",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring"
    ],
    "prevention": [
      "Seed treatment before sowing",
      "Balanced nutrition as per soil test",
      "Regular scouting"
    ]
  },
  {
    "id": "blueberry-healthy",
    "crop": "Blueberry",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring"
    ],
    "prevention": [
      "Keep soil acidic (pH 4.5–5.5)",
      "Mulch and water regularly",
      "Regular scouting"
    ]
  },
  {
    "id": "raspberry-healthy",
    "crop": "Raspberry",
    "name": "Healthy",
    "healthy": true,
    "pathogen": "—",
    "type": "None",
    "severity": "None",
    "summary": "No disease symptoms were detected. The leaf appears healthy.",
    "symptoms": [
      "Uniform green colour",
      "No visible spots"
    ],
    "management": [
      "No treatment needed",
      "Continue regular monitoring"
    ],
    "prevention": [
      "Prune out old canes after fruiting",
      "Good airflow between rows",
      "Regular scouting"
    ]
  },
  {
    "id": "cashew-leaf-miner",
    "crop": "Cashew",
    "name": "Leaf Miner",
    "pathogen": "Acrocercops syngramma (Insect pest)",
    "type": "Pest",
    "severity": "Moderate",
    "summary": "Larvae mine blister-like silvery patches on tender leaves that dry and turn necrotic.",
    "symptoms": [
      "Silvery serpentine trails on young foliage",
      "Blister-like swelling on leaf lamina",
      "Dry, ragged holes on mature leaves"
    ],
    "management": [
      "Spray Lambda-cyhalothrin 5% EC (0.6 ml/L)",
      "Prune heavily infested tender shoots"
    ],
    "prevention": [
      "Synchronize new flush management",
      "Conserve natural braconid parasitoids"
    ]
  },
  {
    "id": "cashew-red-rust",
    "crop": "Cashew",
    "name": "Red Rust",
    "pathogen": "Cephaleuros virescens (Parasitic green alga)",
    "type": "Algal",
    "severity": "Moderate",
    "summary": "Velvety orange-red circular spots on leaves and twigs during warm humid seasons.",
    "symptoms": [
      "Velvety reddish-brown circular patches on upper leaf surface",
      "Premature leaf shedding in severe infections",
      "Bark cracking on young twigs"
    ],
    "management": [
      "Spray Copper Oxychloride 50% WP (2.5 g/L)",
      "Ensure canopy aeration through pruning"
    ],
    "prevention": [
      "Improve soil drainage and organic matter",
      "Avoid excessive tree crowding"
    ]
  },
  {
    "id": "cashew-healthy",
    "crop": "Cashew",
    "name": "Healthy Cashew",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": true,
    "summary": "Cashew canopy is vigorous, shiny, deep green, and free from leaf miners or algal rust.",
    "symptoms": [
      "Thick, shiny leathery green leaves",
      "Clean terminal shoots",
      "Uniform vegetative flush"
    ],
    "management": [
      "Apply balanced N-P-K (500:250:250 g/tree)",
      "Provide basin irrigation during flowering"
    ],
    "prevention": [
      "Routine sanitation and weeding around root basins"
    ]
  },
  {
    "id": "cassava-brown-spot",
    "crop": "Cassava",
    "name": "Brown Streak / Spot",
    "pathogen": "Passalora henningsii (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Small uniform brown circular lesions with distinct dark borders on mature lower leaves.",
    "symptoms": [
      "Circular brown spots with darker borders",
      "Yellow halos around expanding lesions",
      "Premature defoliation of lower canopy"
    ],
    "management": [
      "Spray Mancozeb 75% WP (2 g/L)",
      "Remove heavily diseased fallen leaves"
    ],
    "prevention": [
      "Plant tolerant cassava varieties",
      "Adopt 2-year crop rotation"
    ]
  },
  {
    "id": "cassava-mosaic",
    "crop": "Cassava",
    "name": "Cassava Mosaic Disease (CMD)",
    "pathogen": "African Cassava Mosaic Virus (ACMV / Begomovirus)",
    "type": "Viral",
    "severity": "High",
    "summary": "Devastating viral disease causing puckering, leaf distortion, and chlorotic mosaic patches.",
    "symptoms": [
      "Variegated light green and yellow mosaic patterns",
      "Severe distortion, twisting, and reduction of leaf blades",
      "Stunted plant growth and reduced tuber yield"
    ],
    "management": [
      "Rogue out and destroy infected stems immediately",
      "Spray Imidacloprid (0.3 ml/L) to control whitefly vectors"
    ],
    "prevention": [
      "Use certified virus-free stem cuttings",
      "Plant CMD-resistant cultivars"
    ]
  },
  {
    "id": "cassava-healthy",
    "crop": "Cassava",
    "name": "Healthy Cassava",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": true,
    "summary": "Foliage shows vibrant palmate green leaves without distortion or chlorotic patches.",
    "symptoms": [
      "Symmetric palmate leaflets",
      "Uniform green lamina with sturdy petioles",
      "Vigorous stem elongation"
    ],
    "management": [
      "Ensure adequate soil potassium for root bulking",
      "Weed regularly in first 3 months"
    ],
    "prevention": [
      "Source certified healthy planting stakes"
    ]
  },
  {
    "id": "chilli-white-spot",
    "crop": "Chilli",
    "name": "White Spot / Frogeye Leaf Spot",
    "pathogen": "Cercospora capsici (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Circular spots with whitish-grey centers and distinct dark red-brown margins.",
    "symptoms": [
      "Frogeye circular spots with whitish bleached centers",
      "Dark reddish-brown halos",
      "Severe leaf drop exposing fruit to sunscald"
    ],
    "management": [
      "Spray Carbendazim 50% WP (1 g/L) or Difenoconazole (0.5 ml/L)",
      "Avoid overhead irrigation"
    ],
    "prevention": [
      "Crop rotation away from solanaceous plants for 2 years",
      "Use certified disease-free seeds"
    ]
  },
  {
    "id": "chilli-nutrient-deficiency",
    "crop": "Chilli",
    "name": "Nutrient Deficiency (N-P-K/Mg)",
    "pathogen": "Physiological / Soil Nutrient Imbalance",
    "type": "Nutritional",
    "severity": "Moderate",
    "summary": "Interveinal yellowing, chlorosis, and purpling due to deficient macro/micro nutrients.",
    "symptoms": [
      "Interveinal chlorosis on older leaves (Mg deficiency)",
      "Uniform pale light green leaf color (Nitrogen deficit)",
      "Purple tint on leaf underside (Phosphorus deficiency)"
    ],
    "management": [
      "Apply 19-19-19 water soluble fertilizer spray (5 g/L)",
      "Drench with Magnesium Sulphate (5 g/L)"
    ],
    "prevention": [
      "Conduct periodic soil health testing",
      "Incorporate well-rotted farmyard manure"
    ]
  },
  {
    "id": "chilli-healthy",
    "crop": "Chilli",
    "name": "Healthy Chilli",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": true,
    "summary": "Chilli canopy is lush green, sturdy, upright, and free from pests or spots.",
    "symptoms": [
      "Firm dark green leaves",
      "Clean branching with healthy floral buds",
      "No puckering or stippling"
    ],
    "management": [
      "Maintain steady drip irrigation",
      "Balanced N-P-K fertigation"
    ],
    "prevention": [
      "Preventive neem oil spray (1500 ppm) every 14 days"
    ]
  },
  {
    "id": "citrus-black-spot",
    "crop": "Citrus",
    "name": "Black Spot",
    "pathogen": "Phyllosticta citricarpa (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Small sunken dark brown circular spots with raised black borders on leaves and rind.",
    "symptoms": [
      "Circular sunken spots with reddish-black margins",
      "Tiny black pycnidia pimples inside lesions",
      "Premature leaf fall and fruit blemishes"
    ],
    "management": [
      "Spray Copper Oxychloride (2.5 g/L) or Azoxystrobin (1 ml/L)",
      "Prune dead twig wood"
    ],
    "prevention": [
      "Rake and destroy fallen leaf litter",
      "Provide drip irrigation to keep canopy dry"
    ]
  },
  {
    "id": "citrus-canker",
    "crop": "Citrus",
    "name": "Citrus Canker",
    "pathogen": "Xanthomonas axonopodis pv. citri (Bacterium)",
    "type": "Bacterial",
    "severity": "High",
    "summary": "Raised corky blister-like lesions surrounded by distinct oily yellow halos.",
    "symptoms": [
      "Corky raised pustules on both upper and lower leaf surfaces",
      "Characteristic oily yellow halo ring",
      "Stem and twig cankers causing dieback"
    ],
    "management": [
      "Spray Streptocycline (100 ppm, 1 g/10 L) + Copper Oxychloride (2.5 g/L)",
      "Prune infected twigs before monsoon"
    ],
    "prevention": [
      "Plant canker-resistant citrus rootstocks",
      "Erect windbreaks around orchard borders"
    ]
  },
  {
    "id": "citrus-healthy",
    "crop": "Citrus",
    "name": "Healthy Citrus",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": true,
    "summary": "Glossy dark green citrus foliage with firm petiole wings and healthy flush.",
    "symptoms": [
      "Uniform dark green glossy leaves",
      "No pustules, leaf miners, or yellowing",
      "Strong stem tissue"
    ],
    "management": [
      "Apply micronutrient foliar spray (Zn, Fe, Mn) twice a year",
      "Maintain regular irrigation"
    ],
    "prevention": [
      "Monitor orchard borders for citrus psyllid vectors"
    ]
  },
  {
    "id": "cotton-bacterial-blight",
    "crop": "Cotton",
    "name": "Bacterial Blight / Angular Leaf Spot",
    "pathogen": "Xanthomonas citri pv. malvacearum",
    "type": "Bacterial",
    "severity": "High",
    "summary": "Water-soaked angular leaf spots bounded by veinlets that turn dark brown to black.",
    "symptoms": [
      "Small angular water-soaked lesions restricted by veins",
      "Blackarm phase causing dark girdling of branches",
      "Boll rot with sunken black spots"
    ],
    "management": [
      "Spray Copper Oxychloride (2.5 g/L) + Streptocycline (1 g/10 L)",
      "Rogue severely affected plants"
    ],
    "prevention": [
      "Acid-delint certified seed before sowing",
      "Avoid flood irrigation during humid weather"
    ]
  },
  {
    "id": "cotton-curl-virus",
    "crop": "Cotton",
    "name": "Cotton Leaf Curl Virus (CLCuV)",
    "pathogen": "Begomovirus transmitted by Whiteflies",
    "type": "Viral",
    "severity": "High",
    "summary": "Upward or downward leaf curling, vein thickening, and enation cup-like growths.",
    "symptoms": [
      "Thickened green primary and secondary veins",
      "Severe upward curling of leaves",
      "Leaf-like outgrowths (enations) under leaves"
    ],
    "management": [
      "Spray Diafenthiuron (1 g/L) or Spiromesifen to control whitefly vector",
      "Uproot virus-infected plants"
    ],
    "prevention": [
      "Sow CLCuV-resistant Bt-cotton hybrids",
      "Maintain border weed control"
    ]
  },
  {
    "id": "cotton-healthy",
    "crop": "Cotton",
    "name": "Healthy Cotton",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": true,
    "summary": "Robust lobed cotton foliage with strong squaring and no pest puncture damage.",
    "symptoms": [
      "Broad, healthy lobed leaves",
      "Clean petioles and vigorous terminal growth",
      "Sturdy square/boll formation"
    ],
    "management": [
      "Apply balanced N-P-K with split nitrogen doses",
      "Monitor with pheromone traps"
    ],
    "prevention": [
      "Maintain optimal plant-to-plant spacing for aeration"
    ]
  },
  {
    "id": "corn-leaf-spot",
    "crop": "Corn (Maize)",
    "name": "Gray Leaf Spot",
    "pathogen": "Cercospora zeae-maydis (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Rectangular tan to gray lesions that expand parallel to leaf veins.",
    "symptoms": [
      "Narrow rectangular lesions bounded by parallel veins",
      "Lesions coalesce to cause extensive leaf blight",
      "Premature drying of canopy"
    ],
    "management": [
      "Apply Azoxystrobin + Difenoconazole (1 ml/L)",
      "Deep plow crop residues"
    ],
    "prevention": [
      "Rotate with non-host crops like soybean or pulses",
      "Plant resistant corn hybrids"
    ]
  },
  {
    "id": "corn-streak-virus",
    "crop": "Corn (Maize)",
    "name": "Maize Streak Virus (MSV)",
    "pathogen": "Mastrevirus transmitted by Leafhoppers (Cicadulina)",
    "type": "Viral",
    "severity": "High",
    "summary": "Continuous chlorotic streaks parallel to veins causing severe plant stunting.",
    "symptoms": [
      "Small round scattered chlorotic spots on young leaves",
      "Spots coalesce into continuous yellow-white longitudinal streaks",
      "Severe stunting and barren cobs"
    ],
    "management": [
      "Control vector leafhoppers with Imidacloprid (0.5 ml/L)",
      "Remove infected plants early"
    ],
    "prevention": [
      "Plant MSV-resistant hybrid maize",
      "Avoid planting near older grassy weeds"
    ]
  },
  {
    "id": "groundnut-late-leaf-spot",
    "crop": "Groundnut",
    "name": "Late Leaf Spot (Tikka)",
    "pathogen": "Phaeoisariopsis personata (Fungus)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Small circular almost black spots on lower leaf surface with carbonaceous pustules.",
    "symptoms": [
      "Small dark brown to black circular lesions on lower leaf surfaces",
      "No distinct yellow halo",
      "Severe defoliation leading to peg collapse"
    ],
    "management": [
      "Spray Tebuconazole 25.9% EC (1 ml/L) or Mancozeb (2.5 g/L)",
      "Spray at 15-day intervals during humid periods"
    ],
    "prevention": [
      "Follow 2-year crop rotation with millets/cereals",
      "Seed treatment with Trichoderma viride (10 g/kg)"
    ]
  },
  {
    "id": "groundnut-nutrient-deficiency",
    "crop": "Groundnut",
    "name": "Nutrient Deficiency (Fe / Zn / Ca)",
    "pathogen": "Physiological / Soil Mineral Imbalance",
    "type": "Nutritional",
    "severity": "Moderate",
    "summary": "Interveinal yellowing (Iron chlorosis) and poor pod filling due to calcium deficit.",
    "symptoms": [
      "Young emerging leaves turn ivory white or pale yellow",
      "Reduced leaflet size and stunting",
      "Pops (empty pods) due to calcium deficiency"
    ],
    "management": [
      "Spray Ferrous Sulphate (5 g/L) + Citric Acid (1 g/L)",
      "Apply Gypsum at pegging stage (200 kg/acre)"
    ],
    "prevention": [
      "Maintain soil pH between 6.0 and 7.5",
      "Incorporate organic compost into sandy soils"
    ]
  },
  {
    "id": "groundnut-healthy",
    "crop": "Groundnut",
    "name": "Healthy Groundnut",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": true,
    "summary": "Vigorous quadrifoliolate green groundnut leaves with strong peg penetration.",
    "symptoms": [
      "Uniform green four-leaflet foliage",
      "Sturdy branching with abundant yellow flowers",
      "Healthy peg formation"
    ],
    "management": [
      "Ensure earthing up at pegging stage",
      "Provide light irrigation during pod development"
    ],
    "prevention": [
      "Use certified disease-free seed kernels"
    ]
  },
  {
    "id": "papaya-bacterial-spot",
    "crop": "Papaya",
    "name": "Bacterial Canker / Spot",
    "pathogen": "Erwinia papayae (Bacterium)",
    "type": "Bacterial",
    "severity": "High",
    "summary": "Water-soaked translucent spots on leaves and petioles that rapidly turn brown.",
    "symptoms": [
      "Water-soaked angular spots on young foliage",
      "Stem and petiole collapse with water-soaked rot",
      "Foul-smelling bacterial exudate"
    ],
    "management": [
      "Spray Copper Oxychloride (2.5 g/L) + Kasugamycin (1.5 ml/L)",
      "Prune and burn infected plant parts"
    ],
    "prevention": [
      "Ensure excellent soil drainage",
      "Avoid tree wounding during weeding"
    ]
  },
  {
    "id": "papaya-ring-spot",
    "crop": "Papaya",
    "name": "Papaya Ring Spot Virus (PRSV)",
    "pathogen": "Potyvirus transmitted by Aphids",
    "type": "Viral",
    "severity": "High",
    "summary": "Severe mosaic, shoe-string leaf distortion, and oily green rings on stems and fruit.",
    "symptoms": [
      "Yellow mosaic and blistering on leaves",
      "Severe leaf reduction to veins (shoe-string symptom)",
      "Concentric oily ring marks on fruit and stems"
    ],
    "management": [
      "Spray Imidacloprid (0.3 ml/L) to control aphid vector",
      "Rogue out infected papaya trees promptly"
    ],
    "prevention": [
      "Plant PRSV-tolerant papaya hybrids (e.g., Red Lady 786)",
      "Erect maize/sorghum barrier crops"
    ]
  },
  {
    "id": "papaya-healthy",
    "crop": "Papaya",
    "name": "Healthy Papaya",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": true,
    "summary": "Large, healthy palmate papaya leaves with strong central trunk and prolific fruiting.",
    "symptoms": [
      "Large palmately lobed green leaves",
      "Firm hollow petioles without spots",
      "Vigorous trunk with healthy fruit clusters"
    ],
    "management": [
      "Apply 250 g N, 250 g P, 500 g K per plant annually",
      "Drench with Trichoderma around base"
    ],
    "prevention": [
      "Scout regularly for aphid colonies on leaf undersides"
    ]
  },
  {
    "id": "rice-brown-spot",
    "crop": "Rice",
    "name": "Brown Spot",
    "pathogen": "Bipolaris oryzae (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Oval to circular brown spots with yellow halos resembling sesame seeds.",
    "symptoms": [
      "Small oval dark brown spots with yellow halos",
      "Spots coalesce causing complete leaf blighting",
      "Discoloration and poor filling of grains"
    ],
    "management": [
      "Spray Mancozeb (2.5 g/L) or Propiconazole 25% EC (1 ml/L)",
      "Apply balanced nitrogen; avoid deficit"
    ],
    "prevention": [
      "Seed treatment with Carbendazim (2 g/kg seed)",
      "Ensure adequate soil potassium and silicon"
    ]
  },
  {
    "id": "rice-leaf-blast",
    "crop": "Rice",
    "name": "Leaf Blast",
    "pathogen": "Magnaporthe oryzae (Pyricularia oryzae)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Spindle-shaped elliptical lesions with gray-white centers and brownish margins.",
    "symptoms": [
      "Spindle-shaped diamond lesions with pointed ends",
      "Grayish white centers and brown-red borders",
      "Complete burning of entire paddy fields under heavy humidity"
    ],
    "management": [
      "Spray Tricyclazole 75% WP (0.6 g/L) or Isoprothiolane (1.5 ml/L)",
      "Drain field temporarily if excess nitrogen applied"
    ],
    "prevention": [
      "Use blast-resistant varieties",
      "Apply nitrogen in 3–4 split doses"
    ]
  },
  {
    "id": "rice-healthy",
    "crop": "Rice",
    "name": "Healthy Rice",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": true,
    "summary": "Vibrant upright linear paddy leaves with vigorous tillering and healthy panicles.",
    "symptoms": [
      "Clean green linear leaves without spots",
      "Strong tillering from base",
      "Clean sheath and panicle emergence"
    ],
    "management": [
      "Maintain standing water (2–5 cm) during vegetative stage",
      "Apply recommended N-P-K (120:60:60 kg/ha)"
    ],
    "prevention": [
      "Seed soaking with bio-fungicides before nursery sowing"
    ]
  },
  {
    "id": "soybean-caterpillar",
    "crop": "Soybean",
    "name": "Caterpillar / Semilooper Damage",
    "pathogen": "Chrysodeixis acuta / Spodoptera litura (Pest)",
    "type": "Pest",
    "severity": "Moderate",
    "summary": "Extensive foliar defoliation, skeletonization, and holes caused by voracious feeding.",
    "symptoms": [
      "Irregular holes chewed out of leaf lamina",
      "Skeletonized leaves with only veins remaining",
      "Fecal frass pellets visible on leaves"
    ],
    "management": [
      "Spray Chlorantraniliprole 18.5% SC (0.3 ml/L) or Emamectin Benzoate (0.4 g/L)",
      "Install pheromone traps (5/acre)"
    ],
    "prevention": [
      "Conserve natural predators like spiders and ladybugs",
      "Spray Bacillus thuringiensis (Bt) early"
    ]
  },
  {
    "id": "soybean-diabrotica",
    "crop": "Soybean",
    "name": "Diabrotica / Leaf Beetle Damage",
    "pathogen": "Diabrotica speciosa / Chrysomelidae (Pest)",
    "type": "Pest",
    "severity": "Moderate",
    "summary": "Pinhole perforations and shot-hole leaf damage caused by adult leaf beetles.",
    "symptoms": [
      "Circular shot-holes across leaf lamina",
      "Yellowing and ragged leaf margins",
      "Reduced photosynthetic surface area"
    ],
    "management": [
      "Spray Thiamethoxam 25% WG (0.3 g/L) or Lambda-cyhalothrin",
      "Spray during early morning when beetles are active"
    ],
    "prevention": [
      "Early sowing to escape peak beetle population",
      "Crop rotation with non-host grasses"
    ]
  },
  {
    "id": "sugarcane-brown-spot",
    "crop": "Sugarcane",
    "name": "Brown Spot",
    "pathogen": "Cercospora longipes (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Reddish-brown narrow oval lesions that expand along sugarcane leaf blades.",
    "symptoms": [
      "Small reddish-brown spots visible on both leaf surfaces",
      "Yellow halos around expanding lesions",
      "Premature drying of leaf canopy"
    ],
    "management": [
      "Spray Mancozeb (2.5 g/L) or Carbendazim (1 g/L)",
      "Strip off heavily infected lower dry leaves (detrashing)"
    ],
    "prevention": [
      "Plant resistant sugarcane varieties (e.g., Co 86032)",
      "Ensure proper drainage in furrow beds"
    ]
  },
  {
    "id": "sugarcane-grassy-shoot",
    "crop": "Sugarcane",
    "name": "Grassy Shoot Disease (GSD)",
    "pathogen": "Phytoplasma transmitted by Aphids (Melanaphis sacchari)",
    "type": "Bacterial",
    "severity": "High",
    "summary": "Profuse thin, stunted tillers with narrow chlorotic leaves resembling turf grass.",
    "symptoms": [
      "Prolific production of thin, slender tillers from stool base",
      "Narrow, pale yellow to papery white leaves",
      "Total absence of millable cane stalks"
    ],
    "management": [
      "Uproot and burn infected grassy shoot clumps immediately",
      "Spray Dimethoate (1.7 ml/L) to control aphid vectors"
    ],
    "prevention": [
      "Hot water treatment of setts (50°C for 2 hours) before planting",
      "Use tissue-cultured planting setts"
    ]
  },
  {
    "id": "sugarcane-healthy",
    "crop": "Sugarcane",
    "name": "Healthy Sugarcane",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": true,
    "summary": "Broad, vigorous arching sugarcane foliage with thick, sturdy sucrose-rich stalks.",
    "symptoms": [
      "Long, dark green arching leaf blades with serrated edges",
      "Thick, clean internodes without borer holes",
      "Vigorous stool canopy"
    ],
    "management": [
      "Apply N-P-K (250:100:120 kg/ha) with split nitrogen",
      "Trash mulching between cane rows"
    ],
    "prevention": [
      "Detrash dry lower leaves at 5th and 7th month for aeration"
    ]
  },
  {
    "id": "wheat-brown-rust",
    "crop": "Wheat",
    "name": "Brown Rust / Leaf Rust",
    "pathogen": "Puccinia triticina (Fungus)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Small round orange-brown pustules scattered irregularly across leaf blades.",
    "symptoms": [
      "Small circular to oval orange-brown pustules on upper leaf surface",
      "Pustules burst to release powdery brown urediniospores",
      "Premature leaf drying reducing grain weight"
    ],
    "management": [
      "Spray Propiconazole 25% EC (1 ml/L) or Tebuconazole at first appearance",
      "Repeat spray after 15 days if cool humid weather persists"
    ],
    "prevention": [
      "Sow rust-resistant wheat varieties (e.g., HD 2967, PBW 550)",
      "Avoid late sowing"
    ]
  },
  {
    "id": "wheat-yellow-rust",
    "crop": "Wheat",
    "name": "Yellow Rust / Stripe Rust",
    "pathogen": "Puccinia striiformis (Fungus)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Bright yellow powdery pustules arranged in narrow linear stripes parallel to veins.",
    "symptoms": [
      "Bright yellow pustules forming distinct continuous linear stripes",
      "Yellow powder rubs off on fingers",
      "Severe chlorosis and stunted grain filling"
    ],
    "management": [
      "Spray Propiconazole 25% EC (Tilt, 1 ml/L) immediately upon detection",
      "Ensure adequate water coverage (200 L/acre)"
    ],
    "prevention": [
      "Plant stripe-rust resistant cultivars",
      "Timely sowing in November to escape late season infection"
    ]
  },
  {
    "id": "wheat-healthy",
    "crop": "Wheat",
    "name": "Healthy Wheat",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": true,
    "summary": "Vigorous upright green wheat leaves with clean flag leaves and healthy earheads.",
    "symptoms": [
      "Clean, erect linear green leaves",
      "No pustules, powdery stripes, or spots",
      "Sturdy tillers with healthy flag leaf"
    ],
    "management": [
      "Provide timely irrigation at CRI, tillering, flowering, and milk stages",
      "Top-dress Urea before irrigation"
    ],
    "prevention": [
      "Seed treatment with biological or chemical protectants"
    ]
  },
  {
    "id": "sugarcane-red-rot",
    "crop": "Sugarcane",
    "name": "Red Rot",
    "pathogen": "Colletotrichum falcatum (Fungus)",
    "type": "Fungal",
    "severity": "Severe",
    "summary": "The most destructive disease of sugarcane (cancer of sugarcane), causing internal reddening with white cross-bands and crop wilting.",
    "symptoms": [
      "Red lesions on leaf midrib with small dark spots developing inside lesions",
      "Yellowing and withering of upper leaf canopy from top downward",
      "Internal stalk pith turns dull red with distinctive white transverse bands",
      "Alcoholic sour odor emanating when cane is split open"
    ],
    "management": [
      "Uproot and burn severely infected clumps immediately to prevent field spread",
      "Spray Carbendazim 50% WP (1 g/L) or Thiophanate-methyl (1.5 g/L) along root zones",
      "Dip seed setts in Carbendazim solution (1 g/L water) for 15 minutes before planting"
    ],
    "prevention": [
      "Plant certified disease-resistant varieties (e.g., Co 0238, Co 86032)",
      "Practice 2-year crop rotation with green manure or paddy",
      "Avoid ratoon cropping in previously infected fields"
    ]
  },
  {
    "id": "sugarcane-mosaic",
    "crop": "Sugarcane",
    "name": "Mosaic Virus",
    "pathogen": "Sugarcane Mosaic Virus (SCMV)",
    "type": "Viral",
    "severity": "Moderate",
    "summary": "A viral disease transmitted by aphids causing alternating patches of dark green and pale yellowish-green stripes on young leaves.",
    "symptoms": [
      "Mottling and mosaic pattern of dark green and pale yellowish-green on young leaves",
      "Linear yellowish streaks parallel to leaf veins",
      "Stunted stalk growth and reduced tillering in susceptible cultivars"
    ],
    "management": [
      "Spray Imidacloprid 17.8% SL (0.3 ml/L) or Thiamethoxam 25% WG (0.5 g/L) to control aphid vector populations",
      "Rogue out infected young shoots during early growth stages"
    ],
    "prevention": [
      "Use virus-free seed canes produced via tissue culture",
      "Eliminate grassy weeds bordering cane fields",
      "Aerated steam heat treatment (54°C for 2.5 hours) of seed canes"
    ]
  },
  {
    "id": "sugarcane-rust",
    "crop": "Sugarcane",
    "name": "Sugarcane Rust",
    "pathogen": "Puccinia melanocephala / Puccinia kuehnii (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Fungal rust causing elongated reddish-brown pustules on both leaf surfaces that rupture to release powdery spores.",
    "symptoms": [
      "Tiny elongated yellowish flecks on both surfaces of mature leaves",
      "Flecks rapidly enlarge into reddish-brown to dark orange pustules",
      "Pustules rupture releasing powdery rust spores; heavy infection leads to burnt appearance"
    ],
    "management": [
      "Spray Propiconazole 25% EC (1 ml/L) or Mancozeb 75% WP (2.5 g/L) at first sign of rust pustules",
      "Repeat spray after 14 days if cool humid conditions persist"
    ],
    "prevention": [
      "Plant rust-tolerant sugarcane cultivars",
      "Avoid excessive nitrogen fertilization",
      "Ensure wide row spacing (120 cm) for canopy aeration and light penetration"
    ]
  },
  {
    "id": "sugarcane-yellow-leaf",
    "crop": "Sugarcane",
    "name": "Yellow Leaf Disease",
    "pathogen": "Sugarcane Yellow Leaf Virus (SCYLV)",
    "type": "Viral",
    "severity": "High",
    "summary": "Widespread luteovirus transmitted by sugarcane aphids causing intense midrib yellowing, chlorosis, and stalk shrinkage.",
    "symptoms": [
      "Prominent bright yellow discoloration along the lower side of leaf midrib on leaves 3 to 6",
      "Yellowing spreads laterally from midrib into adjacent blade tissue",
      "In late stages, leaf tips dry up and necrosis extends backward",
      "Significant reduction in cane weight, diameter, and juice sucrose content"
    ],
    "management": [
      "Control vector aphids with targeted sprays of Dimethoate 30% EC (1.7 ml/L) or Acetamiprid 20% SP (0.2 g/L)",
      "Apply foliar micronutrient sprays (Zinc + Iron sulfate) to alleviate stress"
    ],
    "prevention": [
      "Strict quarantine and planting of certified virus-indexed micropropagated setts",
      "Hot water treatment of setts (50°C for 2 hours)",
      "Balanced N-P-K fertilization with adequate potassium"
    ]
  }
];


export const getDiseaseById = (id) => DISEASES.find((d) => d.id === id) || null;
export const getDiseasesByCrop = (crop) => DISEASES.filter((d) => d.crop.toLowerCase() === crop.toLowerCase());
